
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import DogsPage from '@/pages/Dogs';
import DogDetailPage from '@/pages/DogDetail';
import LittersPage from '@/pages/Litters';
import LitterDetailPage from '@/pages/LitterDetail';
import CustomersPage from '@/pages/Customers';
import CustomerDetailPage from '@/pages/CustomerDetail';
import ReservationsPage from '@/pages/Reservations';
import ReservationDetailPage from '@/pages/ReservationDetail';
import FinancesPage from '@/pages/Finances';
import MainLayout from '@/components/layout/MainLayout';
import DailyCare from '@/pages/DailyCare';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dogs" element={<DogsPage />} />
            <Route path="dogs/:id" element={<DogDetailPage />} />
            <Route path="litters" element={<LittersPage />} />
            <Route path="litters/:id" element={<LitterDetailPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="reservations/:id" element={<ReservationDetailPage />} />
            <Route path="finances" element={<FinancesPage />} />
            <Route path="daily-care" element={<DailyCare />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
