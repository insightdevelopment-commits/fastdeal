import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
    {
        name: "Arlan M.",
        text: "FastDeal can be a great tool for shopping online. I am in the waitlist, so we will see!",
        role: "Waitlist Member"
    },
    {
        name: "Elena V.",
        text: "Finally, a solution to marketplace chaos. A 1.2s global scan is a total game-changer.",
        role: "Beta Tester"
    },
    {
        name: "Sarah J.",
        text: "I love the focus on algorithmic precision. Finding quality products at global prices is exactly what I need.",
        role: "E-commerce Analyst"
    },
    {
        name: "Michael K.",
        text: "The borderless shopping era is here. I'm excited to see how Ilyas and Adil bridge the intelligence gap.",
        role: "Tech Investor"
    }
];

const ReviewCard = ({ review }) => (
    <motion.div
        className="w-[300px] md:w-[400px] md:h-[200px] flex-shrink-0 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.05] transition-transform duration-300"
        whileHover={{ zIndex: 10 }}
        style={{ willChange: 'transform' }}
    >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_#4B0082] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electricPurple to-neonCyan p-[1px]">
                        <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center text-white font-bold text-sm">
                            {review.name.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold font-outfit text-base md:text-lg leading-tight">{review.name}</h4>
                        <span className="text-white/40 text-xs uppercase tracking-wider">{review.role}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 md:w-4 md:h-4 text-goldStar fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
            </div>

            <p className="text-mutedViolet font-outfit text-sm md:text-base leading-relaxed">
                "{review.text}"
            </p>
        </div>
    </motion.div>
);

const Reviews = () => {
    return (
        <div className="w-full pt-16 md:pt-24 pb-8 relative z-50 overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 px-6"
            >
                <div className="inline-block px-3 py-1 mb-6 rounded-full border border-electricPurple/30 bg-electricPurple/10 backdrop-blur-sm">
                    <span className="text-electricPurple text-xs font-bold uppercase tracking-widest">Community Verification</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-6">
                    USER <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonCyan">VALIDATION</span>
                </h2>
                <div className="w-full h-px max-w-[100px] mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Marquee Container */}
            <div className="relative w-full max-w-[1920px] mx-auto">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-obsidian to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-obsidian to-transparent z-20 pointer-events-none" />

                {/* Marquee Track */}
                <div
                    className="flex overflow-hidden group" // group for pause on hover
                >
                    <motion.div
                        className="flex gap-6 md:gap-8 px-6 md:px-8"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 45,
                            ease: "linear",
                            repeat: Infinity
                        }}
                        style={{ willChange: 'transform' }}
                    >
                        {/* Triplicate items to ensure smooth infinite loop for wider screens */}
                        {[...reviews, ...reviews, ...reviews].map((review, index) => (
                            <ReviewCard key={index} review={review} />
                        ))}
                    </motion.div>
                </div>
            </div>
            {/* Pause instruction for user (subtle) */}

        </div>
    );
};

export default Reviews;
