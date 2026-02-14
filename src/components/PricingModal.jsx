import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const PricingModal = () => {
    const { isPricingModalOpen, closePricingModal } = useModal();
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
        <AnimatePresence>
            {isPricingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePricingModal}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-obsidian border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closePricingModal}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">
                                Choose Your <span className="text-electricPurple">Power</span>
                            </h2>
                            <p className="text-white/60 text-lg font-outfit max-w-2xl mx-auto">
                                Unlock advanced AI capabilities and maximize your finding potential with our premium tiers.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
                            {plans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    className={`
                                        relative p-8 rounded-3xl backdrop-blur-3xl bg-black/40 border transition-all duration-500 flex flex-col
                                        ${plan.popular ? 'md:-mt-4 md:mb-4 z-20 border-neonCyan' : 'z-10 border-white/10'}
                                        ${hoveredPlan === plan.id ? plan.glowColor : (plan.popular ? 'shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'shadow-none')}
                                    `}
                                    style={{
                                        scale: hoveredPlan && hoveredPlan !== plan.id ? 0.95 : (hoveredPlan === plan.id ? 1.02 : 1),
                                        opacity: hoveredPlan && hoveredPlan !== plan.id ? 0.5 : 1,
                                    }}
                                    onMouseEnter={() => setHoveredPlan(plan.id)}
                                    onMouseLeave={() => setHoveredPlan(null)}
                                >
                                    {/* Most Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neonCyan text-black text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.6)] z-30">
                                            Most Popular
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold mb-2 tracking-widest uppercase text-white font-orbitron">{plan.name}</h3>
                                        <div className="flex items-end justify-center gap-1 mb-4">
                                            <span className={`text-5xl font-bold font-outfit ${plan.id === 'pro' ? 'text-neonCyan drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]' : (plan.id === 'ultra' ? 'text-electricPurple drop-shadow-[0_0_10px_rgba(191,64,191,0.5)]' : 'text-white')}`}>
                                                {plan.price}
                                            </span>
                                            <span className="text-white/40 text-lg mb-1 font-outfit">{plan.period}</span>
                                        </div>
                                        <p className="text-white/60 text-sm font-light font-outfit">{plan.description}</p>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                                    {/* Features */}
                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-white/80 font-outfit">
                                                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white/5 ${plan.id === 'pro' ? 'text-neonCyan' : (plan.id === 'ultra' ? 'text-electricPurple' : 'text-white/60')}`}>
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <motion.button
                                        className={`w-full py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 font-outfit ${plan.buttonColor} ${plan.buttonGlow}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get Started
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;
