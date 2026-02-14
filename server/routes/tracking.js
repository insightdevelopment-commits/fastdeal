const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

/**
 * GET /api/v1/tracking/:productId
 * Get price history for a product
 */
router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { days = 30, marketplace } = req.query;

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Build query
        let query = supabase
            .from('price_history')
            .select('*')
            .eq('product_hash', productId)
            .gte('scanned_at', startDate.toISOString())
            .order('scanned_at', { ascending: true });

        if (marketplace) {
            query = query.eq('marketplace', marketplace);
        }

        const { data: history, error } = await query;

        if (error) {
            throw error;
        }

        if (!history || history.length === 0) {
            return res.status(404).json({
                error: 'No price history found for this product'
            });
        }

        // Calculate trend
        const prices = history.map(h => h.true_cost || h.price.usd);
        const trend = this.calculateTrend(prices);
        const prediction = this.predictNextWeek(prices);

        res.json({
            productId,
            priceHistory: history.map(h => ({
                date: h.scanned_at,
                price: h.true_cost || h.price.usd,
                marketplace: h.marketplace,
                vendor: h.vendor?.name,
                trustScore: h.vendor?.trustScore
            })),
            trend,
            prediction,
            stats: {
                currentPrice: prices[prices.length - 1],
                lowestPrice: Math.min(...prices),
                highestPrice: Math.max(...prices),
                averagePrice: parseFloat((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2))
            }
        });

    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({
            error: 'Failed to retrieve price history'
        });
    }
});

/**
 * POST /api/v1/tracking/subscribe
 * Subscribe to price alerts
 */
router.post('/subscribe', async (req, res) => {
    try {
        const { productId, targetPrice, email } = req.body;

        // TODO: Implement price alert subscription with Supabase (e.g. alerts table)
        // Store in database and send email when price drops below target

        res.json({
            message: 'Price alert subscription created',
            productId,
            targetPrice,
            email
        });

    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

/**
 * Helper: Calculate price trend
 */
function calculateTrend(prices) {
    if (prices.length < 2) return 'stable';

    const recent = prices.slice(-7); // Last 7 data points
    const older = prices.slice(0, Math.min(7, prices.length - 7));

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0
        ? older.reduce((a, b) => a + b, 0) / older.length
        : recentAvg;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change < -5) return 'decreasing';
    if (change > 5) return 'increasing';
    return 'stable';
}

/**
 * Helper: Predict next week's price
 */
function predictNextWeek(prices) {
    if (prices.length < 3) {
        return {
            price: prices[prices.length - 1],
            confidence: 0.3
        };
    }

    // Simple linear regression
    const n = Math.min(prices.length, 14); // Use last 2 weeks
    const recentPrices = prices.slice(-n);

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += recentPrices[i];
        sumXY += i * recentPrices[i];
        sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const prediction = slope * (n + 7) + intercept; // Predict 7 days ahead

    return {
        price: parseFloat(Math.max(prediction, 0).toFixed(2)),
        confidence: 0.7 // Moderate confidence
    };
}

module.exports = router;
