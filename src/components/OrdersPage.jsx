import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Package, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Background from './Background';
import Footer from './Footer';

const OrdersPage = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'purchased'

    // Mock data for now - in real app would fetch from API
    const favorites = [];
    const purchased = [];

    const isEmpty = activeTab === 'favorites' ? favorites.length === 0 : purchased.length === 0;

    return (
        <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll scroll-smooth scrollbar-hide bg-[#050505] text-white font-outfit relative selection:bg-electricPurple/30">
            {/* Background Animation */}
            <Background scrollContainer={scrollContainerRef} />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="relative z-10 pl-[80px] w-full min-h-screen flex flex-col">
                {/* Top Bar */}
                <div className="w-full h-20 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md bg-black/20">
                    <div className="flex items-center gap-4">
                        {/* Back Button for mobile */}
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
                        >
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            FastDeal <span className="text-white/50 font-light">My Orders</span>
                        </h1>
                    </div>
                </div>

                {/* Tabbed Workspace */}
                <div className="flex-1 flex flex-col items-center pt-12 px-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-12 mb-16 relative">
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`text-2xl md:text-3xl font-bold tracking-wider relative pb-4 transition-colors duration-300 ${activeTab === 'favorites' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                            FAVORITES
                            {activeTab === 'favorites' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 w-full h-1 bg-neonCyan shadow-[0_0_15px_rgba(0,255,255,0.8)] rounded-full"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('purchased')}
                            className={`text-2xl md:text-3xl font-bold tracking-wider relative pb-4 transition-colors duration-300 ${activeTab === 'purchased' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                            PURCHASED
                            {activeTab === 'purchased' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 w-full h-1 bg-electricPurple shadow-[0_0_15px_rgba(191,64,191,0.8)] rounded-full"
                                />
                            )}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="w-full max-w-2xl flex flex-col gap-6 relative">
                        <AnimatePresence mode="wait">
                            {isEmpty ? (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-6 items-center"
                                >
                                    {/* Empty State Ghost Blocks */}
                                    {[1, 2, 3].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-full h-24 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden"
                                            animate={{
                                                opacity: [0.3, 0.5, 0.3],
                                                boxShadow: [
                                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                                ]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    ))}

                                    {/* Center Icon & Text Overlay - Moved UP as requested */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none -translate-y-12">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className={`p-6 rounded-full mb-6 backdrop-blur-xl bg-black/40 border ${activeTab === 'favorites' ? 'border-neonCyan/30 text-neonCyan shadow-[0_0_30px_rgba(0,255,255,0.2)]' : 'border-electricPurple/30 text-electricPurple shadow-[0_0_30px_rgba(191,64,191,0.2)]'}`}
                                        >
                                            {activeTab === 'favorites' ? (
                                                <Heart className="w-12 h-12" />
                                            ) : (
                                                <Package className="w-12 h-12" />
                                            )}
                                        </motion.div>
                                        <motion.p
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-white/60 text-center font-medium max-w-md px-4"
                                        >
                                            No items found. Your <span className="text-white font-bold">Intelligence Scan</span> results will appear here once saved or purchased.
                                        </motion.p>
                                    </div>

                                    {/* Add New Block */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/search')}
                                        className="w-full h-24 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center gap-4 group transition-all duration-300 backdrop-blur-sm mt-8 z-30 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                            <Plus className="w-6 h-6 text-white/70 group-hover:text-white" />
                                        </div>
                                        <span className="text-white/40 font-bold uppercase tracking-widest text-sm group-hover:text-white/70 transition-colors">
                                            Find New Deals
                                        </span>
                                    </motion.button>
                                </motion.div>
                            ) : (
                                // This would be the actual list when data exists
                                <div className="text-white">List goes here</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 bg-transparent mt-20">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
