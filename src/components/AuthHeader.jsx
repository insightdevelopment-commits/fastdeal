import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'CATEGORIES', href: '#categories' },
        { name: 'PRICE TRACKING', href: '#tracking' },
        { name: 'INSTRUCTION', href: '#instruction' },
        { name: 'LOCATION', href: '#location' },
    ];

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-2 grid grid-cols-2 md:grid-cols-3 items-center"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'circOut' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer justify-self-start ml-[80px] md:ml-[100px] transition-all duration-300">
                <span className="text-2xl font-orbitron font-bold text-white tracking-widest text-glow hover:text-neonMagenta transition-colors duration-300">
                    FASTDEAL
                </span>
                <img src="/mainlogo/fastdeallogo.png" alt="FastDeal Logo" className="h-16 w-auto ml-2 object-contain" />
            </div>

            {/* Desktop Nav - Centered */}
            <nav className="hidden md:flex items-center gap-8 justify-self-center">
                {navLinks.map((link) => (
                    link.path ? (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="font-outfit text-sm uppercase tracking-wide transition-all hover:glow-text text-white/80 hover:text-electricPurple relative group"
                        >
                            {link.name}
                        </Link>
                    ) : (
                        <a
                            key={link.name}
                            href={link.href}
                            className="font-outfit text-sm uppercase tracking-wide transition-all hover:glow-text text-white/80 hover:text-electricPurple relative group"
                        >
                            {link.name}
                            {(link.name === 'CATEGORIES' || link.name === 'LOCATION') && (
                                <ChevronDown className="inline-block ml-1 w-4 h-4 text-neonCyan" />
                            )}
                        </a>
                    )
                ))}
            </nav>

            {/* User Avatar - Right Side */}
            <div className="hidden md:flex items-center gap-4 justify-self-end relative">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-white">{user?.name || 'User'}</span>
                    <span className="text-xs text-neonCyan">{user?.plan || 'Free'} Plan</span>
                </div>

                <motion.div
                    className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-purple-600 to-violet-800 avatar-glow cursor-pointer gpu-accelerate flex items-center justify-center text-white font-bold text-lg overflow-hidden border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    {user?.picture ? (
                        <img src={user.picture} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span>{user?.name?.charAt(0) || 'U'}</span>
                    )}
                </motion.div>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-obsidian border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-4 border-b border-white/10">
                            <p className="text-white text-sm font-bold">Account</p>
                            <p className="text-white/50 text-xs truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 text-sm transition-colors flex items-center gap-2"
                        >
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4 justify-self-end">
                {/* Mobile Avatar */}
                <motion.div
                    className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-purple-600 to-violet-800 avatar-glow cursor-pointer gpu-accelerate flex items-center justify-center text-white font-bold text-sm overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                >
                    {user?.picture ? (
                        <img src={user.picture} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span>{user?.name?.charAt(0) || 'U'}</span>
                    )}
                </motion.div>

                {/* Hamburger Menu */}
                <button
                    className="text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden">
                    {navLinks.map((link) => (
                        link.path ? (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-white text-lg font-outfit flex items-center gap-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-white text-lg font-outfit flex items-center gap-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                                {(link.name === 'CATEGORIES' || link.name === 'LOCATION') && (
                                    <ChevronDown className="w-4 h-4 text-neonCyan" />
                                )}
                            </a>
                        )
                    ))}
                </div>
            )}
        </motion.header>
    );
};

export default AuthHeader;
