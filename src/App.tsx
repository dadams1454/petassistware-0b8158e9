
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LitterManagementPage from './modules/Reproduction/pages/LitterManagementPage';
import WelpingManagementPage from './modules/Reproduction/pages/WelpingManagementPage';
import BreedingManagementPage from './modules/Reproduction/pages/BreedingManagementPage';
import ReproductiveCyclePage from './modules/Reproduction/pages/ReproductiveCyclePage';
import WhelpingLiveSession from './modules/Reproduction/components/welping/WhelpingLiveSession';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-white p-4">
          <h1 className="text-xl font-bold">PetAssistWare</h1>
        </header>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<WelpingManagementPage />} />
            
            {/* Litter Management */}
            <Route path="/litters" element={<LitterManagementPage />} />
            
            {/* Welping Management */}
            <Route path="/reproduction" element={<WelpingManagementPage />} />
            <Route path="/welping" element={<WelpingManagementPage />} />
            
            {/* Breeding Management */}
            <Route path="/breeding" element={<BreedingManagementPage />} />
            <Route path="/dogs/:dogId/reproductive-cycle" element={<ReproductiveCyclePage />} />
            
            {/* Add the new live whelping route */}
            <Route path="/welping/:id/live" element={<WhelpingLiveSession />} />
          </Routes>
        </main>
        <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
          <p>Bear Paw Newfoundlands &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
