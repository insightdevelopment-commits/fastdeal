import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import FAQ from './FAQ';

const FAQModal = () => {
    const { isFAQModalOpen, closeFAQModal } = useModal();

    if (!isFAQModalOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeFAQModal}
            >
                <motion.div
                    className="relative w-full max-w-5xl max-h-[90vh] bg-obsidian border border-white/10 rounded-2xl shadow-2xl overflow-y-auto scrollbar-hide"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeFAQModal}
                        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Content */}
                    <div className="pt-8">
                        <FAQ />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FAQModal;
