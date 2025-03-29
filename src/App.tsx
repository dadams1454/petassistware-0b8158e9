import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import LittersPage from '@/pages/LittersPage';
import LitterDetailPage from '@/pages/LitterDetail';
import NewLitterPage from '@/pages/NewLitterPage';
import EditLitterPage from '@/pages/EditLitterPage';
import DogsPage from '@/pages/DogsPage';
import NewDogPage from '@/pages/NewDogPage';
import DogDetailPage from '@/pages/DogDetail';
import EditDogPage from '@/pages/EditDogPage';
import WelpingPage from '@/pages/WelpingPage';
import PuppyDetailPage from '@/pages/PuppyDetail';
import EditPuppyPage from '@/pages/EditPuppyPage';
import DogProfilePage from '@/pages/DogProfile';
import WaitlistPage from '@/pages/WaitlistPage';
import GeneticPairingPage from '@/pages/GeneticPairingPage';

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
