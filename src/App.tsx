
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LitterManagementPage from './modules/Reproduction/pages/LitterManagementPage';
import WelpingManagementPage from './modules/Reproduction/pages/WelpingManagementPage';
import BreedingManagementPage from './modules/Reproduction/pages/BreedingManagementPage';
import ReproductiveCyclePage from './modules/Reproduction/pages/ReproductiveCyclePage';
import WhelpingLiveSession from './modules/Reproduction/components/welping/WhelpingLiveSession';
import WelpingPage from './pages/WelpingPage';
import DashboardPage from './pages/DashboardPage';

// Import dog-related pages
import DogProfilePage from './pages/DogProfilePage';
import DogManagementPage from './pages/DogManagementPage'; 
import NewDogPage from './pages/NewDogPage';
import EditDogPage from './pages/EditDogPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main app routes - wrapped in MainLayout for consistent navigation */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Dog Management */}
          <Route path="/dogs" element={<DogManagementPage />} />
          <Route path="/dogs/new" element={<NewDogPage />} />
          <Route path="/dogs/:id" element={<DogProfilePage />} />
          <Route path="/dogs/:id/edit" element={<EditDogPage />} />
          <Route path="/dogs/:dogId/reproductive-cycle" element={<ReproductiveCyclePage />} />
          
          {/* Litter Management */}
          <Route path="/litters" element={<LitterManagementPage />} />
          
          {/* Welping Management */}
          <Route path="/reproduction" element={<WelpingManagementPage />} />
          <Route path="/welping" element={<WelpingManagementPage />} />
          <Route path="/welping/new" element={<WelpingPage />} />
          <Route path="/welping/:id" element={<WelpingPage />} />
          <Route path="/welping/:id/live" element={<WhelpingLiveSession />} />
          
          {/* Breeding Management */}
          <Route path="/breeding" element={<BreedingManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
