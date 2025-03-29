
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GeneticPairingPage from '@/pages/GeneticPairingPage';
import LitterDetailPage from '@/pages/LitterDetail';
import DogDetailPage from '@/pages/DogDetail';
import DogProfilePage from '@/pages/DogProfile';
import WaitlistPage from '@/pages/WaitlistPage';
import WelpingPage from '@/pages/WelpingPage';
import PuppyDetailPage from '@/pages/PuppyDetail';
import EditPuppyPage from '@/pages/EditPuppyPage';
import EditDogPage from '@/pages/EditDogPage';
import NewDogPage from '@/pages/NewDogPage';
import DogsPage from '@/pages/DogsPage';
import EditLitterPage from '@/pages/EditLitterPage';
import NewLitterPage from '@/pages/NewLitterPage';
import LittersPage from '@/pages/Litters';
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
        <Route path="/litters" element={<LittersPage />} />
        <Route path="/litters/:id" element={<LitterDetailPage />} />
        <Route path="/litters/new" element={<NewLitterPage />} />
        <Route path="/litters/:id/edit" element={<EditLitterPage />} />

        {/* Dogs */}
        <Route path="/dogs" element={<DogsPage />} />
        <Route path="/dogs/new" element={<NewDogPage />} />
        <Route path="/dogs/:id" element={<DogDetailPage />} />
        <Route path="/dogs/:id/edit" element={<EditDogPage />} />
        <Route path="/dogs/:id/profile" element={<DogProfilePage />} />

        {/* Welping */}
        <Route path="/welping/:id" element={<WelpingPage />} />

        {/* Puppies */}
        <Route path="/puppies/:id" element={<PuppyDetailPage />} />
        <Route path="/puppies/:id/edit" element={<EditPuppyPage />} />

        {/* Waitlist */}
        <Route path="/waitlist" element={<WaitlistPage />} />

        {/* Genetics */}
        <Route path="/genetics/pairing" element={<GeneticPairingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
