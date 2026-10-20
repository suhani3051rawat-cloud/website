import React, { createContext, useContext, useState } from "react";

const AddressContext = createContext(null);
const STORAGE_KEY = "selectedAddress";

export function AddressProvider({ children }) {
    const [selectedAddress, setSelectedAddress] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const selectAddress = (address) => {
        setSelectedAddress(address);
        try {
            if (address) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
        }
    };

    const clearSelectedAddress = () => selectAddress(null);

    return (
        <AddressContext.Provider
            value={{ selectedAddress, selectAddress, clearSelectedAddress }}
        >
            {children}
        </AddressContext.Provider>
    );
}

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error("useAddress must be used inside AddressProvider");
    }
    return context;
};