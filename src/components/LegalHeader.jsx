import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalHeader = () => {
    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-4 flex justify-between items-center"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'circOut' }}
        >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer transition-all duration-300">
                <span className="text-2xl font-orbitron font-bold text-white tracking-widest text-glow hover:text-neonMagenta transition-colors duration-300">
                    FASTDEAL
                </span>
                <img src="/mainlogo/fastdeallogo.png" alt="FastDeal Logo" className="h-20 w-auto ml-2 object-contain" />
            </Link>

            {/* Back to Home / Actions */}
            <div className="flex items-center gap-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-outfit text-sm uppercase tracking-wide group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </Link>
            </div>
        </motion.header>
    );
};

export default LegalHeader;
