import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AppRoutes from './routes/AppRoutes';
import Footer from './pages/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <HeroSection />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;