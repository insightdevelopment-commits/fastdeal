import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Moon, Sun, Globe, Send, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RightSidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark as per design
    const [language, setLanguage] = useState('en'); // 'en' or 'ru'

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <motion.div
            className="fixed top-0 right-0 h-full z-[100] flex flex-col bg-[#0D0B14] overflow-hidden shadow-2xl border-l border-white/5"
            initial={{ width: 0 }}
            animate={{
                width: isOpen ? '320px' : '0px'
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {/* Content Container */}
            <div className="flex flex-col h-full w-[320px] py-6 px-6 text-white font-outfit overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-violet-800 flex items-center justify-center font-bold text-lg overflow-hidden border border-white/20">
                            {user?.picture ? (
                                <img src={user.picture} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none">{user?.name || 'User'}</span>
                            <span className="text-xs text-white/50">{user?.email}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/70 hover:text-white" />
                    </button>
                </div>

                {/* Personal Context */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Personal Context</h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-h-[100px]">
                        <p className="text-sm text-white/70 italic">
                            Your personal preferences and search context will appear here.
                        </p>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-6 mb-auto">
                    {/* Theme Mode */}
                    <div>
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Appearance</h3>
                        <div className="bg-white/5 rounded-lg p-1 flex border border-white/10">
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${isDarkMode ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                            >
                                <Moon className="w-4 h-4" />
                                <span>Dark</span>
                            </button>
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${!isDarkMode ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                            >
                                <Sun className="w-4 h-4" />
                                <span>Light</span>
                            </button>
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Language</h3>
                        <div className="bg-white/5 rounded-lg p-1 flex border border-white/10">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${language === 'en' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                            >
                                <Globe className="w-4 h-4" />
                                <span>English</span>
                            </button>
                            <button
                                onClick={() => setLanguage('ru')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${language === 'ru' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                            >
                                <span className="text-xs font-bold">RU</span>
                                <span>Russian</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-8">
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all flex items-center justify-center gap-2 group">
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>Send Request</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 rounded-xl font-medium text-white/70 hover:text-red-400 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

export default RightSidebar;
