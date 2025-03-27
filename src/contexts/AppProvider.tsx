
import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { ThemeProvider } from './ThemeContext';
import { ConfirmProvider } from '@/hooks/useConfirm';
import { RefreshProvider } from './RefreshContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MedicationProvider } from './medication/MedicationContext';
import { FeedingProvider } from './feeding/FeedingContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <RefreshProvider>
            <ConfirmProvider>
              <MedicationProvider>
                <FeedingProvider>
                  {children}
                </FeedingProvider>
              </MedicationProvider>
            </ConfirmProvider>
          </RefreshProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
