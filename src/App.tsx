import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Dogs from './pages/Dogs';
import Litters from './pages/Litters';
import Puppies from './pages/Puppies';
import Reservations from './pages/Reservations';
import Analytics from './pages/Analytics';
import DailyCare from './pages/DailyCare';
import Finances from './pages/Finances';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import DogDetails from './pages/DogDetails';
import LitterDetails from './pages/LitterDetails';
import PuppyDetails from './pages/PuppyDetails';
import ReservationDetails from './pages/ReservationDetails';
import NotFound from './pages/NotFound';

// Import the RefreshProvider
import { RefreshProvider } from './contexts/refreshContext';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <RefreshProvider enableToasts={true}>
            <Toaster />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dogs" element={<Dogs />} />
              <Route path="/dogs/:id" element={<DogDetails />} />
              <Route path="/litters" element={<Litters />} />
              <Route path="/litters/:id" element={<LitterDetails />} />
              <Route path="/puppies" element={<Puppies />} />
              <Route path="/puppies/:id" element={<PuppyDetails />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reservations/:id" element={<ReservationDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/dailycare" element={<DailyCare />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RefreshProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
