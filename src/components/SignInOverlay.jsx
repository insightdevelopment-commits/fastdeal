import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignInOverlay = () => {
    const { isLoginModalOpen, closeLoginModal, login, redirectPath } = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = async (tokenResponse) => {
        console.log('Login Success:', tokenResponse);

        try {
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }).then(res => res.json());

            login({
                token: tokenResponse.access_token,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                plan: 'Pro'
            });

            // Navigate to the intended path
            if (redirectPath) {
                navigate(redirectPath);
            }

        } catch (error) {
            console.error("Failed to fetch user info", error);
            login({ token: tokenResponse.access_token });
            if (redirectPath) navigate(redirectPath);
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: (error) => console.error('Login Failed:', error),
    });

    if (!isLoginModalOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLoginModal}
            >
                <motion.div
                    className="relative w-full max-w-md bg-obsidian border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-electricPurple/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-neonMagenta/20 rounded-full blur-[80px]" />

                    {/* Close Button */}
                    <button
                        onClick={closeLoginModal}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Content */}
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                            <Lock className="text-neonCyan w-8 h-8" />
                        </div>

                        <h2 className="text-3xl font-orbitron font-bold text-white mb-2 tracking-wide">
                            Access Restricted
                        </h2>
                        <p className="text-white/60 font-outfit mb-8 leading-relaxed">
                            Sign in to access the FastDeal Intelligence Terminal and unlock global price tracking.
                        </p>

                        <button
                            onClick={() => loginGoogle()}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-electricPurple to-neonMagenta text-white font-bold font-outfit uppercase tracking-widest transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] flex items-center justify-center gap-3"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 filter brightness-0 invert" />
                            Sign In with Google
                        </button>

                        <p className="mt-6 text-xs text-white/30">
                            By signing in, you agree to our Terms of Use and Privacy Policy.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SignInOverlay;
