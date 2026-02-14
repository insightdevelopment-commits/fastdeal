/**
 * Trust Ledger Service
 * Calculates vendor trustworthiness scores to filter unreliable sellers
 */
class TrustLedger {
    /**
     * Calculate trust score for a vendor
     * @param {Object} vendor - Vendor data
     * @param {Object} product - Product data for context
     * @returns {number} - Trust score (0-1)
     */
    calculateTrustScore(vendor, product) {
        const weights = {
            vendorRating: 0.4,
            reviewCount: 0.3,
            historicalReliability: 0.2,
            responseTime: 0.1
        };

        // Component scores (0-1 range)
        const vendorRatingScore = this.normalizeRating(vendor.rating);
        const reviewCountScore = this.normalizeReviewCount(product.reviews?.count || 0);
        const historicalScore = this.getHistoricalReliability(vendor.name, vendor.marketplace);
        const responseScore = this.getResponseTimeFactor(vendor.marketplace);

        const trustScore =
            vendorRatingScore * weights.vendorRating +
            reviewCountScore * weights.reviewCount +
            historicalScore * weights.historicalReliability +
            responseScore * weights.responseTime;

        return parseFloat(trustScore.toFixed(3));
    }

    /**
     * Normalize vendor rating to 0-1 scale
     */
    normalizeRating(rating) {
        if (!rating) return 0;
        // Assuming rating is out of 5
        return Math.min(rating / 5, 1);
    }

    /**
     * Normalize review count (logarithmic scale)
     */
    normalizeReviewCount(count) {
        if (count === 0) return 0;
        if (count >= 1000) return 1;

        // Log scale: 1 review = 0.1, 100 reviews = 0.5, 1000+ = 1.0
        return Math.log10(count + 1) / 3;
    }

    /**
     * Get historical reliability from database
     * TODO: Implement database lookup for vendor history
     */
    getHistoricalReliability(vendorName, marketplace) {
        // Placeholder - should query past order data
        const marketplaceDefaults = {
            amazon: 0.9,
            ebay: 0.7,
            aliexpress: 0.6
        };
        return marketplaceDefaults[marketplace] || 0.5;
    }

    /**
     * Response time factor by marketplace
     */
    getResponseTimeFactor(marketplace) {
        const responseTimes = {
            amazon: 0.95,  // Very fast
            ebay: 0.80,    // Moderate
            aliexpress: 0.60 // Slower
        };
        return responseTimes[marketplace] || 0.5;
    }

    /**
     * Filter products by minimum trust threshold
     */
    filterTrusted(products, minScore = 0.6) {
        return products.filter(product => {
            const trustScore = this.calculateTrustScore(
                product.vendor,
                product
            );
            product.vendor.trustScore = trustScore;
            return trustScore >= minScore;
        });
    }

    /**
     * Sort products by trust score (descending)
     */
    sortByTrust(products) {
        return products.sort((a, b) =>
            (b.vendor.trustScore || 0) - (a.vendor.trustScore || 0)
        );
    }
}

module.exports = new TrustLedger();
