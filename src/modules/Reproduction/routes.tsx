
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ReproductionManagementPage from './pages/ReproductionManagementPage';
import WelpingManagementPage from './pages/WelpingManagementPage';
import BreedingDashboard from './pages/BreedingDashboard';
import LittersManagement from './pages/LittersManagement';
import ReproductiveDashboard from './pages/ReproductiveDashboard';
import NewWelpingPage from './pages/NewWelpingPage';
import ViewWelpingPage from './pages/ViewWelpingPage';
import LitterDetailsPage from './pages/LitterDetailsPage';
import NewLitterPage from './pages/NewLitterPage';
import WhelpingLiveSession from './components/welping/WhelpingLiveSession';
import GeneticPairingAnalysisPage from '@/pages/GeneticPairingAnalysisPage';

// Create legacy route redirects to maintain backward compatibility
const LegacyRedirects = () => (
  <>
    <Route path="/litters" element={<Navigate to="/reproduction/litters" replace />} />
    <Route path="/litters/:litterId" element={<Navigate to="/reproduction/litters/:litterId" replace />} />
    <Route path="/litters/new" element={<Navigate to="/reproduction/litters/new" replace />} />
    <Route path="/breeding" element={<Navigate to="/reproduction/breeding" replace />} />
    <Route path="/breeding-prep" element={<Navigate to="/reproduction/breeding" replace />} />
    <Route path="/welping" element={<Navigate to="/reproduction/welping" replace />} />
    <Route path="/welping/:id" element={<Navigate to="/reproduction/welping/session/:id" replace />} />
  </>
);

const ReproductionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ReproductionManagementPage />}>
        <Route path="dashboard" element={<ReproductiveDashboard />} />
        <Route path="breeding" element={<BreedingDashboard />} />
        <Route path="breeding/pairing-analysis" element={<GeneticPairingAnalysisPage />} />
        <Route path="welping" element={<WelpingManagementPage />} />
        <Route path="welping/new" element={<NewWelpingPage />} />
        <Route path="welping/:welpingId" element={<ViewWelpingPage />} />
        <Route path="welping/session/:id" element={<WhelpingLiveSession />} />
        <Route path="litters" element={<LittersManagement />} />
        <Route path="litters/new" element={<NewLitterPage />} />
        <Route path="litters/:litterId" element={<LitterDetailsPage />} />
      </Route>
      
      {/* Redirect base path to dashboard */}
      <Route path="/" element={<Navigate to="/reproduction/dashboard" replace />} />
      
      {/* Legacy redirects for backward compatibility */}
      {LegacyRedirects()}
    </Routes>
  );
};

export default ReproductionRoutes;
