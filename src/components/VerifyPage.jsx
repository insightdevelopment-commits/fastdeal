import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WaitlistDashboard from './WaitlistDashboard';
import { Loader2, AlertCircle } from 'lucide-react';

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [queuePosition, setQueuePosition] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token found.');
            return;
        }

        const verifyToken = async () => {
            try {
                // Determine API URL based on environment/config
                // Using the specific Google Apps Script URL provided earlier or a config variable
                const scriptURL = 'https://script.google.com/macros/s/AKfycbyUA75bAlWUiJXrOluTkNARblKnanZsjKJF7Mon1l7i0cwGUe9yORSzFvrejyYX8w/exec';

                const formData = new FormData();
                formData.append('action', 'verify');
                formData.append('token', token);

                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.result === 'success') {
                    setStatus('success');
                    // data.row now contains the actual verified count/position
                    setQueuePosition(data.row);

                    // Auto-redirect to landing page after 3 seconds
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    setStatus('error');

                    // Handle specific error codes from script
                    switch (data.code) {
                        case 'token_not_found':
                            setMessage('Invalid Token: This verification link is invalid or malformed.');
                            break;
                        case 'token_expired':
                            setMessage('Link Expired: verification links are valid for 24 hours. Please register again.');
                            break;
                        case 'already_verified':
                            setMessage('Already Verified: This token has already been used.');
                            break;
                        default:
                            setMessage(data.message || 'Verification failed. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Connection failed. Please check your internet connection.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div className="min-h-screen w-full bg-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electricPurple/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {status === 'verifying' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mb-6 relative"
                        >
                            <div className="absolute inset-0 bg-violet-500 blur-xl opacity-50" />
                            <Loader2 className="w-12 h-12 text-violet-500 relative z-10" />
                        </motion.div>
                        <h2 className="text-2xl font-orbitron text-white mb-2">Verifying Signal...</h2>
                        <p className="text-white/60 font-outfit">Securely establishing your connection to FastDeal.</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <WaitlistDashboard queuePosition={queuePosition} status="success" isDuplicate={false} />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            delay={1}
                            className="text-emerald-400 mt-6 font-orbitron text-lg tracking-widest"
                        >
                            SIGNAL SYNCHRONIZED
                        </motion.p>
                        <p className="text-white/40 text-sm mt-2">Redirecting to command center...</p>
                    </div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-2xl border border-red-500/30 bg-red-900/10 backdrop-blur-xl flex flex-col items-center text-center"
                    >
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <h2 className="text-2xl font-orbitron text-red-400 mb-2">Verification Failed</h2>
                        <p className="text-red-200/70 font-outfit mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                        >
                            Return Home
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default VerifyPage;
