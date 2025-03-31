
import React, { createContext, useContext, useState } from 'react';
import { HealthRecordTypeEnum, WeightRecord } from '@/types/health';
import { useWeightTracking } from '@/components/dogs/hooks/useWeightTracking';
import { useHealthRecords } from '@/components/dogs/hooks/useHealthRecords';

interface HealthTabContextType {
  dogId: string;
  recordDialogOpen: boolean;
  setRecordDialogOpen: (open: boolean) => void;
  weightDialogOpen: boolean;
  setWeightDialogOpen: (open: boolean) => void;
  selectedRecordType?: HealthRecordTypeEnum;
  selectedRecord?: string;
  weightHistory: WeightRecord[];
  growthStats: any;
  isLoading: boolean;
  handleSaveRecord: () => void;
  handleSaveWeight: (data: any) => void;
}

const HealthTabContext = createContext<HealthTabContextType | undefined>(undefined);

export const useHealthTabContext = () => {
  const context = useContext(HealthTabContext);
  if (!context) {
    throw new Error('useHealthTabContext must be used within a HealthTabProvider');
  }
  return context;
};

interface HealthTabProviderProps {
  dogId: string;
  children: React.ReactNode;
}

export const HealthTabProvider: React.FC<HealthTabProviderProps> = ({ dogId, children }) => {
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordTypeEnum>();
  const [selectedRecord, setSelectedRecord] = useState<string>();
  
  const { 
    healthRecords, 
    isLoading: isHealthLoading,
    addHealthRecord,
    updateHealthRecord
  } = useHealthRecords(dogId);
  
  const {
    weightHistory,
    isLoading: isWeightLoading,
    growthStats,
    addWeightRecord
  } = useWeightTracking(dogId);
  
  const isLoading = isHealthLoading || isWeightLoading;
  
  const handleSaveRecord = () => {
    setRecordDialogOpen(false);
  };
  
  const handleSaveWeight = (data: any) => {
    addWeightRecord(data);
    setWeightDialogOpen(false);
  };
  
  const value = {
    dogId,
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    selectedRecordType,
    selectedRecord,
    weightHistory: weightHistory || [],
    growthStats,
    isLoading,
    handleSaveRecord,
    handleSaveWeight
  };
  
  return (
    <HealthTabContext.Provider value={value}>
      {children}
    </HealthTabContext.Provider>
  );
};
