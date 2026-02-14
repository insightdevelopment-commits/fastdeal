import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, Camera, Footprints, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Background from './Background';
import Footer from './Footer';

const BestDealsPage = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState('Technology');

    const categories = [
        "All", "Technology", "Gadgets", "Food", "Entertainment",
        "Clothes", "Transport", "Spare Parts", "Sport"
    ];

    const deals = [
        {
            id: 1,
            title: "iPhone 17 Pro - Papaya Orange",
            price: "$999",
            originalPrice: "$1499",
            gap: "-32%", // 32% PRICE GAP
            market: "Global",
            trustScore: 98,
            image: "/iphones/iphone1.png", // Assuming this exists or placeholder
            type: "image"
        },
        {
            id: 2,
            title: "Sony G Master 24-70mm Lens",
            price: "$1599",
            originalPrice: "$2100",
            gap: "-25%",
            market: "Japan (JP)",
            trustScore: 95,
            icon: <Camera className="w-12 h-12 text-white/50" />,
            type: "icon"
        },
        {
            id: 3,
            title: "Balenciaga Track Sneakers",
            price: "$650",
            originalPrice: "$1050",
            gap: "-40%",
            market: "Europe (EU)",
            trustScore: 92,
            icon: <Footprints className="w-12 h-12 text-white/50" />,
            type: "icon"
        },
        // Fillers
        {
            id: 4,
            title: "Samsung Odyssey OLED G9",
            price: "$1100",
            originalPrice: "$1800",
            gap: "-38%",
            market: "Korea (KR)",
            trustScore: 96,
            icon: <Zap className="w-12 h-12 text-white/50" />,
            type: "icon"
        },
        {
            id: 5,
            title: "Herman Miller Aeron",
            price: "$850",
            originalPrice: "$1400",
            gap: "-39%",
            market: "USA (US)",
            trustScore: 94,
            icon: <ShieldCheck className="w-12 h-12 text-white/50" />,
            type: "icon"
        },
        {
            id: 6,
            title: "MacBook Pro M3 Max",
            price: "$2800",
            originalPrice: "$3500",
            gap: "-20%",
            market: "Global",
            trustScore: 99,
            icon: <Tag className="w-12 h-12 text-white/50" />,
            type: "icon"
        }
    ];

    return (
        <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll scroll-smooth scrollbar-hide bg-[#050505] text-white font-outfit relative selection:bg-electricPurple/30">
            {/* Background Animation */}
            <Background scrollContainer={scrollContainerRef} />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="relative z-10 pl-[80px] w-full min-h-screen flex flex-col items-center">

                {/* Header Section */}
                <div className="w-full max-w-7xl px-8 pt-12 pb-8 flex flex-col items-center relative z-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-12 tracking-tight uppercase"
                    >
                        Best Deals in <span className="text-electricPurple">Global Market</span>
                    </motion.h1>

                    {/* Category Pills */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16 relative">
                        {categories.map((cat, i) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-md border transition-all duration-300
                                    ${activeCategory === cat
                                        ? 'bg-neonCyan/10 border-neonCyan text-neonCyan shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                {cat}
                            </motion.button>
                        ))}

                        {/* Data Stream Lines (Decorative) */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-neonCyan to-transparent opacity-50" />
                        <div className="absolute -bottom-12 left-1/4 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                        <div className="absolute -bottom-12 right-1/4 translate-x-1/2 w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                    </div>
                </div>

                {/* Deals Grid */}
                <div className="w-full max-w-7xl px-8 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
                    {deals.map((deal, i) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            whileHover={{ y: -10 }}
                            className="group relative h-[420px] rounded-3xl backdrop-blur-3xl bg-black/40 border border-white/10 overflow-hidden flex flex-col"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-electricPurple/20 via-transparent to-neonCyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Badge */}
                            <div className="absolute top-4 right-4 z-30">
                                <div className="bg-red-600/90 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.6)] backdrop-blur-md border border-red-400/30">
                                    {deal.gap} Price Gap
                                </div>
                            </div>

                            {/* Market Badge */}
                            <div className="absolute top-4 left-4 z-30">
                                <div className="bg-black/60 text-white/70 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neonCyan animate-pulse" />
                                    {deal.market}
                                </div>
                            </div>

                            {/* Image Area */}
                            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative z-10 w-full h-full flex items-center justify-center"
                                >
                                    {deal.type === 'image' ? (
                                        <img src={deal.image} alt={deal.title} className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all">
                                            {deal.icon}
                                        </div>
                                    )}
                                </motion.div>

                                {/* Background Highlight */}
                                <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Content Area */}
                            <div className="p-6 relative z-20 bg-black/40 backdrop-blur-xl border-t border-white/5">
                                <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-neonCyan transition-colors">{deal.title}</h3>

                                <div className="flex items-end justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white/40 line-through">{deal.originalPrice}</span>
                                        <span className="text-3xl font-bold text-white tracking-tight">{deal.price}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>{deal.trustScore}/100</span>
                                        </div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Trust Score</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    View Best Match
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="w-full relative z-10 bg-transparent">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default BestDealsPage;
