
import React from "react";
import { AuthProvider } from "./pages/AuthContext.jsx";
import { AddressProvider } from "./pages/AddressContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/HeroSection.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import Footer from "./pages/Footer.jsx";

function App() {
    return (
        <AuthProvider>
            <AddressProvider>
                <Navbar />
                <Hero />
                <AppRoutes />
                <Footer />
            </AddressProvider>
        </AuthProvider>
    );
}

export default App;
