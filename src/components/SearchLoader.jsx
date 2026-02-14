import React from 'react';
import { motion } from 'framer-motion';

const SearchLoader = ({ scanTime = 0 }) => {
    const marketplaces = ['Amazon', 'eBay', 'AliExpress', 'Walmart', 'Target'];

    return (
        <motion.div
            className="w-full flex justify-center -mt-56 px-4 relative z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {/* Scanning Container */}
            <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">

                {/* Animated Scan Line */}
                <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electricPurple to-transparent shadow-[0_0_20px_#8A2BE2]"
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'linear'
                    }}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                    {/* Title */}
                    <motion.h3
                        className="text-2xl font-bold text-white mb-4"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        Scanning Marketplaces
                    </motion.h3>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                        <motion.div
                            className="h-full bg-gradient-to-r from-electricPurple to-neonMagenta rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{
                                duration: 3,
                                ease: 'easeInOut',
                                repeat: Infinity
                            }}
                        />
                    </div>

                    {/* Marketplace Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                        {marketplaces.map((mp, index) => (
                            <motion.span
                                key={mp}
                                className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm text-white/70"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <motion.span
                                    className="inline-block w-2 h-2 rounded-full bg-neonCyan mr-2"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.8,
                                        delay: index * 0.15
                                    }}
                                />
                                {mp}
                            </motion.span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 text-white/50 text-sm">
                        <span>
                            <span className="text-electricPurple font-mono">50+</span> marketplaces
                        </span>
                        <span>
                            <span className="text-neonCyan font-mono">{scanTime.toFixed(1)}s</span> elapsed
                        </span>
                    </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-electricPurple/50 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-neonMagenta/50 rounded-br-2xl" />
            </div>
        </motion.div>
    );
};

export default SearchLoader;
