import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const salesData = [
    { year: 2021, value: 4.98 },
    { year: 2022, value: 5.29 },
    { year: 2023, value: 5.82 },
    { year: 2024, value: 6.33 },
    { year: 2025, value: 6.86, label: "Current Status" },
    { year: 2026, value: 7.41, label: "Projected" },
    { year: 2027, value: 7.96, label: "Projected" },
];

// Helper to generate a smooth bezier path
const generateSmoothPath = (points, width, height, maxVal, minVal) => {
    // Normalize points first
    const normalizedPoints = points.map((d, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((d.value - minVal) / (maxVal - minVal)) * height;
        return [x, y];
    });

    if (normalizedPoints.length === 0) return "";

    // Start path
    let path = `M ${normalizedPoints[0][0]},${normalizedPoints[0][1]}`;

    for (let i = 0; i < normalizedPoints.length - 1; i++) {
        const p0 = normalizedPoints[i === 0 ? 0 : i - 1];
        const p1 = normalizedPoints[i];
        const p2 = normalizedPoints[i + 1];
        const p3 = normalizedPoints[i + 2] || p2;

        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;

        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }

    return path;
};

const StatCard = ({ number, label, suffix = "", delay = 0 }) => {
    return (
        <motion.div
            className="flex flex-col items-center p-6 bg-white/[0.03] border border-white/10 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
        >
            <span className="text-3xl md:text-5xl font-outfit font-bold text-white mb-2 tracking-tight">
                {number}<span className="text-violet-400">{suffix}</span>
            </span>
            <span className="text-sm text-white/50 font-outfit uppercase tracking-widest text-center">{label}</span>
        </motion.div>
    );
};

const nodes = [
    { id: 1, label: "Statista", content: "Global E-commerce Report 2025", x: "5%", y: "30%", color: "#3B82F6" },
    { id: 2, label: "eMarketer", content: "Retail Industry Forecast", x: "95%", y: "45%", color: "#F59E0B" },
    { id: 3, label: "McKinsey", content: "Digital Commerce Analysis", x: "90%", y: "75%", color: "#10B981" },
    { id: 4, label: "Forrester", content: "Marketplace Trends 2025", x: "5%", y: "80%", color: "#A855F7" },
];

const MarketplaceNode = ({ node }) => (
    <motion.div
        className="absolute z-30 cursor-pointer group"
        style={{ left: node.x, top: node.y }}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
            delay: 0.5 + node.id * 0.2, // For initial appearance
            y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.id * 1.5 // Use different delay for float loop
            }
        }}
    >
        <div className="relative w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: node.color }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3" style={{ backgroundColor: node.color }}></span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
            <div className="bg-obsidian/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-center relative">
                <div className="text-xs font-bold font-orbitron text-white mb-1">{node.label}</div>
                <div className="text-[10px] text-white/70 font-outfit uppercase tracking-wide leading-tight">
                    {node.content}
                </div>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-obsidian/90 border-r border-b border-white/10 rotate-45 transform"></div>
            </div>
        </div>
    </motion.div>
);

const Relevance = () => {
    const [selectedPoint, setSelectedPoint] = useState(null);

    // Graph scales relative to 100x100 viewbox for simplicity in specific drawing areas
    // but here we use a flexible SVG approach.
    const minVal = 4.5;
    const maxVal = 8.5;

    // We'll assume a coordinate space of 1000 x 400 for precision
    const width = 1000;
    const height = 400;

    const smoothPath = generateSmoothPath(salesData, width, height, maxVal, minVal);

    // Fill path needs to close the loop
    const fillPath = `${smoothPath} L ${width},${height} L 0,${height} Z`;

    const normalizeY = (val) => height - ((val - minVal) / (maxVal - minVal)) * height;
    const normalizeX = (index) => (index / (salesData.length - 1)) * width;

    return (
        <motion.div
            className="w-full pt-10 pb-20 flex flex-col items-center justify-center relative z-10 px-6 relevance-container"
            initial={{ opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
            whileInView={{ opacity: 1, backgroundColor: "var(--relevance-bg, rgba(0,0,0,0.4))" }}
            transition={{ duration: 1 }}
            viewport={{ margin: "-20%" }}
        >

            <motion.div
                className="text-center max-w-4xl mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-violet-300 font-outfit text-xs font-semibold tracking-wide uppercase">Market Intelligence</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-outfit font-bold mb-6 text-white tracking-tight">
                    Global Market Trajectory
                </h2>
                <p className="text-lg text-white/60 font-outfit max-w-2xl mx-auto leading-relaxed">
                    E-commerce volume is accelerating beyond human processing capacity. Algorithmic intervention is no longer optional—it is essential.
                </p>
            </motion.div>

            {/* Nodes Layer */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Enable pointer events for nodes specifically using pointer-events-auto in component */}
                <div className="relative w-full h-full pointer-events-auto">
                    {nodes.map(node => (
                        <MarketplaceNode key={node.id} node={node} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 w-full max-w-6xl rounded-2xl overflow-hidden border border-white/10 mb-12">
                <div className="bg-obsidian">
                    <StatCard number="33" suffix="%" label="Digital Adoption Rate" delay={0} />
                </div>
                <div className="bg-obsidian">
                    <StatCard number="6.86" suffix="T" label="2025 Market Volume" delay={0.1} />
                </div>
                <div className="bg-obsidian">
                    <StatCard number="7.96" suffix="T" label="2027 Projected Volume" delay={0.2} />
                </div>
            </div>

            {/* Professional Graph Container */}
            <div className="w-full max-w-6xl relative bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl border border-white/5 p-8 md:p-12">
                <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-outfit font-semibold text-white mb-1">Growth Forecast</h3>
                        <p className="text-sm text-white/40 font-outfit">Trillions USD (2021-2027)</p>
                    </div>
                </div>

                <div className="relative h-[400px] w-full" onClick={() => setSelectedPoint(null)}>
                    {/* Grid Background */}
                    <div className="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none">
                        {[8.5, 7.5, 6.5, 5.5, 4.5].map((val, i) => (
                            <div key={i} className="w-full border-t border-white/5 relative h-0">
                                <span className="absolute -top-3 -left-8 text-xs text-white/30 font-outfit">{val}T</span>
                            </div>
                        ))}
                    </div>

                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="lineColor" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#A78BFA" />
                            </linearGradient>
                            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Fill Area */}
                        <motion.path
                            d={fillPath}
                            fill="url(#curveGradient)"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.3 }}
                            transition={{ duration: 1.5 }}
                        />

                        {/* The Smooth Line */}
                        <motion.path
                            d={smoothPath}
                            fill="none"
                            stroke="url(#lineColor)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            filter="url(#lineGlow)"
                        />

                        {/* Data Points */}
                        {salesData.map((d, i) => {
                            const x = normalizeX(i);
                            const y = normalizeY(d.value);
                            const isSelected = selectedPoint?.year === d.year;

                            return (
                                <g key={i}>
                                    {/* Interaction Target */}
                                    <circle
                                        cx={x} cy={y} r="20"
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPoint(isSelected ? null : d);
                                        }}
                                    />

                                    {/* Visual Point */}
                                    <motion.circle
                                        cx={x} cy={y}
                                        r={isSelected ? 6 : 4}
                                        fill="#000"
                                        stroke={isSelected ? "#fff" : "#A78BFA"}
                                        strokeWidth={2}
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.5 + i * 0.1 }}
                                        animate={{
                                            r: isSelected ? 6 : 4,
                                            stroke: isSelected ? "#fff" : "#A78BFA"
                                        }}
                                        className="pointer-events-none"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="absolute top-full left-0 w-full flex justify-between pt-4">
                        {salesData.map((d, i) => (
                            <span key={i} className="text-xs text-white/40 font-outfit translate-x-[-50%] w-8 text-center" style={{ left: `${(i / (salesData.length - 1)) * 100}%`, position: 'absolute' }}>
                                {d.year}
                            </span>
                        ))}
                    </div>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {selectedPoint && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bg-white text-black p-4 rounded-lg shadow-xl pointer-events-none z-20"
                                style={{
                                    left: `min(max(${normalizeX(salesData.findIndex(d => d.year === selectedPoint.year)) / width * 100}%, 150px), calc(100% - 150px))`,
                                    top: `max(${normalizeY(selectedPoint.value) - 130}px, 0px)`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="text-xs font-bold text-gray-500 mb-1">{selectedPoint.year}</div>
                                <div className="text-3xl font-bold font-outfit tracking-tight text-violet-600 mb-1">
                                    ${selectedPoint.value}T
                                </div>
                                <div className="text-xs text-gray-400 font-medium">
                                    {selectedPoint.label || "Historical Data"}
                                </div>
                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-16 text-white/20 text-xs text-center font-outfit">
                Source: Statista & eMarketer Analysis (2025)
            </div>
        </motion.div>
    );
};

export default Relevance;
