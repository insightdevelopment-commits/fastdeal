import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Background from '../components/Background';
import Footer from '../components/Footer';
import LegalHeader from '../components/LegalHeader';

const LegalLayout = () => {
    const scrollContainerRef = useRef(null);

    return (
        <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll scroll-smooth scrollbar-hide bg-[#050505] text-white font-outfit relative selection:bg-electricPurple/30">
            {/* Background Animation - Shared with Main Page */}
            <Background scrollContainer={scrollContainerRef} />

            {/* Simple Blurred Purple Light Overlay specific to Legal Pages */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-electricPurple/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Simplified Header */}
            <LegalHeader />

            {/* Main Content Area */}
            <div className="relative z-10 w-full min-h-screen flex flex-col pt-24">
                <Outlet />

                {/* Footer */}
                <div className="w-full bg-transparent mt-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default LegalLayout;
