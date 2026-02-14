const express = require('express');
const router = express.Router();
const { searchLimiter } = require('../middleware/rateLimiter');
const marketplaceService = require('../services/scraper/marketplaceService');
const normalizer = require('../utils/normalizer');
const trustLedger = require('../services/intelligence/trustLedger');
const priceArbitrage = require('../services/intelligence/priceArbitrage');
const supabase = require('../config/supabase');
const { generateMockResults } = require('../utils/mockData');

// Check if we should use mock data (no API keys configured)
const USE_MOCK_DATA = !process.env.RAINFOREST_API_KEY ||
    process.env.RAINFOREST_API_KEY === 'your_rainforest_api_key_here' ||
    process.env.USE_MOCK_DATA === 'true';

/**
 * POST /api/v1/search
 * Global marketplace search endpoint
 */
router.post('/', searchLimiter, async (req, res) => {
    try {
        const { query, region = 'US', filters = {} } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const startTime = Date.now();

        // Use mock data if API keys aren't configured OR if searching for "iphone" (Demo Mode)
        const isDemoQuery = query.toLowerCase().includes('iphone');

        if (USE_MOCK_DATA || isDemoQuery) {
            console.log(`Using mock data (Reason: ${isDemoQuery ? 'Demo Query' : 'API Keys Missing'})`);
            const mockResults = generateMockResults(query, region);
            return res.json(mockResults);
        }

        // Step 1: Execute parallel marketplace search
        const searchResults = await marketplaceService.parallelSearch(query, region);

        if (!searchResults.results || searchResults.results.length === 0) {
            return res.json({
                results: [],
                scanTime: searchResults.scanTime,
                marketplacesCovered: searchResults.marketplacesCovered,
                message: 'No products found'
            });
        }

        // Step 2: Normalize all results
        const normalizedProducts = [];
        for (const marketplace of searchResults.marketplacesCovered) {
            const marketplaceResults = searchResults.results.filter(
                r => r.marketplace === marketplace
            );
            const normalized = await normalizer.batchNormalize(
                marketplaceResults,
                marketplace,
                region
            );
            normalizedProducts.push(...normalized);
        }

        // Step 3: Apply Trust Ledger filter
        const minTrustScore = filters.minTrustScore || 0.6;
        const trustedProducts = trustLedger.filterTrusted(
            normalizedProducts,
            minTrustScore
        );

        // Step 4: Calculate true costs and find best deals
        const topDeals = priceArbitrage.getTopDeals(trustedProducts, 10);

        // Step 5: Cache results in Supabase
        try {
            const upsertData = topDeals.map(product => ({
                product_hash: product.id,
                title: product.title,
                normalized_data: product,
                marketplace: product.metadata.marketplace,
                region: product.metadata.region,
                last_scanned: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('products')
                .upsert(upsertData, { onConflict: 'product_hash' });

            if (error) {
                console.error('Supabase cache error:', error);
            }
        } catch (dbError) {
            console.log('Skipping cache - database error:', dbError);
        }

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

        // Step 6: Return results
        res.json({
            results: topDeals.map(p => ({
                id: p.id,
                title: p.title,
                price: p.trueCost,
                vendor: p.vendor,
                marketplace: p.metadata.marketplace,
                imageUrl: p.metadata.imageUrl,
                url: p.metadata.url,
                shipping: p.shipping,
                reviews: p.reviews
            })),
            scanTime: `${totalTime}s`,
            marketplacesCovered: searchResults.marketplacesCovered,
            totalFound: normalizedProducts.length,
            trustedCount: trustedProducts.length,
            filters: {
                minTrustScore
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message
        });
    }
});

/**
 * GET /api/v1/search/suggestions
 * Get instant search suggestions
 */
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json({ suggestions: [] });
        }

        // Search cached products using Supabase Full Text Search
        const { data, error } = await supabase
            .from('products')
            .select('title, product_hash')
            .textSearch('title', q, {
                type: 'websearch',
                config: 'english'
            })
            .limit(5);

        if (error) {
            throw error;
        }

        res.json({
            suggestions: (data || []).map(s => ({
                text: s.title,
                id: s.product_hash
            }))
        });

    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
});

module.exports = router;
