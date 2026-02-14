import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Mail } from 'lucide-react';
import WaitlistDashboard from './WaitlistDashboard';

const Waitlist = () => {
    const { isAuthenticated, user, openLoginModal } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error, duplicate, pending_verification
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [queuePosition, setQueuePosition] = useState(null);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [userType, setUserType] = useState('Personal Shopper');
    const [errorMessage, setErrorMessage] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    // Clear polling if status changes to success/duplicate


    const blockedDomains = ['10minutemail.com', 'temp-mail.org', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];

    const phrases = [
        "Stop searching. Start finding with FastDeal",
        "Quality products, global prices, zero compromise",
        "The future of global shopping is just one click away"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 10000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    // Check for previous submission and pre-fill email
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            setEmail(user.email);
            const hasJoined = localStorage.getItem(`waitlist_joined_${user.email}`);
            if (hasJoined) {
                setStatus('success');
                // Retrieve stored queue position or generate a consistent mock based on email hash/length
                const storedQueue = localStorage.getItem(`waitlist_queue_${user.email}`);
                setQueuePosition(storedQueue || Math.floor(Math.random() * 4000) + 1000);
            }
        } else {
            // Reset if logged out
            if (status === 'success' && !isAuthenticated) {
                setStatus('idle');
            }
        }
    }, [isAuthenticated, user]);


    // Email validation regex (still good to have even if pre-filled)
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateEmailWithZeroBounce = async (email) => {
        const apiKey = import.meta.env.VITE_ZEROBOUNCE_API_KEY;

        // Mock validation if key is missing or for specific test emails (demo mode)
        if (!apiKey || apiKey.includes('your_zerobounce_api_key')) {
            console.warn('ZeroBounce API Key missing. Using mock validation.');
            if (email.includes('invalid')) return 'invalid';
            if (email.includes('spamtrap')) return 'spamtrap';
            return 'valid';
        }

        try {
            // ZeroBounce requires IP address, but for client-side calls it might be tricky to get accurate IP without a backend proxy. 
            // We'll pass an empty string or '1.1.1.1' as placeholder if not available, or use a service like ipify if strict.
            // For this implementation, we will try to call the API directly.
            // Note: Calling ZeroBounce validation from client-side exposes the API key. 
            // **SECURITY WARNING**: In a real production app, this should be done via a backend proxy.
            // Proceeding as per user request to implement "Frontend Logic".

            const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}&ip_address=`);
            const data = await response.json();
            return data.status; // 'valid', 'invalid', 'catch-all', 'unknown', 'spamtrap', 'abuse', 'do_not_mail'
        } catch (error) {
            console.error('ZeroBounce Validation Error:', error);
            return 'unknown'; // Fail open or closed? Let's fail open (allow) if API fails to avoid blocking legitimate users due to outage, 
            // OR return 'unknown' and allow with warning.
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        // Frontend validation
        if (!isValidEmail(email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address');
            return;
        }

        const emailDomain = email.split('@')[1];
        if (blockedDomains.includes(emailDomain)) {
            setStatus('error');
            setErrorMessage('Disposable email addresses are not accepted.');
            return;
        }

        setStatus('loading');
        setIsScanning(true);
        setErrorMessage('');

        // ZeroBounce Validation
        // Only perform if not already verified to save credits/time
        const validationStatus = await validateEmailWithZeroBounce(email);
        setIsScanning(false);

        const statusMessages = {
            invalid: "Error: This email address does not exist.",
            abuse: "Security Block: High-risk email detected.",
            spamtrap: "System Error: Use a legitimate primary email.",
            do_not_mail: "Unavailable: This address cannot receive mail."
        };

        if (statusMessages[validationStatus]) {
            setStatus('error');
            setErrorMessage(statusMessages[validationStatus]);
            return;
        }

        // Proceed if valid, catch-all, or unknown
        if (validationStatus === 'valid') {
            setErrorMessage('');
        } else if (validationStatus === 'catch-all') {
            // Optional: warning
        }

        const scriptURL = 'https://script.google.com/macros/s/AKfycbysnXX_-IiZY2xTSmmP-ZDOk1eGCDNV3awrK4zxnJ-zdi9kFWAqr5jIrpApv2udE8B-OA/exec';
        const formData = new FormData();
        formData.append('action', 'register');
        formData.append('email', email.toLowerCase().trim());
        formData.append('firstName', firstName.trim());
        formData.append('userType', userType);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.result === 'verification_sent') {
                setStatus('pending_code_verification');
                setVerificationMessage('Verification code sent. Please check your email.');
            }
            else if (data.result === 'success') {
                // Should not happen in new flow, but keep for fallback
                setStatus('success');
                setQueuePosition(data.row);
                if (user?.email) {
                    localStorage.setItem(`waitlist_joined_${user.email}`, 'true');
                    localStorage.setItem(`waitlist_queue_${user.email}`, data.row);
                }
            }
            else if (data.result === 'duplicate') {
                setStatus('duplicate');
                const position = data.row || 'N/A';
                setQueuePosition(position);

                if (user?.email) {
                    localStorage.setItem(`waitlist_joined_${user.email}`, 'true');
                    localStorage.setItem(`waitlist_queue_${user.email}`, position);
                }
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Failed to join waitlist. Please try again.');
            }

        } catch (err) {
            clearTimeout(timeoutId);
            console.error('Waitlist Error:', err);
            setStatus('error');

            if (err.name === 'AbortError') {
                setErrorMessage('Request timed out. Please check your connection and try again.');
            } else if (err.message === 'Failed to fetch') {
                setErrorMessage('Network error. Likely a CORS issue or ad blocker.');
            } else {
                setErrorMessage('Failed to join waitlist. Please try again.');
            }
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!verificationCode) return;

        setIsVerifyingCode(true);
        setErrorMessage('');

        const scriptURL = 'https://script.google.com/macros/s/AKfycbysnXX_-IiZY2xTSmmP-ZDOk1eGCDNV3awrK4zxnJ-zdi9kFWAqr5jIrpApv2udE8B-OA/exec';
        const formData = new FormData();
        formData.append('action', 'verifyCode');
        formData.append('email', email.toLowerCase().trim());
        formData.append('code', verificationCode.trim());

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.result === 'success' || data.result === 'duplicate') { // Duplicate treated as success if verifying same email
                setStatus('success');
                setQueuePosition(data.row);
                if (user?.email) {
                    localStorage.setItem(`waitlist_joined_${user.email}`, 'true');
                    localStorage.setItem(`waitlist_queue_${user.email}`, data.row);
                }
            } else {
                setErrorMessage(data.message || 'Invalid code. Please try again.');
            }
        } catch (err) {
            console.error('Verification Error:', err);
            setErrorMessage('Failed to verify code. Please try again.');
        } finally {
            setIsVerifyingCode(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center relative z-10 px-6 py-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electricPurple/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl w-full flex flex-col items-center text-center z-20">
                <motion.h2
                    className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Be the First to Search. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonMagenta">Join the Waitlist.</span>
                </motion.h2>

                <motion.p
                    className="text-lg md:text-xl text-white/70 font-outfit max-w-2xl mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    The global marketplace is evolving. Sign up to receive an exclusive invitation to our launch and start finding products with algorithmic precision.
                </motion.p>

                <motion.div
                    className="w-full max-w-md relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <AnimatePresence mode="wait">
                        {!isAuthenticated ? (
                            <motion.div
                                key="unauth"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <p className="text-violet-200/80 mb-2">Sign in to reserve your spot.</p>
                                <button
                                    onClick={() => openLoginModal()}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all"
                                >
                                    Sign In to Join
                                </button>
                                {status !== 'idle' && (
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem(`waitlist_joined_${user?.email}`);
                                            localStorage.removeItem(`waitlist_queue_${user?.email}`);
                                            setStatus('idle');
                                            setEmail('');
                                        }}
                                        className="text-white/30 text-xs hover:text-white/50 transition-colors mt-2"
                                    >
                                        [Reset Status]
                                    </button>
                                )}
                            </motion.div>
                        ) : status === 'pending_code_verification' ? (
                            <motion.div
                                key="pending_code"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full p-8 rounded-xl border border-violet-500/50 bg-violet-900/20 backdrop-blur-sm flex flex-col items-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-xl animate-pulse" />

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-16 h-16 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center mb-4 relative z-10"
                                >
                                    <Mail className="w-8 h-8 text-violet-200" />
                                </motion.div>

                                <h3 className="text-xl font-bold text-white mb-2 font-orbitron relative z-10">
                                    Check Your Email
                                </h3>
                                <p className="text-violet-200/80 text-sm font-outfit mb-6 relative z-10">
                                    We sent a 6-digit code to <span className="text-white font-semibold">{email}</span>.
                                </p>

                                <form onSubmit={handleVerifyCode} className="w-full flex flex-col gap-4 relative z-10">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="w-full px-6 py-4 bg-obsidian border border-violet-500/50 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-center tracking-widest text-xl font-mono"
                                        maxLength={6}
                                        required
                                    />

                                    {errorMessage && (
                                        <p className="text-red-400 text-sm font-outfit text-center">
                                            {errorMessage}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isVerifyingCode || verificationCode.length < 6}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                </form>

                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 text-violet-300/60 text-xs hover:text-violet-300 transition-colors z-10"
                                >
                                    Use a different email
                                </button>
                            </motion.div>
                        ) : (status === 'success' || status === 'duplicate') ? (
                            <WaitlistDashboard queuePosition={queuePosition} status={status} isDuplicate={status === 'duplicate'} />
                        ) : (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-4">
                                    {/* First Name Field */}
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="First Name (Optional)"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-6 py-4 bg-obsidian border border-violet-500/50 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all font-outfit"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                                    </div>

                                    {/* Email Field */}
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="Enter your email address..."
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (status === 'error') setStatus('idle');
                                            }}
                                            required
                                            readOnly={!!user?.email} // Optional: Make read-only if logged in with email
                                            className={`w-full px-6 py-4 bg-obsidian border border-violet-500/50 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all font-outfit ${user?.email ? 'opacity-80 cursor-not-allowed' : ''}`}
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                                    </div>

                                    {/* User Type Dropdown */}
                                    <div className="relative group">
                                        <select
                                            value={userType}
                                            onChange={(e) => setUserType(e.target.value)}
                                            className="w-full px-6 py-4 bg-obsidian border border-violet-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all font-outfit appearance-none cursor-pointer"
                                        >
                                            <option value="Personal Shopper">Personal Shopper</option>
                                            <option value="Reseller">Reseller</option>
                                            <option value="Tech Enthusiast">Tech Enthusiast</option>
                                            <option value="Business Buyer">Business Buyer</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                                    </div>
                                </div>

                                {status === 'error' && errorMessage && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-sm font-outfit text-left"
                                    >
                                        {errorMessage}
                                    </motion.p>
                                )}

                                {verificationMessage && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-emerald-400 text-sm font-outfit text-left font-semibold shadow-emerald-500/20 drop-shadow-sm"
                                    >
                                        {verificationMessage}
                                    </motion.p>
                                )}

                                {isScanning ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full py-4 rounded-xl bg-violet-900/40 border border-violet-500/30 flex items-center justify-center gap-3 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-md animate-pulse" />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_10px_#8b5cf6]"
                                        />
                                        <span className="text-violet-200 font-orbitron tracking-widest text-sm relative z-10">Scanning Signal...</span>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
                                        whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                                        whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                                    >
                                        <span className="relative z-10">
                                            {status === 'loading' ? 'Processing...' : 'Join'}
                                        </span>
                                        {status === 'loading' && (
                                            <motion.div
                                                className="absolute inset-0 bg-white/20"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '100%' }}
                                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            />
                                        )}
                                    </motion.button>
                                )}
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>


                {/* Rotating Motivational Text (Migrated from TransitionText) */}
                <div className="w-full mt-20 md:mt-32 max-w-6xl px-6 text-center z-20">
                    <AnimatePresence mode="wait">
                        <motion.h3
                            key={currentPhraseIndex}
                            className="text-2xl md:text-4xl font-orbitron font-bold uppercase tracking-[0.2em] leading-tight md:leading-snug"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)"
                            }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        >
                            <motion.span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-electricPurple to-neonMagenta"
                                animate={{
                                    filter: [
                                        "drop-shadow(0 0 20px rgba(138,43,226,0.3))",
                                        "drop-shadow(0 0 40px rgba(138,43,226,0.6))",
                                        "drop-shadow(0 0 20px rgba(138,43,226,0.3))"
                                    ]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    ease: "easeInOut"
                                }}
                            >
                                {phrases[currentPhraseIndex]}
                            </motion.span>
                        </motion.h3>
                    </AnimatePresence>
                </div>
            </div >
        </div >
    );
};

export default Waitlist;
