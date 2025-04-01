
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
  healthIndicatorDialogOpen: boolean;
  setHealthIndicatorDialogOpen: (open: boolean) => void;
  selectedRecordType?: HealthRecordTypeEnum;
  selectedRecord?: string;
  weightHistory: WeightRecord[];
  growthStats: any;
  isLoading: boolean;
  handleSaveRecord: () => void;
  handleSaveWeight: (data: any) => void;
  // Add missing properties
  activeTab: string;
  setActiveTab: (tab: string) => void;
  healthRecords: any[];
  getRecordsByType: (type: HealthRecordTypeEnum) => any[];
  handleAddRecord: (type: HealthRecordTypeEnum) => void;
  handleEditRecord: (recordId: string) => void;
  // Add the action functions
  openAddVaccinationDialog: () => void;
  openAddExaminationDialog: () => void;
  openAddMedicationDialog: () => void;
  openAddWeightDialog: () => void;
  openAddHealthIndicatorDialog: () => void;
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
  const [activeTab, setActiveTab] = useState('summary');
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [healthIndicatorDialogOpen, setHealthIndicatorDialogOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordTypeEnum>();
  const [selectedRecord, setSelectedRecord] = useState<string>();
  
  const { 
    healthRecords, 
    isLoading: isHealthLoading,
    addHealthRecord,
    updateHealthRecord,
    getRecordsByType
  } = useHealthRecords(dogId);
  
  const {
    weightHistory,
    isLoading: isWeightLoading,
    growthStats,
    addWeightRecord
  } = useWeightTracking(dogId);
  
  const isLoading = isHealthLoading || isWeightLoading;
  
  const handleAddRecord = (type: HealthRecordTypeEnum) => {
    setSelectedRecordType(type);
    setSelectedRecord(undefined);
    setRecordDialogOpen(true);
  };
  
  const handleEditRecord = (recordId: string) => {
    setSelectedRecord(recordId);
    setRecordDialogOpen(true);
  };
  
  const handleSaveRecord = () => {
    setRecordDialogOpen(false);
  };
  
  const handleSaveWeight = (data: any) => {
    addWeightRecord(data);
    setWeightDialogOpen(false);
  };
  
  // Add these convenience functions for opening dialogs
  const openAddVaccinationDialog = () => handleAddRecord(HealthRecordTypeEnum.Vaccination);
  const openAddExaminationDialog = () => handleAddRecord(HealthRecordTypeEnum.Examination);
  const openAddMedicationDialog = () => handleAddRecord(HealthRecordTypeEnum.Medication);
  const openAddWeightDialog = () => setWeightDialogOpen(true);
  const openAddHealthIndicatorDialog = () => setHealthIndicatorDialogOpen(true);
  
  const value = {
    dogId,
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    healthIndicatorDialogOpen,
    setHealthIndicatorDialogOpen,
    selectedRecordType,
    selectedRecord,
    weightHistory: weightHistory || [],
    growthStats,
    isLoading,
    handleSaveRecord,
    handleSaveWeight,
    // Add the missing properties to the context value
    activeTab,
    setActiveTab,
    healthRecords: healthRecords || [],
    getRecordsByType,
    handleAddRecord,
    handleEditRecord,
    // Add the new helper functions
    openAddVaccinationDialog,
    openAddExaminationDialog,
    openAddMedicationDialog,
    openAddWeightDialog,
    openAddHealthIndicatorDialog
  };
  
  return (
    <HealthTabContext.Provider value={value}>
      {children}
    </HealthTabContext.Provider>
  );
};
