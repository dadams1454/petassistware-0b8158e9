
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Dogs from '@/pages/Dogs';
import Litters from '@/pages/Litters';
import LitterDetail from '@/pages/LitterDetail';
import AddLitter from '@/pages/AddLitter';
import Calendar from '@/pages/Calendar';
import Documents from '@/pages/Documents';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthProvider';
import ContractPage from './pages/ContractPage';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="bearPaw-theme">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dogs" element={<Dogs />} />
                <Route path="/litters" element={<Litters />} />
                <Route path="/litters/:id" element={<LitterDetail />} />
                <Route path="/add-litter" element={<AddLitter />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/contracts/:id" element={<ContractPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
