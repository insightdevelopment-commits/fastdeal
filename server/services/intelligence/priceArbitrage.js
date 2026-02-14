/**
 * Price Arbitrage Calculator
 * Identifies best global deals by calculating True Cost across regions
 */
class PriceArbitrage {
    /**
     * Calculate True Cost of a product
     * @param {Object} product - Normalized product data
     * @returns {number} - True cost in USD
     */
    calculateTrueCost(product) {
        const basePrice = product.price.usd;
        const shippingCost = product.shipping?.cost?.usd || 0;
        const taxes = this.estimateTaxes(basePrice, product.metadata.region);
        const conversionFee = this.estimateConversionFee(product.price);

        const trueCost = basePrice + shippingCost + taxes + conversionFee;

        product.trueCost = {
            total: parseFloat(trueCost.toFixed(2)),
            breakdown: {
                basePrice,
                shipping: shippingCost,
                taxes,
                conversionFee
            }
        };

        return product.trueCost.total;
    }

    /**
     * Estimate local taxes
     */
    estimateTaxes(basePrice, region) {
        const taxRates = {
            US: 0.08,    // Average US sales tax
            EU: 0.20,    // Average EU VAT
            ASIA: 0.10   // Average Asia import tax
        };

        const rate = taxRates[region] || 0.10;
        return basePrice * rate;
    }

    /**
     * Estimate currency conversion fees
     */
    estimateConversionFee(price) {
        // 2-3% typical conversion fee for non-USD
        if (price.local.currency !== 'USD') {
            return price.usd * 0.025;
        }
        return 0;
    }

    /**
     * Find best deal from multiple products
     * @param {Array} products - List of normalized products
     * @returns {Object} - Best deal with savings analysis
     */
    findBestDeal(products) {
        // Calculate true cost for all products
        products.forEach(p => this.calculateTrueCost(p));

        // Sort by true cost
        const sorted = products.sort((a, b) => a.trueCost.total - b.trueCost.total);

        if (sorted.length === 0) return null;

        const bestDeal = sorted[0];
        const worstDeal = sorted[sorted.length - 1];
        const savings = worstDeal.trueCost.total - bestDeal.trueCost.total;
        const savingsPercent = (savings / worstDeal.trueCost.total) * 100;

        return {
            product: bestDeal,
            savings: {
                amount: parseFloat(savings.toFixed(2)),
                percent: parseFloat(savingsPercent.toFixed(1))
            },
            comparison: {
                lowestPrice: bestDeal.trueCost.total,
                highestPrice: worstDeal.trueCost.total,
                averagePrice: this.calculateAverage(sorted)
            }
        };
    }

    /**
     * Get top N deals
     */
    getTopDeals(products, count = 3) {
        products.forEach(p => this.calculateTrueCost(p));
        return products
            .sort((a, b) => a.trueCost.total - b.trueCost.total)
            .slice(0, count);
    }

    /**
     * Calculate regional price gaps
     */
    analyzeRegionalGaps(products) {
        const byRegion = products.reduce((acc, p) => {
            const region = p.metadata.region;
            if (!acc[region]) acc[region] = [];
            acc[region].push(this.calculateTrueCost(p));
            return acc;
        }, {});

        const gaps = {};
        for (const [region, prices] of Object.entries(byRegion)) {
            const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
            gaps[region] = {
                average: parseFloat(avg.toFixed(2)),
                lowest: Math.min(...prices),
                highest: Math.max(...prices)
            };
        }

        return gaps;
    }

    /**
     * Calculate average price
     */
    calculateAverage(products) {
        const sum = products.reduce((acc, p) => acc + p.trueCost.total, 0);
        return parseFloat((sum / products.length).toFixed(2));
    }
}

module.exports = new PriceArbitrage();
