import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Header = ({ activeSection, onNavigate }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user, login, openLoginModal } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lang, setLang] = useState('EN');
    const [theme, setTheme] = useState('dark');

    const handleLoginSuccess = async (tokenResponse) => {
        console.log('Login Success:', tokenResponse);

        // Fetch user info from Google (optional, but good for "Name")
        // For now, we just utilize the context login
        try {
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }).then(res => res.json());

            login({
                token: tokenResponse.access_token,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                plan: 'Pro' // Mock plan for demo
            });
        } catch (error) {
            console.error("Failed to fetch user info", error);
            // Fallback login
            login({ token: tokenResponse.access_token });
        }

        navigate('/search');
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: (error) => {
            console.error('Login Failed:', error);
            alert(`Login Failed: ${error?.error_description || error?.details || 'Unknown error'}. Check console for details.`);
        },
    });

    const navLinks = [
        { name: 'Start', href: '#start' },
        { name: 'Problem', href: '#problem' },
        { name: 'Relevance', href: '#relevance' },
        { name: 'Solution', href: '#solution' },
    ];

    const handleLangChange = () => {
        const langs = ['EN', 'RU', 'KZ'];
        const nextIndex = (langs.indexOf(lang) + 1) % langs.length;
        setLang(langs[nextIndex]);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        // Implement actual theme switching logic here (e.g., robust class toggling on html/body)
        document.documentElement.classList.toggle('light-mode');
    };

    // Helper to determine if link is active
    const isActive = (name) => {
        // Normalize for comparison (e.g. 'Start' vs 'start')
        return activeSection?.toLowerCase() === name.toLowerCase();
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-2 grid grid-cols-2 md:grid-cols-3 items-center"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'circOut' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer justify-self-start">
                <span className="text-2xl font-orbitron font-bold text-white tracking-widest text-glow hover:text-neonMagenta transition-colors duration-300">
                    FASTDEAL
                </span>
                <img src="/mainlogo/fastdeallogo.png" alt="FastDeal Logo" className="h-16 w-auto ml-2 object-contain" />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-12 justify-self-center">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                            if (onNavigate) {
                                e.preventDefault();
                                onNavigate(link.href.substring(1));
                            }
                        }}
                        className={`font-outfit text-sm uppercase tracking-wide transition-all hover:glow-text ${isActive(link.name)
                            ? 'text-neonMagenta font-bold drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]'
                            : 'text-white/80 hover:text-electricPurple'
                            }`}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>

            {/* Settings / Controls */}
            <div className="hidden md:flex items-center gap-4 justify-self-end">
                {!isAuthenticated ? (
                    <>
                        {/* Sign In - Ghost Button */}
                        <button
                            onClick={() => openLoginModal()}
                            className="px-4 py-2 rounded-full border border-deepViolet bg-transparent text-white text-sm font-outfit uppercase tracking-widest transition-all hover:bg-deepViolet/10 hover:shadow-[0_0_15px_rgba(75,0,130,0.5)] shadow-[0_0_5px_rgba(75,0,130,0.2)]"
                            style={{ textShadow: "0 0 5px rgba(138, 43, 226, 0.5)" }}
                        >
                            Sign In
                        </button>

                        {/* Get Started - Gradient Button */}
                        <button
                            onClick={() => openLoginModal()}
                            className="px-5 py-2 rounded-full bg-gradient-to-r from-electricPurple to-neonMagenta text-white text-sm font-bold font-outfit uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                        >
                            Get Started
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/search')}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold font-outfit uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)] flex items-center gap-2"
                    >
                        <span>Open Terminal</span>
                        {user?.picture && <img src={user.picture} alt="User" className="w-6 h-6 rounded-full border border-white/50" />}
                    </button>
                )}

                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

                <button
                    onClick={handleLangChange}
                    className="flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white transition-colors px-2 py-1 rounded-full uppercase"
                >
                    <Globe size={14} />
                    {lang}
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-white/70 hover:text-neonMagenta hover:bg-white/5 transition-all"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-white justify-self-end"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu Overlay - Simple implementation */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-white text-lg font-outfit"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </motion.header>
    );
};

export default Header;
