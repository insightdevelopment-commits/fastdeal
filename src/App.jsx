import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import PricingPage from './components/PricingPage';
import OrdersPage from './components/OrdersPage';
import BestDealsPage from './components/BestDealsPage';
import PrivacyPage from './components/PrivacyPage';
import RefundPage from './components/RefundPage';
import TermsPage from './components/TermsPage';
import ProtectedRoute from './components/ProtectedRoute';
import LegalLayout from './Layouts/LegalLayout';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import SignInOverlay from './components/SignInOverlay';
import FAQModal from './components/FAQModal';
import PricingModal from './components/PricingModal';
import VerifyPage from './components/VerifyPage';

function App() {
    return (
        <AuthProvider>
            <ModalProvider>
                <SignInOverlay />
                <FAQModal />
                <PricingModal />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/verify" element={<VerifyPage />} />

                    {/* Legal Routes with specific Layout */}
                    <Route element={<LegalLayout />}>
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/refund" element={<RefundPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/search" element={<MainPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/best-deals" element={<BestDealsPage />} />
                    </Route>
                </Routes>
            </ModalProvider>
        </AuthProvider>
    );
}

export default App;
