import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Clock, Tag, Box, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const historyItems = [
        "Iphone 17 Pro Max for 5$...",
        "Black T-shirt from Nike ...",
        "Gaming Monitor 4k from ...",
        "Nike Running Shoes with ...",
        "Minecraft Toy with Functi ...",
        "Nike Shoes for the Basket ..."
    ];

    return (
        <motion.div
            className="fixed top-0 left-0 h-full z-[100] flex flex-col justify-between bg-[#0D0B14] overflow-hidden shadow-2xl border-r border-white/5"
            initial={{ width: '80px' }}
            animate={{
                width: isOpen ? '280px' : '80px'
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full py-6 text-white font-outfit overflow-hidden">

                {/* Top Section: Header & Toggle */}
                <div className={`transition-all duration-300 ${isOpen ? 'px-6' : 'px-0 items-center flex flex-col'}`}>
                    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer group flex items-center justify-center mb-6 mt-2 w-10 h-10 rounded-full hover:bg-white/10 transition-colors -translate-x-[2px]">
                        <Menu className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                    </div>

                    <div className="flex flex-col gap-6 mb-8 mt-2">
                        <Link to="/pricing" className={`flex items-center gap-4 hover:text-white transition-colors group ${!isOpen && 'justify-center'} text-lavenderWhite font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap`}>
                            <Tag className="w-6 h-6 flex-shrink-0" />
                            <motion.span
                                animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                                transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
                                className="text-sm"
                            >
                                PRICINGS
                            </motion.span>
                        </Link>
                        <Link to="/orders" className={`flex items-center gap-4 hover:text-white transition-colors group ${!isOpen && 'justify-center'} text-lavenderWhite font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap`}>
                            <Box className="w-6 h-6 flex-shrink-0" />
                            <motion.span
                                animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                                transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
                                className="text-sm"
                            >
                                MY ORDERS
                            </motion.span>
                        </Link>
                        <Link to="/best-deals" className={`flex items-center gap-4 hover:text-white transition-colors group ${!isOpen && 'justify-center'} text-lavenderWhite font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap`}>
                            <Tag className="w-6 h-6 flex-shrink-0" />
                            <motion.span
                                animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                                transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
                                className="text-sm"
                            >
                                BEST DEALS
                            </motion.span>
                        </Link>
                    </div>

                    {/* Search History Header */}
                    <motion.div
                        className="mb-4 overflow-hidden whitespace-nowrap"
                        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-lg font-bold text-white mb-2">Search History</h2>
                    </motion.div>

                    {/* History List */}
                    <ul className="space-y-2">
                        {historyItems.map((item, index) => (
                            <li
                                key={index}
                                className={`
                                    flex items-center gap-4 transition-all duration-300 group cursor-pointer rounded-lg
                                    ${isOpen ? 'px-3 py-2' : 'justify-center py-2'}
                                    ${index === 0 && isOpen ? 'bg-[#2A2B5F] text-white' : 'text-white/70 hover:text-white'}
                                `}
                            >
                                <Clock className="w-5 h-5 flex-shrink-0" />

                                <motion.span
                                    className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                                    animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                                    transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
                                >
                                    {item}
                                </motion.span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom Section: Settings */}
                <div className={`mt-auto mb-4 transition-all duration-300 ${isOpen ? 'px-6' : 'px-0 flex justify-center'}`}>
                    <a href="#" className={`flex items-center gap-4 text-white/40 hover:text-white transition-colors group ${!isOpen && 'justify-center'} overflow-hidden whitespace-nowrap`}>
                        <Settings className="w-6 h-6 flex-shrink-0" />
                        <motion.span
                            className="text-lg lowercase font-bold tracking-widest font-mono text-gray-500 hover:text-gray-300"
                            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                            transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
                        >
                            settings
                        </motion.span>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
