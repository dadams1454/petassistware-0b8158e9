
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GeneticPairingPage from '@/pages/GeneticPairingPage';
import LitterDetailPage from '@/pages/LitterDetail';
import DogDetailPage from '@/pages/DogDetail';
import DogProfilePage from '@/pages/DogProfile';
import RegisterPage from '@/pages/Auth';
import LoginPage from '@/pages/Auth';
import LandingPage from '@/pages/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Litters */}
        <Route path="/litters/:id" element={<LitterDetailPage />} />

        {/* Dogs */}
        <Route path="/dogs/:id" element={<DogDetailPage />} />
        <Route path="/dogs/:id/profile" element={<DogProfilePage />} />

        {/* Genetics */}
        <Route path="/genetics/pairing" element={<GeneticPairingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
