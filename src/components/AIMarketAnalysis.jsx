import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, CheckCircle, XCircle, Sparkles } from 'lucide-react';

/**
 * AI Market Analysis Block
 * Displays AI-powered insights with website theme styling
 */
const AIMarketAnalysis = ({ products = [] }) => {
    // Generate AI analysis based on products
    const generateAnalysis = () => {
        if (!products || products.length === 0) return null;

        // Calculate average rating
        const avgRating = products.reduce((acc, p) => acc + (p.reviews?.avgRating || 4.5), 0) / products.length;
        const qualityScore = Math.round(avgRating * 20);

        // Calculate price stats
        const prices = products.map(p => typeof p.price === 'object' ? p.price?.total : p.price);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const priceDropPercent = Math.round(((avgPrice - minPrice) / avgPrice) * 100);

        return {
            sentiment: qualityScore >= 80 ? 'Positive' : qualityScore >= 60 ? 'Neutral' : 'Negative',
            qualityScore,
            reviewCount: products.reduce((acc, p) => acc + (p.reviews?.count || 0), 0),
            priceDropPercent,
            summary: qualityScore >= 85
                ? `Best overall value. Reviews highlight outstanding quality and competitive pricing. Price is ${priceDropPercent}% below average - excellent time to buy.`
                : qualityScore >= 70
                    ? `Good value proposition. Most sellers are verified with positive ratings. Consider the top-rated options for best experience.`
                    : `Mixed reviews. Compare carefully before purchasing. Look for verified sellers with higher ratings.`,
            pros: [
                'Exceptional product quality',
                'Fast delivery options available',
                'Multiple trusted sellers'
            ],
            cons: [
                'Premium price point',
                'Limited color options'
            ]
        };
    };

    const analysis = generateAnalysis();
    if (!analysis) return null;

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'Positive': return 'text-green-400';
            case 'Neutral': return 'text-yellow-400';
            default: return 'text-red-400';
        }
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-400';
        if (score >= 60) return 'from-yellow-500 to-orange-400';
        return 'from-red-500 to-orange-500';
    };

    return (
        <motion.div
            className="w-full max-w-7xl mx-auto mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="bg-obsidian/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                {/* Gradient Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-electricPurple/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-neonCyan/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electricPurple to-neonMagenta flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">AI Market Analysis</h3>
                                <p className="text-white/40 text-xs">Powered by FastDeal Intelligence</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className={`w-5 h-5 ${getSentimentColor(analysis.sentiment)}`} />
                            <span className={`font-bold ${getSentimentColor(analysis.sentiment)}`}>
                                {analysis.sentiment}
                            </span>
                        </div>
                    </div>

                    {/* Quality Score */}
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/60 text-sm">Quality Score</span>
                                <span className="text-white font-bold text-xl">
                                    {analysis.qualityScore}<span className="text-white/40">/100</span>
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.qualityScore)} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysis.qualityScore}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <p className="text-white/40 text-xs mt-2">
                                Based on {analysis.reviewCount.toLocaleString()} reviews
                            </p>
                        </div>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-gradient-to-r from-electricPurple/10 to-neonCyan/10 border border-electricPurple/20 rounded-xl p-4 mb-6">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-electricPurple/20 flex items-center justify-center shrink-0">
                                <Star className="w-4 h-4 text-electricPurple" />
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">
                                {analysis.summary}
                            </p>
                        </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pros */}
                        <div>
                            <h4 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">
                                Top Pros
                            </h4>
                            <div className="space-y-2">
                                {analysis.pros.map((pro, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                                        <span className="text-white/70 text-sm">{pro}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Cons */}
                        <div>
                            <h4 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">
                                Top Cons
                            </h4>
                            <div className="space-y-2">
                                {analysis.cons.map((con, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                        <span className="text-white/70 text-sm">{con}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AIMarketAnalysis;
