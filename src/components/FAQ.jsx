import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
    {
        question: "What is FastDeal?",
        answer: "FastDeal is an AI-powered marketplace analysis platform designed to find the specific products you need by scanning global inventory in real-time. Our algorithms analyze price, quality, and shipping data to provide the single best match for your search query."
    },
    {
        question: "How does FastDeal guarantee product quality?",
        answer: "Our algorithm performs a multi-layer analysis of seller history, cross-references reviews across multiple platforms, and flags items with suspicious data patterns to ensure you only see top-tier goods."
    },
    {
        question: "Can I really find a white T-shirt for $5 with global shipping?",
        answer: "Yes. FastDeal scans low-barrier marketplaces and regional versions of global sites to find arbitrage opportunities and direct-from-factory pricing that standard search engines miss."
    },
    {
        question: "How much money can I save using this platform?",
        answer: "By identifying regional price variances and direct-from-factory listings, FastDeal helps users find deals that are, on average, 40% cheaper than standard local marketplace prices."
    },
    {
        question: "How does the platform handle untrusted vendors?",
        answer: "We maintain a dynamic \"Trust Ledger\" that automatically blacklists vendors with poor logistics records or high return rates, protecting you from marketplace fraud."
    },
    {
        question: "What makes FastDeal faster than manual searching?",
        answer: "While a human can check 2–3 sites in a minute, our distributed intelligence engine scans over 100 global marketplaces simultaneously, delivering the \"Perfect Match\" in about 1.2 seconds."
    },
    {
        question: "Is my data secure when I sign up for the waitlist?",
        answer: "Absolutely. We use industry-standard encryption, and your email is only used for release notifications and exclusive early-access updates from fastdealdevelopment@gmail.com."
    },
    {
        question: "Are there plans for a mobile app or extension?",
        answer: "Yes, a Chrome Extension is currently in development to allow for real-time price analysis while you browse your favorite shops."
    },
    {
        question: "How can I contact the development team?",
        answer: "You can reach the founders directly at fastdealdevelopment@gmail.com or via phone at +7 771 219 92 89 and +7 778 488 4961."
    }
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
    return (
        <motion.div
            className={`border-b border-white/5 last:border-0 overflow-hidden ${isOpen ? 'bg-white/[0.07]' : 'bg-transparent'} transition-colors duration-500`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <button
                className="w-full text-left py-6 px-6 flex justify-between items-center focus:outline-none group"
                onClick={onClick}
            >
                <div className="flex items-center gap-4">
                    <span className={`text-sm md:text-base font-mono transition-colors duration-300 ${isOpen ? 'text-neonCyan' : 'text-white/30 group-hover:text-electricPurple'}`}>
                        0{index + 1}
                    </span>
                    <span className={`font-outfit text-lg md:text-xl font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                        {question}
                    </span>
                </div>

                <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${isOpen ? 'border-neonCyan rotate-45' : 'border-white/10 rotate-0 group-hover:border-electricPurple'}`}>
                    <span className={`absolute w-3 h-[1px] transition-colors duration-300 ${isOpen ? 'bg-neonCyan' : 'bg-white/50 group-hover:bg-electricPurple'}`} />
                    <span className={`absolute h-3 w-[1px] transition-colors duration-300 ${isOpen ? 'bg-neonCyan' : 'bg-white/50 group-hover:bg-electricPurple'}`} />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="transform origin-top"
                    >
                        <div className="px-6 pb-8 pl-[3.5rem] pt-0">
                            <p className="text-base text-white/50 font-outfit leading-relaxed max-w-2xl">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <div className="inline-block px-3 py-1 mb-6 rounded-full border border-electricPurple/30 bg-electricPurple/10 backdrop-blur-sm">
                    <span className="text-electricPurple text-xs font-bold uppercase tracking-widest">Platform Intelligence</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-8 tracking-widest">
                    SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonCyan">FAQ</span>
                </h2>
                <div className="w-full h-px max-w-[100px] mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            <div
                className="w-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                {faqData.map((item, index) => (
                    <FAQItem
                        key={index}
                        index={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={activeIndex === index}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ;
