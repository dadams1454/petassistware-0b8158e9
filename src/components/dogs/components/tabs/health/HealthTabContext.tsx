
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHealthTabState } from './hooks/useHealthTabState';
import { HealthRecord, WeightRecord } from '@/types/health';

interface HealthTabContextProps {
  healthRecords: HealthRecord[];
  weightRecords: WeightRecord[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dogId: string;
  isLoading: boolean;
  error: any;
  refreshHealthRecords: () => void;
  refreshWeightRecords: () => void;
  refreshAllData: () => Promise<void>;
  vaccinationRecords: HealthRecord[];
  examinationRecords: HealthRecord[];
  medicationRecords: HealthRecord[];
}

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
  
  const healthTabState = useHealthTabState(dogId);

  const value: HealthTabContextProps = {
    healthRecords: healthTabState.healthRecords,
    weightRecords: healthTabState.weightRecords,
    activeTab: healthTabState.activeTab,
    setActiveTab: healthTabState.setActiveTab,
    dogId,
    isLoading: healthTabState.isLoading,
    error: healthTabState.error,
    refreshHealthRecords: healthTabState.refreshHealthRecords,
    refreshWeightRecords: healthTabState.refreshWeightRecords,
    refreshAllData: healthTabState.refreshAllData,
    vaccinationRecords: healthTabState.vaccinationRecords,
    examinationRecords: healthTabState.examinationRecords,
    medicationRecords: healthTabState.medicationRecords
  };

  return (
    <HealthTabContext.Provider value={value}>
      {children}
    </HealthTabContext.Provider>
  );
};
