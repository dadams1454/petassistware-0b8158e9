
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Dogs from './pages/Dogs';
import Litters from './pages/Litters';
import DailyCare from './pages/DailyCare';
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
              <Route path="/litters" element={<Litters />} />
              <Route path="/dailycare" element={<DailyCare />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RefreshProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
