import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const Goal = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-transparent relative z-10 overflow-hidden">
            {/* Central Glowing Orb/Planet Representation */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <motion.div
                    className="mb-8 p-4 rounded-full bg-white/5 border border-white/20 backdrop-blur-md"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <Globe size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </motion.div>

                <motion.h2
                    className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(138,43,226,0.6)]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    GLOBAL ACCESS
                </motion.h2>

                <motion.p
                    className="text-xl md:text-3xl text-white/90 font-outfit font-light max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                >
                    Consolidating the world's inventory into a <span className="text-neonMagenta font-normal">single, perfect match.</span>
                </motion.p>
            </div>
        </div>
    );
};

export default Goal;
