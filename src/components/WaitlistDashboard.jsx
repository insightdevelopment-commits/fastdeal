import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Share2, Twitter, Linkedin } from 'lucide-react';

const WaitlistDashboard = ({ queuePosition, status, isDuplicate }) => {
    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gray-900/40 backdrop-blur-xl shadow-2xl"
        >
            {/* Glowing Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 p-8 flex flex-col items-center text-center">

                {/* Verified Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mb-6 relative"
                >
                    <div className="absolute inset-0 bg-violet-500 blur-xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-4 rounded-full shadow-lg shadow-violet-500/30">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                </motion.div>

                {/* Status Text */}
                <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
                    {isDuplicate ? 'Already Registered' : 'Signal Verified'}
                </h3>
                <p className="text-violet-200/70 font-outfit mb-8 max-w-sm">
                    {isDuplicate
                        ? "You've already secured your spot. Your position is locked."
                        : "Your spot is secured. We'll notify you when access opens."}
                </p>

                {/* Queue Number Card */}
                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 mb-8 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
                    <p className="text-sm font-outfit text-violet-300 uppercase tracking-widest mb-1">Current Position</p>
                    <div className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        #{queuePosition?.toLocaleString()}
                    </div>
                </div>

                {/* Referral Section */}
                <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <Share2 className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold font-outfit text-sm">Boost your signal</p>
                            <p className="text-white/50 text-xs">Invite 3 colleagues to skip 100 spots.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20Waitlist%20for%20FastDeal.%20The%20future%20of%20shopping%20is%20here.%20Join%20me!&url=${encodeURIComponent(window.location.origin)}`, '_blank')}
                            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <Twitter className="w-4 h-4 text-white/70 group-hover:text-sky-400 transition-colors" />
                            <span className="text-sm font-outfit text-white/70">Post</span>
                        </button>
                        <button
                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank')}
                            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-white/5 hover:border-[#0077b5]/30 transition-all group"
                        >
                            <Linkedin className="w-4 h-4 text-white/70 group-hover:text-[#0077b5] transition-colors" />
                            <span className="text-sm font-outfit text-white/70">Share</span>
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default WaitlistDashboard;
