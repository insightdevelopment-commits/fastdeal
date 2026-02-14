const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');

/**
 * POST /api/v1/ai/enhance-query
 * Enhance search query using AI
 */
router.post('/enhance-query', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        if (!groqService.isAvailable()) {
            return res.status(503).json({
                error: 'AI service not available',
                message: 'Groq API key not configured'
            });
        }

        const result = await groqService.enhanceSearchQuery(query);
        res.json(result);

    } catch (error) {
        console.error('AI enhance query error:', error);
        res.status(500).json({ error: 'Failed to enhance query' });
    }
});

/**
 * POST /api/v1/ai/compare
 * Get AI-powered product comparison insights
 */
router.post('/compare', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'Products array is required' });
        }

        if (!groqService.isAvailable()) {
            return res.status(503).json({
                error: 'AI service not available'
            });
        }

        const insights = await groqService.compareProducts(products);
        res.json({ insights });

    } catch (error) {
        console.error('AI compare error:', error);
        res.status(500).json({ error: 'Failed to compare products' });
    }
});

/**
 * POST /api/v1/ai/detect-intent
 * Detect user intent from search query
 */
router.post('/detect-intent', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        if (!groqService.isAvailable()) {
            return res.status(503).json({
                error: 'AI service not available'
            });
        }

        const intent = await groqService.detectIntent(query);
        res.json(intent);

    } catch (error) {
        console.error('AI intent detection error:', error);
        res.status(500).json({ error: 'Failed to detect intent' });
    }
});

/**
 * GET /api/v1/ai/status
 * Check AI service availability
 */
router.get('/status', (req, res) => {
    res.json({
        available: groqService.isAvailable(),
        features: groqService.isAvailable() ? [
            'query-enhancement',
            'product-comparison',
            'intent-detection'
        ] : []
    });
});

module.exports = router;
