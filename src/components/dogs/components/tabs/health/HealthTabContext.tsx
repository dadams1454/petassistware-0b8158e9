
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHealthTab, UseHealthTabResult } from '@/components/dogs/hooks/useHealthTab';

// Use the same interface as the useHealthTab hook
type HealthTabContextProps = UseHealthTabResult;

const HealthTabContext = createContext<HealthTabContextProps | undefined>(undefined);

export const useHealthTabContext = () => {
  const context = useContext(HealthTabContext);
  if (!context) {
    throw new Error('useHealthTabContext must be used within a HealthTabProvider');
  }
  return context;
};

interface HealthTabProviderProps {
  children: React.ReactNode;
  dogId?: string;
}

export const HealthTabProvider: React.FC<HealthTabProviderProps> = ({ 
  children,
  dogId: propsDogId 
}) => {
  const { dogId: dogIdParam } = useParams();
  const dogId = propsDogId || (dogIdParam as string);
  
  // Use our hook that provides all the necessary functionality
  const healthTabState = useHealthTab(dogId);

  return (
    <HealthTabContext.Provider value={healthTabState}>
      {children}
    </HealthTabContext.Provider>
  );
};
