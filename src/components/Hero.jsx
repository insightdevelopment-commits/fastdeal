import React from 'react';
import { motion } from 'framer-motion';
import useAccessGuard from '../hooks/useAccessGuard';
import { useModal } from '../context/ModalContext';

const files = [
    'Amazon_2024.svg.png',
    'EBay_logo.png',
    'Walmart_logo_(2025;_Stacked_alt).svg.png',
    'ozon.png',
    'removebg (1).png',
    'removebg (2).png',
    'removebg (3).png',
    'removebg (4).png',
    'removebg.png'
];

const LogoColumn = ({ reverse = false }) => {
    return (
        <div className="flex flex-col gap-12 py-12 items-center">
            {/* Duplicate array for infinite loop */}
            {[...files, ...files].map((file, index) => (
                <div
                    key={index}
                    className="w-28 h-28 md:w-32 md:h-32 shrink-0 hover:scale-110 transition-transform duration-300 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                >
                    <img
                        src={`/logos/${file}`}
                        alt="Marketplace"
                        className="w-full h-full object-contain"
                    />
                </div>
            ))}
        </div>
    );
};

const Hero = () => {
    const { handleAccess } = useAccessGuard();
    const { openPricingModal } = useModal();

    return (
        <div className="flex-grow w-full flex flex-col items-center justify-center relative bg-gradient-radial from-deepViolet/20 to-obsidian overflow-hidden">
            <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-20"></div>

            {/* Left Marquee */}
            <div className="absolute left-4 md:left-12 top-0 bottom-0 w-32 hidden md:flex flex-col overflow-hidden mask-gradient-y opacity-80 mix-blend-screen" style={{ willChange: 'transform' }}>
                <motion.div
                    className="flex flex-col gap-8"
                    animate={{ y: ["0%", "-33.33%"] }}
                    transition={{
                        duration: 30, // Slower for majesty
                        ease: "linear",
                        repeat: Infinity
                    }}
                >
                    <LogoColumn />
                </motion.div>
            </div>

            {/* Right Marquee */}
            <div className="absolute right-4 md:right-12 top-0 bottom-0 w-32 hidden md:flex flex-col overflow-hidden mask-gradient-y opacity-80 mix-blend-screen">
                <motion.div
                    className="flex flex-col gap-8"
                    animate={{ y: ["-33.33%", "0%"] }}
                    transition={{
                        duration: 30, // Slower for majesty
                        ease: "linear",
                        repeat: Infinity
                    }}
                >
                    <LogoColumn reverse />
                </motion.div>
            </div>

            <motion.h1
                className="text-[5rem] md:text-[8.5rem] leading-none font-orbitron font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-electricPurple via-neonMagenta to-deepViolet z-10 drop-shadow-[0_0_20px_rgba(138,43,226,0.5)]"
                initial={{ scale: 0.5, opacity: 0, letterSpacing: "10px" }}
                whileInView={{ scale: 1, opacity: 1, letterSpacing: "0px" }}
                animate={{
                    scale: [1, 1.02, 1],
                    filter: [
                        "drop-shadow(0 0 20px rgba(138,43,226,0.5))",
                        "drop-shadow(0 0 40px rgba(138,43,226,0.8))",
                        "drop-shadow(0 0 20px rgba(138,43,226,0.5))"
                    ]
                }}
                transition={{
                    initial: { duration: 1.2, ease: "easeOut" },
                    animate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                FASTDEAL
            </motion.h1>

            <motion.p
                className="mt-6 text-2xl md:text-4xl font-outfit text-center max-w-4xl px-4 z-10 leading-relaxed text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Finding the world's best deals through algorithmic precision.
            </motion.p>

            <div className="mt-12 flex flex-col md:flex-row gap-6 z-10">
                <motion.button
                    onClick={() => handleAccess('/search')}
                    className="px-8 py-3 rounded-full border border-neonMagenta/50 text-neonMagenta font-bold uppercase tracking-widest hover:bg-neonMagenta hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_40px_rgba(255,0,255,0.6)]"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    Start Exploring
                </motion.button>

                <motion.button
                    onClick={openPricingModal}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-electricPurple to-deepViolet text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(138,43,226,0.5)" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    Pricing
                </motion.button>
            </div>
        </div>
    );
};

export default Hero;
