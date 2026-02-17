import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import Background from './Background';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import AuthHeader from './AuthHeader';
import Footer from './Footer';
import SearchLoader from './SearchLoader';
import SearchResults from './SearchResults';
import { searchProducts } from '../services/searchService';

const MainPage = () => {
    const scrollContainerRef = useRef(null);
    const resultsRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    // Right Sidebar State
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    // Search state
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [scanTime, setScanTime] = useState(0);
    const scanTimerRef = useRef(null);

    const placeholders = [
        "iPhone 17 Pro",
        "white t-shirt for $7",
        "nike shoes"
    ];

    // Rotate placeholder every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Scan time counter during loading
    useEffect(() => {
        if (isLoading) {
            setScanTime(0);
            scanTimerRef.current = setInterval(() => {
                setScanTime(prev => prev + 0.1);
            }, 100);
        } else {
            if (scanTimerRef.current) {
                clearInterval(scanTimerRef.current);
            }
        }
        return () => {
            if (scanTimerRef.current) {
                clearInterval(scanTimerRef.current);
            }
        };
    }, [isLoading]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setSearchError(null);
        setHasSearched(true);

        // Track start time for minimum animation duration
        const startTime = Date.now();
        const MIN_ANIMATION_DURATION = 3000; // 3 seconds

        try {
            const result = await searchProducts(searchQuery.trim());

            // Calculate remaining time to reach minimum duration
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedTime);

            // Wait for remaining time if search completed too quickly
            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            if (result.success) {
                setSearchResults(result);
                setIsLoading(false);
                // Scroll to results after a short delay
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                setSearchError(result.error);
                setSearchResults(null);
                setIsLoading(false);
            }
        } catch (error) {
            // Ensure minimum animation duration even on error
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedTime);

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            setSearchError(error.message || 'An unexpected error occurred');
            setSearchResults(null);
            setIsLoading(false);
        }
    };

    const scrollToResults = () => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-obsidian">
            {/* Elements independent of scroll container */}
            <Background scrollContainer={scrollContainerRef} speed={1.0} />
            <Sidebar />
            <RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />
            <AuthHeader onAvatarClick={() => setIsRightSidebarOpen(true)} />

            {/* Scrolling Container */}
            <div
                ref={scrollContainerRef}
                className="h-full w-full overflow-y-scroll scroll-smooth scrollbar-hide text-white font-outfit relative z-0"
            >
                {/* User Provided Background Image - Fixed & Scaled to hide watermark */}
                {/* Note: Kept inside or moved out? Fixed position relative to viewport works better outside if no transforms on parent. */}
                <motion.div
                    className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
                    style={{ zIndex: 0 }}
                >
                    <motion.img
                        src="/background/mainpage_background.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 mix-blend-screen"
                        initial={{ scale: 1.1 }}
                        animate={{
                            scale: [1.1, 1.15, 1.1],
                            rotate: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>

                {/* Main Hero Section - Reduced height for better flow */}
                <motion.section
                    className="min-h-[85vh] w-full relative bg-transparent text-white flex flex-col items-center justify-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >

                    {/* Headline */}
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-12 text-center text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] relative z-10"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        What do you want to purchase?
                    </motion.h1>

                    {/* Search Bar Container - Redesigned */}
                    <motion.div
                        className="w-full max-w-4xl relative gpu-accelerate z-50"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <div className="search-capsule w-full flex items-center pr-2 pl-2">
                            {/* Search Input */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                placeholder={placeholders[placeholderIndex]}
                                className={`w-full pl-6 py-6 bg-transparent text-white text-lg md:text-xl outline-none transition-all duration-300 placeholder-white/40 ${searchQuery.length > 0 ? 'font-mono-active' : 'font-outfit'
                                    }`}
                            />

                            {/* Integrated Circular Action Button */}
                            <motion.button
                                onClick={handleSearch}
                                className="w-[54px] h-[54px] rounded-full search-btn-bloom cursor-pointer flex items-center justify-center shrink-0 m-1.5 border border-white/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Search className="w-6 h-6 text-black" strokeWidth={3} />
                            </motion.button>
                        </div>

                        {/* Search Hint */}
                        <motion.p
                            className="text-white/60 text-xs md:text-sm mt-6 text-center font-outfit tracking-wide uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            Press Enter or click the pulse to start your <span className="text-neonCyan">1.2s intelligent scan</span>
                        </motion.p>
                    </motion.div>

                    {/* Quick Stats Blocks - Moved under search bar */}
                    <motion.div
                        className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        {/* Stat 1 */}
                        <div className="flex flex-col items-center group">
                            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">1.2s</span>
                            <span className="text-white/50 text-xs uppercase tracking-widest mt-1">Average Search Time</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-white/20"></div>

                        {/* Stat 2 */}
                        <div className="flex flex-col items-center group">
                            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">50+</span>
                            <span className="text-white/50 text-xs uppercase tracking-widest mt-1">Marketplaces Scanned</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-white/20"></div>

                        {/* Stat 3 */}
                        <div className="flex flex-col items-center group">
                            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">99.9%</span>
                            <span className="text-white/50 text-xs uppercase tracking-widest mt-1">Price Accuracy</span>
                        </div>
                    </motion.div>

                    {/* Arrow Icon - Shows down when results available */}
                    {hasSearched && !isLoading && (
                        <motion.div
                            className="absolute bottom-8 right-8 text-electricPurple animate-bounce cursor-pointer hover:text-neonMagenta transition-colors"
                            onClick={scrollToResults}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <ArrowDown className="w-6 h-6" />
                        </motion.div>
                    )}
                    {!hasSearched && (
                        <div className="absolute bottom-8 right-8 text-white/30 animate-bounce cursor-pointer hover:text-white/80 transition-colors">
                            <ArrowUp className="w-6 h-6" />
                        </div>
                    )}
                </motion.section>

                {/* Search Results Section - Positioned higher */}
                <section ref={resultsRef} className="relative z-10 min-h-[60vh] -mt-8 py-0 bg-gradient-to-b from-transparent to-black/20">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <SearchLoader key="loader" scanTime={scanTime} />
                        )}

                        {!isLoading && hasSearched && (
                            <SearchResults
                                key="results"
                                results={searchResults?.results}
                                scanTime={searchResults?.scanTime}
                                marketplacesCovered={searchResults?.marketplacesCovered}
                                totalFound={searchResults?.totalFound}
                                trustedCount={searchResults?.trustedCount}
                                error={searchError}
                            />
                        )}
                    </AnimatePresence>
                </section>

                {/* Footer */}
                <section className="relative z-10 bg-transparent">
                    <Footer />
                </section>
            </div>
        </div>
    );
};

export default MainPage;
