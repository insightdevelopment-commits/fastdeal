import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TransitionText = () => {
    const [index, setIndex] = useState(0);

    const phrases = [
        "Stop the endless scroll. Unlock the world's best deals in seconds.",
        "Forget high prices and low-tier quality. Algorithms do it better.",
        "The borderless shopping era is here. Are you on the waitlist?"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 10000); // 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full py-32 flex items-center justify-center bg-transparent relative z-20 overflow-hidden">
            <div className="w-full max-w-6xl px-6 text-center">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={index}
                        className="text-3xl md:text-5xl font-orbitron font-bold uppercase tracking-[0.2em] leading-tight md:leading-snug"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)"
                        }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        <motion.span
                            className="bg-clip-text text-transparent bg-gradient-to-r from-electricPurple to-neonMagenta"
                            animate={{
                                filter: [
                                    "drop-shadow(0 0 20px rgba(138,43,226,0.3))",
                                    "drop-shadow(0 0 40px rgba(138,43,226,0.6))",
                                    "drop-shadow(0 0 20px rgba(138,43,226,0.3))"
                                ]
                            }}
                            transition={{
                                duration: 5, // Half of rotation time for a full pulse cycle (up and down)
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut"
                            }}
                        >
                            {phrases[index]}
                        </motion.span>
                    </motion.h3>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TransitionText;
