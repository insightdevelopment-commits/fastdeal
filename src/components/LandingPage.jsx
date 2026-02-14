import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Background from './Background';
import Header from './Header';
import Hero from './Hero';
import Problem from './Problem';
import Relevance from './Relevance';
import Waitlist from './Waitlist';
import Solution from './Solution';
import FAQ from './FAQ';
import Reviews from './Reviews';
import Footer from './Footer';

const Section = ({ children, id, className = "" }) => (
    <motion.section
        id={id}
        className={`min-h-screen w-full relative bg-transparent text-white flex flex-col ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.1 }}
    >
        {children}
    </motion.section>
);

function LandingPage() {
    const scrollContainerRef = useRef(null);
    const [activeSection, setActiveSection] = React.useState('start');
    const [problemHover, setProblemHover] = React.useState(false);

    // Background Animation Speed Logic
    const getBgSpeed = () => {
        switch (activeSection) {
            case 'solution': return 2.0; // Efficient / Accelerated
            case 'faq': return 0.5; // Calm / Readable
            default: return 1.0;
        }
    };

    const handleScroll = (e) => {
        const container = e.target;
        const scrollPos = container.scrollTop + (window.innerHeight / 3); // Trigger earlier

        const sections = ['start', 'problem', 'relevance', 'waitlist', 'solution', 'faq', 'contact'];

        // Find the current section based on offset
        let currentId = 'start';
        for (const section of sections) {
            const el = document.getElementById(section);
            if (el && el.offsetTop <= scrollPos) {
                currentId = section;
            }
        }

        if (activeSection !== currentId) {
            setActiveSection(currentId);
        }
    };

    const handleNavigate = (id) => {
        const element = document.getElementById(id);
        if (element && scrollContainerRef.current) {
            const headerOffset = 100; // Height of header + breathing room
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            scrollContainerRef.current.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-screen w-full overflow-y-scroll scroll-smooth scrollbar-hide bg-obsidian text-white font-outfit relative"
        >
            <Background scrollContainer={scrollContainerRef} problemHover={problemHover} speed={getBgSpeed()} />
            <Header activeSection={activeSection} onNavigate={handleNavigate} />

            <Section id="start">
                <Hero />
            </Section>

            <Section id="problem" className="!min-h-0 h-auto">
                <Problem setHoverState={setProblemHover} />
            </Section>

            <Section id="relevance" className="!min-h-0">
                <Relevance />
            </Section>

            <Section id="waitlist">
                <Waitlist />
            </Section>

            <Section id="solution">
                <Solution />
            </Section>

            <Section id="faq">
                <FAQ />
            </Section>

            <Section id="reviews" className="!min-h-0 h-auto">
                <Reviews />
            </Section>

            <Section id="contact" className="!min-h-0 h-auto justify-end">
                <Footer />
            </Section>
        </div>
    );
}

export default LandingPage;
