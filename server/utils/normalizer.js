const axios = require('axios');

/**
 * Data Normalizer
 * Converts diverse marketplace formats to FastDeal Standard JSON
 */
class Normalizer {
    /**
     * Normalize product data to FastDeal Standard
     * @param {Object} rawData - Raw product data from marketplace
     * @param {string} marketplace - Source marketplace
     * @param {string} region - Region code
     * @returns {Object} - Normalized FastDeal Standard format
     */
    async normalize(rawData, marketplace, region) {
        const normalized = {
            id: this.generateHash(rawData.externalId, marketplace),
            title: this.normalizeTitle(rawData.title),
            price: await this.normalizePrice(rawData.price, rawData.currency),
            vendor: this.normalizeVendor(rawData, marketplace),
            shipping: this.estimateShipping(marketplace, region),
            reviews: this.normalizeReviews(rawData),
            metadata: {
                marketplace,
                region,
                externalId: rawData.externalId,
                url: rawData.url,
                imageUrl: rawData.imageUrl,
                condition: rawData.condition || 'new'
            }
        };

        return normalized;
    }

    /**
     * Generate unique product hash
     */
    generateHash(externalId, marketplace) {
        const crypto = require('crypto');
        return crypto
            .createHash('md5')
            .update(`${marketplace}-${externalId}`)
            .digest('hex');
    }

    /**
     * Normalize product title
     */
    normalizeTitle(title) {
        return title
            .trim()
            .replace(/\s+/g, ' ')
            .substring(0, 200); // Limit length
    }

    /**
     * Normalize price with currency conversion
     */
    async normalizePrice(amount, currency) {
        const usdAmount = await this.convertToUSD(amount, currency);

        return {
            usd: parseFloat(usdAmount.toFixed(2)),
            local: {
                amount: parseFloat(amount),
                currency: currency
            }
        };
    }

    /**
     * Convert any currency to USD
     */
    async convertToUSD(amount, fromCurrency) {
        if (fromCurrency === 'USD') {
            return amount;
        }

        try {
            const response = await axios.get(
                `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
            );
            const rate = response.data.rates.USD;
            return amount * rate;
        } catch (error) {
            console.error('Currency conversion failed:', error.message);
            // Fallback to approximate rates
            const fallbackRates = {
                EUR: 1.1,
                GBP: 1.25,
                JPY: 0.0067,
                CNY: 0.14
            };
            return amount * (fallbackRates[fromCurrency] || 1);
        }
    }

    /**
     * Normalize vendor information
     */
    normalizeVendor(rawData, marketplace) {
        return {
            name: rawData.sellerName || marketplace,
            marketplace: marketplace,
            rating: rawData.sellerRating || 0,
            trustScore: 0 // Will be calculated by Trust Ledger
        };
    }

    /**
     * Estimate shipping costs and time
     */
    estimateShipping(marketplace, region) {
        // Simplified estimation - should query actual shipping in production
        const estimates = {
            amazon: { cost: { usd: 0 }, days: 2 },
            ebay: { cost: { usd: 5 }, days: 5 },
            aliexpress: { cost: { usd: 0 }, days: 14 }
        };

        const baseEstimate = estimates[marketplace] || { cost: { usd: 10 }, days: 7 };

        // Adjust for region
        if (region !== 'US' && marketplace !== 'aliexpress') {
            baseEstimate.cost.usd += 10;
            baseEstimate.days += 3;
        }

        return {
            cost: baseEstimate.cost,
            estimatedDays: baseEstimate.days
        };
    }

    /**
     * Normalize review data
     */
    normalizeReviews(rawData) {
        return {
            count: rawData.reviewCount || 0,
            avgRating: rawData.rating || 0,
            qualityScore: 0 // Will be calculated by NLP service
        };
    }

    /**
     * Batch normalize multiple products
     */
    async batchNormalize(products, marketplace, region) {
        return Promise.all(
            products.map(product => this.normalize(product, marketplace, region))
        );
    }
}

module.exports = new Normalizer();
