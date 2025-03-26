
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useDailyCareActions } from './useDailyCareActions';
import { DailyCareContextType } from './types';

const DailyCareContext = createContext<DailyCareContextType | undefined>(undefined);

export const DailyCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const careActions = useDailyCareActions(user?.id);

  return (
    <DailyCareContext.Provider
      value={{
        fetchDogCareLogs: careActions.fetchDogCareLogs,
        fetchCareTaskPresets: careActions.fetchCareTaskPresets,
        addCareLog: careActions.addCareLog,
        deleteCareLog: careActions.deleteCareLog,
        addCareTaskPreset: careActions.addCareTaskPreset,
        deleteCareTaskPreset: careActions.deleteCareTaskPreset,
        fetchAllDogsWithCareStatus: careActions.fetchAllDogsWithCareStatus,
        dogStatuses: careActions.dogStatuses,
        loading: careActions.loading,
        fetchRecentCareLogsByCategory: careActions.fetchRecentCareLogsByCategory,
      }}
    >
      {children}
    </DailyCareContext.Provider>
  );
};

export const useDailyCare = () => {
  const context = useContext(DailyCareContext);
  if (context === undefined) {
    throw new Error('useDailyCare must be used within a DailyCareProvider');
  }
  return context;
};
