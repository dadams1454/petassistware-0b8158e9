
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import DogsPage from './pages/Dogs';
import DogProfilePage from './pages/DogProfile';
import LittersPage from './pages/Litters';
import LitterDetail from './pages/LitterDetail';
import AddLitter from './pages/AddLitter';
import BreedingPrepPage from './pages/BreedingPrepPage';
import WelpingPage from './pages/WelpingPage';
import Finances from './pages/Finances';
import Users from './pages/Users';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Index from './pages/Index';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReproductiveManagementPage from './pages/ReproductiveManagementPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* All routes go through the AuthLayout for auth checking */}
            <Route element={<AuthLayout />}>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with MainLayout (sidebar) */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                <Route path="/dogs" element={<DogsPage />} />
                <Route path="/dogs/new" element={<DogsPage />} />
                <Route path="/dogs/:id" element={<DogProfilePage />} />
                
                <Route path="/litters" element={<LittersPage />} />
                <Route path="/litters/new" element={<AddLitter />} />
                <Route path="/litters/:id" element={<LitterDetail />} />
                <Route path="/breeding-prep" element={<BreedingPrepPage />} />
                <Route path="/welping/:id" element={<WelpingPage />} />
                
                <Route path="/finances" element={<Finances />} />
                <Route path="/users" element={<Users />} />
                
                <Route path="/dogs/:dogId/reproductive" element={<ReproductiveManagementPage />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
