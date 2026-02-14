import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const Footer = () => {
    const { openFAQModal, openPricingModal } = useModal();

    const scrollToTop = () => {
        const startSection = document.getElementById('start');
        if (startSection) {
            startSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const linkHover = {
        color: "#40fff6",
        textShadow: "0 0 5px #FF00FF",
        transition: { duration: 0.3 }
    };

    const LinkItem = ({ text, sub, href = "#", to, onClick }) => (
        <motion.li whileHover={{ x: 5 }} className="mb-3">
            {to ? (
                <Link
                    to={to}
                    className="text-white/60 font-outfit text-sm md:text-base flex items-center gap-2 transition-colors duration-300 hover:text-[#40fff6] hover:shadow-[0_0_5px_#FF00FF]"
                >
                    {text}
                    {sub && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </Link>
            ) : (
                <motion.a
                    href={href}
                    onClick={(e) => {
                        if (onClick) {
                            e.preventDefault();
                            onClick();
                        }
                    }}
                    className="text-white/60 font-outfit text-sm md:text-base flex items-center gap-2 transition-colors duration-300 cursor-pointer"
                    whileHover={linkHover}
                >
                    {text}
                    {sub && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </motion.a>
            )}
        </motion.li>
    );

    const SocialIcon = ({ Icon }) => (
        <motion.a
            href="#"
            className="p-2 bg-white/5 rounded-full border border-white/10 text-white/60 hover:border-electricPurple hover:text-neonCyan transition-all duration-300"
            whileHover={{
                scale: 1.1,
                boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)",
                color: "#40fff6"
            }}
        >
            <Icon size={20} />
        </motion.a>
    );

    return (
        <div className="w-full flex flex-col justify-between pt-0 pb-10 px-6 md:px-20 relative z-10 h-full">
            {/* 4-Column Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 w-full max-w-7xl mx-auto">

                {/* Column 1: Platform */}
                <div>
                    <h4 className="text-white font-orbitron font-bold text-lg mb-6">PLATFORM</h4>
                    <ul className="list-none">
                        <LinkItem text="Home" to="/" />
                        <LinkItem text="Pricing" onClick={openPricingModal} />
                        <LinkItem text="Waitlist" sub={true} />
                        <LinkItem text="Chrome Extension" />
                    </ul>
                </div>

                {/* Column 2: Support */}
                <div>
                    <h4 className="text-white font-orbitron font-bold text-lg mb-6">SUPPORT</h4>
                    <ul className="list-none">
                        <LinkItem text="Contact Support" />
                        <LinkItem text="FAQ" onClick={openFAQModal} />
                        <LinkItem text="Help Center" />
                    </ul>
                </div>

                {/* Column 3: Legal */}
                <div>
                    <h4 className="text-white font-orbitron font-bold text-lg mb-6">LEGAL</h4>
                    <ul className="list-none">
                        <LinkItem text="Privacy Policy" to="/privacy" />
                        <LinkItem text="Refund Policy" to="/refund" />
                        <LinkItem text="Terms of Use" to="/terms" />
                    </ul>
                </div>

                {/* Column 4: Connect */}
                <div>
                    <h4 className="text-white font-orbitron font-bold text-lg mb-6">CONNECT</h4>
                    <div className="flex gap-4 mb-6">
                        <SocialIcon Icon={Instagram} />
                        <SocialIcon Icon={Youtube} />
                        <SocialIcon Icon={Twitter} />
                        <SocialIcon Icon={Linkedin} />
                    </div>
                    <div>
                        <p className="text-white/40 text-xs font-outfit uppercase tracking-widest mb-1">Inquiries</p>
                        <a href="mailto:fastdealdevelopment@gmail.com" className="text-electricPurple hover:text-neonMagenta transition-colors duration-300 text-sm font-mono">
                            fastdealdevelopment@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="w-full border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
                <div className="text-center md:text-left">
                    <p className="text-white/30 text-xs font-outfit uppercase tracking-wider">
                        FastDeal — Conceptualized and Developed by <span className="text-white/50">Karimkhan Ilyas</span> and <span className="text-white/50">Karimzhan Adil</span>
                    </p>
                </div>

                <div className="text-white/20 text-xs font-mono">
                    © 2026 FastDeal Inc.
                </div>
            </div>

            {/* Back to Top */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-10 right-10 p-3 bg-black/50 backdrop-blur-md border border-electricPurple/50 rounded-full text-electricPurple hover:bg-electricPurple hover:text-black transition-all duration-300 group z-50"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(138, 43, 226, 0.4)" }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowUp size={24} />
            </motion.button>
        </div>
    );
};

export default Footer;
