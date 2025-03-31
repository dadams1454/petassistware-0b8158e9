
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthProvider';
import { RefreshProvider } from '@/contexts/RefreshContext';
import RouterConfig from '@/Router';

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
      <AuthProvider>
        <RefreshProvider>
          <Router>
            <RouterConfig />
          </Router>
          <Toaster />
        </RefreshProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
