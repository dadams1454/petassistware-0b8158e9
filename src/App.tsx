
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LitterManagementPage from './modules/Reproduction/pages/LitterManagementPage';
import WelpingManagementPage from './modules/Reproduction/pages/WelpingManagementPage';
import BreedingManagementPage from './modules/Reproduction/pages/BreedingManagementPage';
import ReproductiveCyclePage from './modules/Reproduction/pages/ReproductiveCyclePage';
import WhelpingLiveSession from './modules/Reproduction/components/welping/WhelpingLiveSession';
import DashboardPage from './pages/DashboardPage';
import WelpingPage from './pages/WelpingPage';

// Import the dog-related pages we just created
import DogProfilePage from './pages/DogProfilePage';
import DogManagementPage from './pages/DogManagementPage';
import NewDogPage from './pages/NewDogPage';
import EditDogPage from './pages/EditDogPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-white p-4">
          <h1 className="text-xl font-bold">PetAssistWare</h1>
        </header>
        <main className="flex-1">
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<WelpingManagementPage />} />
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
