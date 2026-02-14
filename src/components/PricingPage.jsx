import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Background from './Background';
import Footer from './Footer';

const PricingPage = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const plans = [
        {
            id: 'free',
            name: 'FREE',
            price: '$0',
            period: '/ mo',
            description: 'Essential tools for casual shoppers',
            features: [
                'Basic Search Functionality',
                'Daily Deal Updates',
                'Community Support',
                '3 Searches per Day'
            ],
            borderColor: 'border-white/20',
            glowColor: 'shadow-none',
            buttonColor: 'bg-white/10 text-white hover:bg-white/20',
            buttonGlow: 'shadow-none',
            popular: false
        },
        {
            id: 'pro',
            name: 'PRO',
            price: '$15',
            period: '/ mo',
            description: 'Advanced features for power users',
            features: [
                'Smart Agent Searcher',
                'Real-time Price Tracking',
                'Unlimited Searches',
                'Priority Email Support',
                'Advanced Filters'
            ],
            borderColor: 'border-neonCyan',
            glowColor: 'shadow-[0_0_30px_rgba(0,255,255,0.3)]',
            buttonColor: 'bg-neonCyan text-black hover:bg-cyan-300',
            buttonGlow: 'shadow-[0_0_20px_rgba(0,255,255,0.5)]',
            popular: true
        },
        {
            id: 'ultra',
            name: 'ULTRA',
            price: '$45',
            period: '/ mo',
            description: 'Ultimate intelligence for professionals',
            features: [
                'AI Market Analysis',
                'Cross-Platform Arbitrage',
                'Instant Deal Alerts',
                '24/7 Dedicated Support',
                'API Access',
                'Early Access to Features'
            ],
            borderColor: 'border-electricPurple',
            glowColor: 'shadow-[0_0_40px_rgba(191,64,191,0.4)]',
            buttonColor: 'bg-electricPurple text-white hover:bg-purple-600',
            buttonGlow: 'shadow-[0_0_25px_rgba(191,64,191,0.6)]',
            popular: false
        }
    ];

    return (
        <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll scroll-smooth scrollbar-hide bg-[#050505] text-white font-outfit relative selection:bg-electricPurple/30">
            {/* Background Animation */}
            <Background scrollContainer={scrollContainerRef} />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="relative z-10 pl-[80px] w-full min-h-screen flex flex-col">
                {/* Header / Top Bar */}
                <div className="w-full h-20 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md bg-black/20">
                    <div className="flex items-center gap-4">
                        {/* Back Button for mobile/convenience */}
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
                        >
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            FastDeal <span className="text-electricPurple font-light">Pricing</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm text-white/40 uppercase tracking-widest hidden md:block">Choose your power</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-electricPurple to-neonCyan p-[1px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <span className="text-sm font-bold">R</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto items-stretch"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                className={`
                                    relative p-8 rounded-3xl backdrop-blur-3xl bg-black/40 border transition-all duration-500 flex flex-col
                                    ${plan.popular ? 'md:-mt-8 md:mb-8 z-20' : 'z-10'}
                                    ${plan.borderColor}
                                    ${hoveredPlan === plan.id ? plan.glowColor : (plan.popular ? 'shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'shadow-none')}
                                `}
                                style={{
                                    scale: hoveredPlan && hoveredPlan !== plan.id ? 0.95 : (hoveredPlan === plan.id ? 1.05 : 1),
                                    opacity: hoveredPlan && hoveredPlan !== plan.id ? 0.5 : 1,
                                    filter: hoveredPlan && hoveredPlan !== plan.id ? 'blur(2px)' : 'none',
                                }}
                                onMouseEnter={() => setHoveredPlan(plan.id)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                layout
                            >
                                {/* Most Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neonCyan text-black text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.6)] z-30">
                                        Most Popular
                                    </div>
                                )}

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2 tracking-widest uppercase">{plan.name}</h3>
                                    <div className="flex items-end justify-center gap-1 mb-4">
                                        <span className={`text-5xl font-bold ${plan.id === 'pro' ? 'text-neonCyan drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]' : (plan.id === 'ultra' ? 'text-electricPurple drop-shadow-[0_0_10px_rgba(191,64,191,0.5)]' : 'text-white')}`}>
                                            {plan.price}
                                        </span>
                                        <span className="text-white/40 text-lg mb-1">{plan.period}</span>
                                    </div>
                                    <p className="text-white/60 text-sm font-light">{plan.description}</p>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                                {/* Features */}
                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white/5 ${plan.id === 'pro' ? 'text-neonCyan' : (plan.id === 'ultra' ? 'text-electricPurple' : 'text-white/60')}`}>
                                                <Check className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <motion.button
                                    className={`w-full py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 ${plan.buttonColor} ${plan.buttonGlow}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="relative z-10 bg-transparent">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
