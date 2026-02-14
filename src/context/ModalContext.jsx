import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext({
    isFAQModalOpen: false,
    openFAQModal: () => { },
    closeFAQModal: () => { }
});

export const ModalProvider = ({ children }) => {
    const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    const openFAQModal = () => setIsFAQModalOpen(true);
    const closeFAQModal = () => setIsFAQModalOpen(false);

    const openPricingModal = () => setIsPricingModalOpen(true);
    const closePricingModal = () => setIsPricingModalOpen(false);

    return (
        <ModalContext.Provider value={{
            isFAQModalOpen,
            openFAQModal,
            closeFAQModal,
            isPricingModalOpen,
            openPricingModal,
            closePricingModal
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
