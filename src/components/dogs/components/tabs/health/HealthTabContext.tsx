
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord } from '@/types/health';
import { useHealthRecords } from '@/components/dogs/hooks/useHealthRecords';

interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  projectedWeight?: number;
  weightGoal?: number;
}

interface HealthTabContextType {
  // Core state
  dogId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  refreshData: () => void;
  
  // Records data
  healthRecords: HealthRecord[];
  recentHealthRecords: HealthRecord[];
  weightRecords: WeightRecord[];
  weightHistory: WeightRecord[];
  medications: HealthRecord[];
  growthStats: GrowthStats;
  
  // Health record operations
  getRecordsByType: (type: HealthRecordTypeEnum) => HealthRecord[];
  handleAddRecord: (recordType: HealthRecordTypeEnum) => void;
  handleEditRecord: (recordId: string) => void;
  
  // Dialog management
  recordDialogOpen: boolean;
  setRecordDialogOpen: (open: boolean) => void;
  weightDialogOpen: boolean;
  setWeightDialogOpen: (open: boolean) => void;
  healthIndicatorDialogOpen: boolean;
  setHealthIndicatorDialogOpen: (open: boolean) => void;
  selectedRecordType: HealthRecordTypeEnum | null;
  selectedRecord: string | null;
  
  // Dialog action handlers
  openAddVaccinationDialog: () => void;
  openAddExaminationDialog: () => void;
  openAddMedicationDialog: () => void;
  openAddWeightDialog: () => void;
  openAddHealthIndicatorDialog: () => void;
  handleSaveRecord: (data: any) => void;
  handleSaveWeight: (data: any) => void;
}

const defaultContext: HealthTabContextType = {
  dogId: '',
  activeTab: 'summary',
  setActiveTab: () => {},
  isLoading: false,
  refreshData: () => {},
  
  // Records data
  healthRecords: [],
  recentHealthRecords: [],
  weightRecords: [],
  weightHistory: [],
  medications: [],
  growthStats: { percentChange: 0, averageGrowthRate: 0 },
  
  // Health record operations
  getRecordsByType: () => [],
  handleAddRecord: () => {},
  handleEditRecord: () => {},
  
  // Dialog management
  recordDialogOpen: false,
  setRecordDialogOpen: () => {},
  weightDialogOpen: false,
  setWeightDialogOpen: () => {},
  healthIndicatorDialogOpen: false,
  setHealthIndicatorDialogOpen: () => {},
  selectedRecordType: null,
  selectedRecord: null,
  
  // Dialog action handlers
  openAddVaccinationDialog: () => {},
  openAddExaminationDialog: () => {},
  openAddMedicationDialog: () => {},
  openAddWeightDialog: () => {},
  openAddHealthIndicatorDialog: () => {},
  handleSaveRecord: () => {},
  handleSaveWeight: () => {}
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
  const [recentHealthRecords, setRecentHealthRecords] = useState<HealthRecord[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [medications, setMedications] = useState<HealthRecord[]>([]);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [healthIndicatorDialogOpen, setHealthIndicatorDialogOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordTypeEnum | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  // Use the health records hook
  const { 
    healthRecords,
    isLoading: recordsLoading,
    getRecordsByType,
    addHealthRecord,
    updateHealthRecord
  } = useHealthRecords(dogId);

  // Mock growth stats for now
  const growthStats: GrowthStats = {
    percentChange: 2.5,
    averageGrowthRate: 0.15,
    projectedWeight: 65.5,
    weightGoal: 70
  };
  
  const handleAddRecord = (recordType: HealthRecordTypeEnum) => {
    setSelectedRecordType(recordType);
    setSelectedRecord(null);
    setRecordDialogOpen(true);
  };
  
  const handleEditRecord = (recordId: string) => {
    setSelectedRecord(recordId);
    setRecordDialogOpen(true);
  };
  
  const handleSaveRecord = (data: any) => {
    console.log('Saving health record:', data);
    // Implementation would go here
  };
  
  const handleSaveWeight = (data: any) => {
    console.log('Saving weight record:', data);
    // Implementation would go here
  };
  
  const openAddVaccinationDialog = () => handleAddRecord(HealthRecordTypeEnum.Vaccination);
  const openAddExaminationDialog = () => handleAddRecord(HealthRecordTypeEnum.Examination);
  const openAddMedicationDialog = () => handleAddRecord(HealthRecordTypeEnum.Medication);
  const openAddWeightDialog = () => setWeightDialogOpen(true);
  const openAddHealthIndicatorDialog = () => setHealthIndicatorDialogOpen(true);

  const refreshData = () => {
    setIsLoading(true);
    
    // This would be implemented with actual data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <HealthTabContext.Provider
      value={{
        dogId,
        activeTab,
        setActiveTab,
        isLoading: isLoading || recordsLoading,
        refreshData,
        
        // Records data
        healthRecords: healthRecords || [],
        recentHealthRecords,
        weightRecords,
        weightHistory: weightRecords, // Alias for consistency
        medications,
        growthStats,
        
        // Health record operations
        getRecordsByType,
        handleAddRecord,
        handleEditRecord,
        
        // Dialog management
        recordDialogOpen,
        setRecordDialogOpen,
        weightDialogOpen,
        setWeightDialogOpen,
        healthIndicatorDialogOpen,
        setHealthIndicatorDialogOpen,
        selectedRecordType,
        selectedRecord,
        
        // Dialog action handlers
        openAddVaccinationDialog,
        openAddExaminationDialog,
        openAddMedicationDialog,
        openAddWeightDialog,
        openAddHealthIndicatorDialog,
        handleSaveRecord,
        handleSaveWeight
      }}
    >
      {children}
    </HealthTabContext.Provider>
  );
};
