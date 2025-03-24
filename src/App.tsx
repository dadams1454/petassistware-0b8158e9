
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthProvider';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { RefreshProvider } from '@/contexts/RefreshContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Dogs from '@/pages/Dogs';
import DogDetail from '@/pages/DogDetail';
import Litters from '@/pages/Litters';
import LitterDetail from '@/pages/LitterDetail';
import AddLitter from '@/pages/AddLitter';
import Customers from '@/pages/Customers';
import DailyCare from '@/pages/DailyCare';
import Calendar from '@/pages/Calendar';
import Communications from '@/pages/Communications';
import WelpingPage from '@/pages/WelpingPage';
import Profile from '@/pages/Profile';
import CustomerPortal from '@/pages/CustomerPortal';
import NotFound from '@/pages/NotFound';
import DogProfile from './pages/DogProfile';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RefreshProvider>
          <UserPreferencesProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dogs" element={<Dogs />} />
                <Route path="/dogs/:id" element={<DogDetail />} />
                <Route path="/profile/dog/:id" element={<DogProfile />} />
                <Route path="/litters" element={<Litters />} />
                <Route path="/litters/:id" element={<LitterDetail />} />
                <Route path="/litters/add" element={<AddLitter />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/daily-care" element={<DailyCare />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/communications" element={<Communications />} />
                <Route path="/welping" element={<WelpingPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/customer-portal/:customerId" element={<CustomerPortal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </UserPreferencesProvider>
        </RefreshProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
