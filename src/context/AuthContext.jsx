import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initial state from localStorage or default
    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken) {
            return savedUser ? JSON.parse(savedUser) : { name: 'User', plan: 'Free', token: savedToken };
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(!!user);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        // Sync state with localStorage if needed, or just rely on init
        setIsAuthenticated(!!user);
    }, [user]);

    const openLoginModal = (path) => {
        setRedirectPath(path || '/search');
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
        setRedirectPath(null);
    };

    const login = (userData) => {
        // userData should ideally contain token, name, plan
        // specific to FastDeal requirements

        // If userData comes from Google, it might just be token + profile
        // We normalize it here
        const normalizedUser = {
            name: userData.name || 'Trader',
            email: userData.email,
            plan: userData.plan || 'Free', // Default to Free
            token: userData.token || localStorage.getItem('token'),
            picture: userData.picture
        };

        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
        localStorage.setItem('user', JSON.stringify(normalizedUser));

        setUser(normalizedUser);
        setIsAuthenticated(true);
        setIsLoginModalOpen(false); // Close modal on success
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        // Optional: clear other persisted state like tracking slots if stored locally
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal,
            redirectPath
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
