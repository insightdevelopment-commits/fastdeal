import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Shield, Truck, TrendingDown, Package } from 'lucide-react';
import PriceSparkline from './PriceSparkline';
import AIMarketAnalysis from './AIMarketAnalysis';

const SearchResults = ({ results, scanTime, marketplacesCovered, totalFound, trustedCount, error }) => {

    if (error) {
        return (
            <motion.div
                className="w-full max-w-6xl mx-auto mt-12 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-xl">
                    <div className="text-red-400 text-xl font-bold mb-2">Search Failed</div>
                    <p className="text-white/60">{error}</p>
                    <p className="text-white/40 text-sm mt-4">Please try again or check your connection.</p>
                </div>
            </motion.div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <motion.div
                className="w-full max-w-6xl mx-auto mt-12 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="bg-obsidian/80 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-xl">
                    <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <div className="text-white/60 text-xl font-bold mb-2">No Products Found</div>
                    <p className="text-white/40">Try a different search term or adjust your filters.</p>
                </div>
            </motion.div>
        );
    }

    const getMarketplaceLogo = (marketplace) => {
        const logos = {
            amazon: '🛒',
            ebay: '🏪',
            aliexpress: '🌐'
        };
        return logos[marketplace?.toLowerCase()] || '🏬';
    };

    const getDeliveryTag = (days) => {
        if (days <= 3) return { text: `Fast: ${days} Days`, color: 'bg-green-500/20 text-green-400 border-green-500/40' };
        if (days <= 7) return { text: `Standard: ${days} Days`, color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
        return { text: `Global: ${days} Days`, color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
    };

    const getTrustBadge = (rating) => {
        if (rating >= 4.7) return { text: '98% Verified Seller', color: 'text-green-400' };
        if (rating >= 4.3) return { text: 'A+ Quality Score', color: 'text-blue-400' };
        return { text: 'Verified Seller', color: 'text-white/60' };
    };

    return (
        <motion.div
            className="w-full max-w-7xl mx-auto mt-12 px-4 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Results Header */}
            <motion.div
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Found <span className="text-electricPurple">{totalFound}</span> Premium Deals
                    </h2>
                    <p className="text-white/50 text-sm mt-2">
                        {trustedCount} verified deals • Scanned in <span className="text-neonCyan font-mono">{scanTime}</span>
                    </p>
                </div>
            </motion.div>

            {/* AI Market Analysis Block */}
            <AIMarketAnalysis products={results} />

            {/* 3x2 Grid of Deal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {results.slice(0, 6).map((product, index) => {
                        const isBestDeal = index === 0;
                        const delivery = getDeliveryTag(product.shipping?.estimatedDays || 5);
                        const trust = getTrustBadge(product.reviews?.avgRating || 4.5);

                        return (
                            <motion.div
                                key={product.id || index}
                                className={`group relative bg-obsidian/60 backdrop-blur-2xl rounded-2xl overflow-hidden transition-all duration-500
                                    ${isBestDeal
                                        ? 'border-2 border-neonCyan shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                                        : 'border border-white/10 hover:border-electricPurple/50'
                                    }`}
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                                whileHover={{ y: -8, scale: 1.02 }}
                            >
                                {/* Best Deal Badge */}
                                {isBestDeal && (
                                    <div className="absolute top-4 left-4 z-30 bg-gradient-to-r from-neonCyan to-electricPurple text-black text-xs font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.6)] uppercase tracking-wider">
                                        ⚡ Best Deal
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="relative h-56 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`${product.imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                                        <Package className="w-20 h-20 text-white/10" />
                                    </div>

                                    {/* Marketplace Logo */}
                                    <div className="absolute top-4 right-4 text-3xl opacity-70">
                                        {getMarketplaceLogo(product.marketplace)}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 space-y-4">
                                    {/* Product Name */}
                                    <h3 className="text-white font-bold text-xl leading-tight group-hover:text-electricPurple transition-colors duration-300">
                                        {product.title}
                                    </h3>

                                    {/* Trust Badge */}
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${trust.color}`} />
                                        <span className={`text-xs font-semibold ${trust.color}`}>
                                            {trust.text}
                                        </span>
                                    </div>

                                    {/* Simple Description */}
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        {product.description || "Premium build quality with latest technology and ultra-fast performance."}
                                    </p>

                                    {/* Price Track Sparkline */}
                                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/40 text-xs uppercase tracking-wide">30-Day Price</span>
                                            <TrendingDown className="w-3 h-3 text-neonCyan" />
                                        </div>
                                        <PriceSparkline currentPrice={typeof product.price === 'object' ? product.price?.total : product.price} />
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white">
                                            ${typeof product.price === 'object' ? product.price?.total?.toFixed(2) : product.price?.toFixed?.(2) || product.price}
                                        </span>
                                        {product.shipping?.cost?.usd > 0 && (
                                            <span className="text-white/30 text-sm">
                                                +${product.shipping.cost.usd}
                                            </span>
                                        )}
                                    </div>

                                    {/* Delivery Time Tag */}
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${delivery.color} font-semibold text-xs`}>
                                        <Truck className="w-3.5 h-3.5" />
                                        {delivery.text}
                                    </div>

                                    {/* View More Button */}
                                    <a
                                        href={product.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3.5 mt-4 bg-gradient-to-r from-electricPurple/80 to-neonMagenta/80 hover:from-electricPurple hover:to-neonMagenta text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_35px_rgba(138,43,226,0.6)] group/btn"
                                    >
                                        View More
                                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-t from-electricPurple/5 via-transparent to-neonCyan/5" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default SearchResults;
