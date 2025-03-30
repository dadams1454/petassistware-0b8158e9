
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthProvider';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { RefreshProvider } from '@/contexts/RefreshContext';
import { DailyCareProvider } from '@/contexts/dailyCare';
import Router from './Router';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <UserPreferencesProvider>
              <RefreshProvider>
                <DailyCareProvider>
                  <Router />
                  <Toaster />
                </DailyCareProvider>
              </RefreshProvider>
            </UserPreferencesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
