
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Dogs from './pages/Dogs';
import Litters from './pages/Litters';
import DailyCare from './pages/DailyCare';
import NotFound from './pages/NotFound';

// Import the Providers
import { RefreshProvider } from './contexts/refresh';
import { RefreshTimestampProvider } from './contexts/refreshTimestamp';
import { AuthProvider } from './contexts/AuthProvider';
import { DailyCareProvider } from './contexts/dailyCare';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <AuthProvider>
            <RefreshProvider enableToasts={true}>
              <RefreshTimestampProvider>
                <DailyCareProvider>
                  <Toaster />
                  <Routes>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/dogs" element={<Dogs />} />
                      <Route path="/litters" element={<Litters />} />
                      <Route path="/dailycare" element={<DailyCare />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DailyCareProvider>
              </RefreshTimestampProvider>
            </RefreshProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
