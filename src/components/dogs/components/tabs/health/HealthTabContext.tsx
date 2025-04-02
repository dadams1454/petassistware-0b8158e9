
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeightRecord } from '@/types/health';

interface HealthTabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recentHealthRecords: any[];
  weightRecords: WeightRecord[];
  medications: any[];
  isLoading: boolean;
  refreshData: () => void;
}

const defaultContext: HealthTabContextType = {
  activeTab: 'summary',
  setActiveTab: () => {},
  recentHealthRecords: [],
  weightRecords: [],
  medications: [],
  isLoading: false,
  refreshData: () => {},
};

const HealthTabContext = createContext<HealthTabContextType>(defaultContext);

export const useHealthTabContext = () => useContext(HealthTabContext);

interface HealthTabProviderProps {
  children: ReactNode;
  dogId: string;
}

export const HealthTabProvider: React.FC<HealthTabProviderProps> = ({ children, dogId }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [recentHealthRecords, setRecentHealthRecords] = useState<any[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [medications, setMedications] = useState<any[]>([]);

  const refreshData = () => {
    setIsLoading(true);
    
    // Mock fetch data in a future implementation
    setTimeout(() => {
      setRecentHealthRecords([]);
      setWeightRecords([]);
      setMedications([]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <HealthTabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        recentHealthRecords,
        weightRecords,
        medications,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </HealthTabContext.Provider>
  );
};
