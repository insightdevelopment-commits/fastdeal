import React from 'react';
import { motion } from 'framer-motion';

const GlitchText = ({ text }) => {
    return (
        <div className="relative inline-block text-4xl md:text-5xl lg:text-7xl font-bold font-orbitron text-white tracking-widest">
            <motion.span
                className="absolute top-0 left-0 -z-10 text-neonMagenta opacity-70"
                animate={{
                    x: [-2, 2, -1, 1, 0],
                    y: [1, -1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 0.2,
                    repeatType: "mirror",
                    repeatDelay: 2
                }}
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute top-0 left-0 -z-10 text-[#FF416C] opacity-70"
                animate={{
                    x: [2, -2, 1, -1, 0],
                    y: [-1, 1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    repeatType: "mirror",
                    repeatDelay: 3
                }}
            >
                {text}
            </motion.span>
            <span className="relative z-10">{text}</span>
        </div>
    );
};

const problems = [
    {
        title: "Product Quality",
        subtitle: "Hidden Defects",
        desc: "Buying blind leads to goods that don't match photos."
    },
    {
        title: "Trust Gap",
        subtitle: "Unreliable Sellers",
        desc: "Untrusted marketplaces with zero protection."
    },
    {
        title: "Price Inflation",
        subtitle: "Hidden Costs",
        desc: "High prices, hidden fees, and regional gouging."
    },
    {
        title: "Search Failure",
        subtitle: "Accuracy Dead-Ends",
        desc: "Current search engines fail on complex queries."
    },
    {
        title: "Logistics Nightmare",
        subtitle: "The Wait",
        desc: "Frustrating delivery times and shipping chaos."
    }
];

const Problem = ({ setHoverState }) => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-transparent relative z-10 px-4 py-12 md:py-0">
            {/* Background is handled by global canvas */}

            <div className="max-w-7xl w-full mx-auto relative z-20 flex flex-col items-center h-full justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 shrink-0"
                >
                    <h2 className="text-sm md:text-base text-[#FF416C] font-bold uppercase tracking-[0.3em] mb-2">The Reality</h2>
                    <GlitchText text="THE MARKET IS BROKEN" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 w-full">
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`
                                relative overflow-hidden rounded-2xl p-6 md:p-8 
                                bg-gradient-to-br from-obsidian/80 to-obsidian/60 
                                backdrop-blur-md border border-white/10
                                flex flex-col justify-between min-h-[220px]
                                group
                                ${index < 3 ? 'md:col-span-2' : 'md:col-span-3'}
                            `}
                            style={{
                                transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                            }}
                            initial={{ opacity: 0, scale: 0.9, y: 20, zIndex: 1 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            whileHover={{
                                scale: 1.05, // Slightly reduced scale to prevent huge jumps with bigger gap
                                zIndex: 50,
                                borderColor: "#FF416C",
                                boxShadow: "0 0 50px rgba(255, 65, 108, 0.2)"
                            }}
                            onHoverStart={() => setHoverState && setHoverState(true)}
                            onHoverEnd={() => setHoverState && setHoverState(false)}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            {/* Decorative Background Number */}
                            <div className="absolute right-6 top-6 text-4xl md:text-5xl font-bold font-orbitron text-[#FF416C] opacity-90 group-hover:text-white transition-colors duration-500 pointer-events-none select-none z-0">
                                0{index + 1}
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#FF416C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#FF416C] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#FF416C]" />

                            <div className="relative z-10">
                                <div className="text-xs font-mono text-[#FF416C] mb-2 opacity-80 tracking-widest">
                                    // PROBLEM_DETECTED
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#FF416C] transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <div className="text-sm text-white/60 font-medium tracking-wide uppercase mb-4">
                                    {item.subtitle}
                                </div>
                            </div>

                            <p className="text-white/80 leading-relaxed text-base relative z-10 font-light border-l-2 border-[#FF416C]/30 pl-4 group-hover:border-[#FF416C] transition-colors duration-300">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Problem;
