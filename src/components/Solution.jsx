import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Solution = () => {
    const containerRef = useRef(null);

    const features = [
        {
            title: "Deep Market Analysis",
            subtitle: "Real-Time Verification",
            description: "Algorithms scan price, quality, and shipping simultaneously to ensure zero-compromise results.",
            align: "left"
        },
        {
            title: "The \"Perfect Match\"",
            subtitle: "Global Inventory Aggregation",
            description: "We don't just search. We aggregate global inventory to provide the single best search result.",
            align: "right"
        },
        {
            title: "Logistics Engine",
            subtitle: "Route & Vendor Analysis",
            description: "Solving high delivery times through intelligent route optimization and trusted vendor filtering.",
            align: "left"
        }
    ];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 overflow-hidden z-10">
            {/* Background Video */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-5xl h-[600px] z-0 pointer-events-none rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-obsidian/40 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                >
                    <source src="/videos/fastdealvid.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Main Title */}
            <motion.div
                className="text-center mb-24 relative z-20"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="inline-block px-3 py-1 bg-electricPurple/10 border border-electricPurple/30 rounded-full text-electricPurple text-xs font-mono mb-4 tracking-widest uppercase">
                    Core Architecture
                </div>
                <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4">
                    VERTICAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonMagenta">INTELLIGENCE</span>
                </h2>
                <p className="text-white/60 font-outfit max-w-2xl mx-auto">
                    A synchronized stream of data, logic, and logistics running in parallel.
                </p>
            </motion.div>

            {/* The Vertical Stream Container */}
            <div className="relative w-full max-w-5xl flex flex-col items-center">

                {/* Central Data Pillar (The "Tube") */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/10 z-0">
                    <motion.div
                        className="absolute top-0 bottom-0 w-full bg-electricPurple shadow-[0_0_15px_#8A2BE2]"
                        initial={{ height: "0%" }}
                        whileInView={{ height: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    {/* Floating Particles in Pillar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-neonMagenta animate-ping rounded-full mt-[20%]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-neonCyan animate-ping rounded-full mt-[60%] delay-700" />
                </div>

                {/* Features List */}
                <div className="w-full flex flex-col gap-32 md:gap-40 py-20 relative z-10">
                    {features.map((feature, index) => (
                        <FeatureNode key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const FeatureNode = ({ feature, index }) => {
    const isLeft = feature.align === 'left';

    return (
        <motion.div
            className={`flex w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center justify-between group`}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-45% 0px -45% 0px" }} // Trigger exactly in center
            transition={{ duration: 0.8 }}
        >
            {/* Content Card */}
            <div className={`w-[40%] md:w-[35%] ${isLeft ? 'text-right' : 'text-left'} transition-colors duration-500`}>
                <motion.h3
                    className="text-2xl md:text-4xl font-orbitron font-bold text-white mb-2 group-hover:text-neonMagenta transition-colors duration-300"
                >
                    {feature.title}
                </motion.h3>
                <div className={`text-electricPurple font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                    {feature.subtitle}
                </div>
                <p className="text-white/60 font-outfit text-sm md:text-base leading-relaxed">
                    {feature.description}
                </p>
            </div>

            {/* Connection Line */}
            <div className={`flex-1 h-[1px] relative bg-white/10 mx-6 ${isLeft ? 'origin-right' : 'origin-left'}`}>
                <motion.div
                    className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-electricPurple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#8A2BE2]"
                    layoutId={`line-${index}`}
                />
            </div>

            {/* Central Node Visual (On The Pillar) */}
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-obsidian border border-white/20 z-20 group-hover:border-neonMagenta group-hover:scale-150 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-electricPurple opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse shadow-[0_0_15px_#FF00FF]" />
            </div>

            {/* Empty Space for Balance */}
            <div className="w-[40%] md:w-[35%]" />
        </motion.div>
    );
}

export default Solution;
