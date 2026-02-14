const axios = require('axios');
const Bottleneck = require('bottleneck');

// Rate limiter: 1 request per second per marketplace
const limiter = new Bottleneck({
    minTime: 1000,
    maxConcurrent: 1
});

/**
 * Marketplace API Service
 * Handles parallel API calls to Amazon, eBay, and AliExpress
 */
class MarketplaceService {
    constructor() {
        this.marketplaces = {
            amazon: this.searchAmazon.bind(this),
            ebay: this.searchEbay.bind(this),
            aliexpress: this.searchAliExpress.bind(this)
        };
    }

    /**
     * Execute parallel search across all marketplaces
     * @param {string} query - Search query
     * @param {string} region - Region code (US, EU, ASIA)
     * @returns {Object} - Aggregated results from all marketplaces
     */
    async parallelSearch(query, region = 'US') {
        const startTime = Date.now();

        // Execute all searches in parallel with 1s timeout each
        const promises = Object.entries(this.marketplaces).map(([name, searchFn]) =>
            limiter.schedule(() =>
                Promise.race([
                    searchFn(query, region),
                    this.timeout(1000)
                ])
                    .then(results => ({ name, success: true, results }))
                    .catch(error => ({ name, success: false, error: error.message }))
            )
        );

        const results = await Promise.allSettled(promises);
        const scanTime = ((Date.now() - startTime) / 1000).toFixed(2);

        return {
            results: results
                .filter(r => r.status === 'fulfilled' && r.value.success)
                .flatMap(r => r.value.results),
            scanTime: `${scanTime}s`,
            marketplacesCovered: results
                .filter(r => r.status === 'fulfilled' && r.value.success)
                .map(r => r.value.name)
        };
    }

    /**
     * Amazon search via Rainforest API
     */
    async searchAmazon(query, region) {
        if (!process.env.RAINFOREST_API_KEY) {
            throw new Error('Rainforest API key not configured');
        }

        const response = await axios.get('https://api.rainforestapi.com/request', {
            params: {
                api_key: process.env.RAINFOREST_API_KEY,
                type: 'search',
                amazon_domain: this.getAmazonDomain(region),
                search_term: query,
                max_page: 1
            }
        });

        return this.normalizeAmazonResults(response.data.search_results || []);
    }

    /**
     * eBay search via Buy API
     */
    async searchEbay(query, region) {
        if (!process.env.EBAY_CLIENT_ID) {
            throw new Error('eBay API credentials not configured');
        }

        // Get OAuth token (simplified - should be cached in production)
        const token = await this.getEbayToken();

        const response = await axios.get('https://api.ebay.com/buy/browse/v1/item_summary/search', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-EBAY-C-MARKETPLACE-ID': this.getEbayMarketplace(region)
            },
            params: {
                q: query,
                limit: 20
            }
        });

        return this.normalizeEbayResults(response.data.itemSummaries || []);
    }

    /**
     * AliExpress search via Open Platform
     */
    async searchAliExpress(query, region) {
        if (!process.env.ALIEXPRESS_APP_KEY) {
            throw new Error('AliExpress API credentials not configured');
        }

        // Note: AliExpress API requires signature generation
        // This is a simplified version - implement proper signing in production
        const response = await axios.post('https://api-sg.aliexpress.com/sync', {
            method: 'aliexpress.ds.product.get',
            app_key: process.env.ALIEXPRESS_APP_KEY,
            keywords: query,
            page_size: 20
        });

        return this.normalizeAliExpressResults(response.data.result?.products || []);
    }

    /**
     * Helper: Timeout promise
     */
    timeout(ms) {
        return new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), ms)
        );
    }

    /**
     * Helper: Get Amazon domain by region
     */
    getAmazonDomain(region) {
        const domains = {
            US: 'amazon.com',
            EU: 'amazon.de',
            ASIA: 'amazon.co.jp'
        };
        return domains[region] || domains.US;
    }

    /**
     * Helper: Get eBay marketplace ID
     */
    getEbayMarketplace(region) {
        const marketplaces = {
            US: 'EBAY_US',
            EU: 'EBAY_DE',
            ASIA: 'EBAY_JP'
        };
        return marketplaces[region] || marketplaces.US;
    }

    /**
     * Helper: Get eBay OAuth token
     */
    async getEbayToken() {
        const auth = Buffer.from(
            `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
        ).toString('base64');

        const response = await axios.post(
            'https://api.ebay.com/identity/v1/oauth2/token',
            'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${auth}`
                }
            }
        );

        return response.data.access_token;
    }

    /**
     * Normalize Amazon results to FastDeal Standard
     */
    normalizeAmazonResults(items) {
        return items.map(item => ({
            marketplace: 'amazon',
            externalId: item.asin,
            title: item.title,
            price: item.price?.value,
            currency: item.price?.currency,
            imageUrl: item.image,
            rating: item.rating,
            reviewCount: item.ratings_total,
            url: item.link
        }));
    }

    /**
     * Normalize eBay results to FastDeal Standard
     */
    normalizeEbayResults(items) {
        return items.map(item => ({
            marketplace: 'ebay',
            externalId: item.itemId,
            title: item.title,
            price: item.price?.value,
            currency: item.price?.currency,
            imageUrl: item.image?.imageUrl,
            condition: item.condition,
            url: item.itemWebUrl
        }));
    }

    /**
     * Normalize AliExpress results to FastDeal Standard
     */
    normalizeAliExpressResults(items) {
        return items.map(item => ({
            marketplace: 'aliexpress',
            externalId: item.product_id,
            title: item.product_title,
            price: item.target_sale_price,
            currency: 'USD',
            imageUrl: item.product_main_image_url,
            rating: item.evaluate_rate,
            url: item.product_detail_url
        }));
    }
}

module.exports = new MarketplaceService();
