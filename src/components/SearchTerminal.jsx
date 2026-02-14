import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, CheckCircle } from 'lucide-react';

const SearchTerminal = () => {
    const [step, setStep] = useState(0); // 0: Idle, 1: Typing, 2: Scanning, 3: Result
    const [typedText, setTypedText] = useState("");
    const targetText = "white T-shirt for $5";

    useEffect(() => {
        // Animation sequencer
        let timeouts = [];

        const startAnimation = () => {
            setStep(1);
            setTypedText("");

            // Typing animation
            let textIndex = 0;
            const typeInterval = setInterval(() => {
                if (textIndex < targetText.length) {
                    setTypedText(prev => prev + targetText.charAt(textIndex));
                    textIndex++;
                } else {
                    clearInterval(typeInterval);
                    // Transition to Scanning
                    timeouts.push(setTimeout(() => setStep(2), 500));
                }
            }, 100);
            timeouts.push(typeInterval);
        };

        // Auto-start loop
        startAnimation();

        // After scanning, show result
        timeouts.push(setTimeout(() => {
            if (textIndex >= targetText.length) setStep(3); // Safety check logic simplified in interval above
        }, 4000)); // Rough timing: 2s typing + 0.5s pause + 1.5s scan

        // Loop reset
        const resetTimeout = setTimeout(() => {
            setStep(0);
            setTypedText("");
            startAnimation();
        }, 10000); // Reset every 10s

        return () => {
            timeouts.forEach(t => clearTimeout(t));
            // interval cleared inside
        };
    }, []);

    // Simplified logic for robust sequencing using just setTimeout chain
    useEffect(() => {
        let active = true;

        const runSequence = async () => {
            if (!active) return;
            setStep(1);
            setTypedText("");

            // Type
            for (let i = 0; i <= targetText.length; i++) {
                if (!active) return;
                setTypedText(targetText.slice(0, i));
                await new Promise(r => setTimeout(r, 100));
            }

            await new Promise(r => setTimeout(r, 500));
            if (!active) return;
            setStep(2); // Scan

            await new Promise(r => setTimeout(r, 2000));
            if (!active) return;
            setStep(3); // Result

            await new Promise(r => setTimeout(r, 5000));
            if (active) runSequence(); // Loop
        };

        runSequence();
        return () => { active = false; };
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(138,43,226,0.2)]">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-xs text-white/40 font-mono">fastdeal-intelligence-v1.0</span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 h-[400px] relative flex flex-col items-center justify-center">

                {/* Search Bar Mockup */}
                <motion.div
                    className="w-full max-w-md relative z-20"
                    animate={{
                        y: step === 3 ? -80 : 0,
                        scale: step === 3 ? 0.9 : 1
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
                        <Search className="text-white/50 mr-3" size={20} />
                        <span className="font-mono text-white/90">{typedText}</span>
                        {step === 1 && (
                            <motion.span
                                className="w-2 h-5 bg-neonMagenta ml-1"
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            />
                        )}
                    </div>
                </motion.div>

                {/* Scanning Effect */}
                <AnimatePresence>
                    {step === 2 && (
                        <motion.div
                            className="absolute inset-x-0 h-[2px] bg-electricPurple shadow-[0_0_20px_#8A2BE2]"
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    )}
                </AnimatePresence>

                {/* Result Card */}
                <AnimatePresence>
                    {step === 3 && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="bg-obsidian border border-neonMagenta/50 rounded-xl p-4 overflow-hidden relative">
                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-neonMagenta text-white text-xs font-bold px-2 py-1 rounded shadow-[0_0_10px_#FF00FF]">
                                    99% MATCH
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                                        <Package className="text-white/30" size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Premium Cotton Tee</h3>
                                        <p className="text-white/50 text-sm">FlowState Fabrication</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-2xl font-bold text-electricPurple">$4.99</span>
                                            <span className="text-xs text-white/40 line-through">$12.00</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                                            <CheckCircle size={12} />
                                            <span>Verified Quality</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default SearchTerminal;
