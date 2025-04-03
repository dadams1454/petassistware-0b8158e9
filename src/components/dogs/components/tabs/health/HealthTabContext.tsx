
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDogHealthRecords } from '@/hooks/useDogHealthRecords';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';
import { WeightRecord } from '@/types/health';

interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  projectedWeight?: number;
  weightGoal?: number;
}

interface HealthTabContextProps {
  dogId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  healthRecords: HealthRecord[];
  isLoading: boolean;
  error: Error | null;
  showAddRecordDialog: boolean;
  setShowAddRecordDialog: (show: boolean) => void;
  selectedRecordType: HealthRecordTypeEnum;
  setSelectedRecordType: (type: HealthRecordTypeEnum) => void;
  recordToEdit: HealthRecord | null;
  setRecordToEdit: (record: HealthRecord | null) => void;
  recordToDelete: string | null;
  setRecordToDelete: (recordId: string | null) => void;
  handleAddHealthRecord: (data: Partial<HealthRecord>) => Promise<any>;
  handleUpdateHealthRecord: (data: Partial<HealthRecord>) => Promise<any>;
  handleDeleteHealthRecord: () => Promise<void>;
  refreshRecords: () => void;
  
  // Extended properties for dialogs
  recordDialogOpen: boolean;
  setRecordDialogOpen: (open: boolean) => void;
  weightDialogOpen: boolean;
  setWeightDialogOpen: (open: boolean) => void;
  healthIndicatorDialogOpen: boolean;
  setHealthIndicatorDialogOpen: (open: boolean) => void;
  selectedRecord: string | null;
  handleSaveRecord: (data: Partial<HealthRecord>) => Promise<any>;
  handleSaveWeight: (data: Partial<WeightRecord>) => Promise<any>;
  
  // Extended properties for actions
  openAddVaccinationDialog: () => void;
  openAddExaminationDialog: () => void;
  openAddMedicationDialog: () => void;
  openAddWeightDialog: () => void;
  openAddHealthIndicatorDialog: () => void;
  
  // Weight management
  weightHistory: WeightRecord[];
  growthStats: GrowthStats;
  
  // Get records by type (for various tabs)
  getRecordsByType: (type: HealthRecordTypeEnum) => HealthRecord[];
  handleAddRecord: (type: HealthRecordTypeEnum) => void;
  handleEditRecord: (recordId: string) => void;
}

const HealthTabContext = createContext<HealthTabContextProps | undefined>(undefined);

export const useHealthTabContext = () => {
  const context = useContext(HealthTabContext);
  
  if (context === undefined) {
    throw new Error('useHealthTabContext must be used within a HealthTabProvider');
  }
  
  return context;
};

interface HealthTabProviderProps {
  children: React.ReactNode;
  dogId: string;
}

export const HealthTabProvider: React.FC<HealthTabProviderProps> = ({ 
  children, 
  dogId 
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordTypeEnum>(HealthRecordTypeEnum.Examination);
  const [recordToEdit, setRecordToEdit] = useState<HealthRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  // Dialog states
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [healthIndicatorDialogOpen, setHealthIndicatorDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  // Mock weight history and stats for now - these would be fetched from a hook
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  const [growthStats, setGrowthStats] = useState<GrowthStats>({
    percentChange: 0,
    averageGrowthRate: 0
  });
  
  const { 
    records: healthRecords, 
    isLoading, 
    error, 
    addHealthRecord, 
    updateHealthRecord, 
    deleteHealthRecord, 
    refresh: refreshRecords 
  } = useDogHealthRecords(dogId);
  
  const handleAddHealthRecord = async (data: Partial<HealthRecord>) => {
    try {
      const result = await addHealthRecord({
        ...data,
        dog_id: dogId,
      } as Omit<HealthRecord, 'id'>);
      
      setShowAddRecordDialog(false);
      return result;
    } catch (error) {
      console.error('Error adding health record:', error);
      throw error;
    }
  };
  
  const handleUpdateHealthRecord = async (data: Partial<HealthRecord>) => {
    if (!recordToEdit?.id) return null;
    
    try {
      const result = await updateHealthRecord(recordToEdit.id, data);
      setRecordToEdit(null);
      return result;
    } catch (error) {
      console.error('Error updating health record:', error);
      throw error;
    }
  };
  
  const handleDeleteHealthRecord = async () => {
    if (!recordToDelete) return;
    
    try {
      await deleteHealthRecord(recordToDelete);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error deleting health record:', error);
      throw error;
    }
  };
  
  // Dialog action handlers
  const openAddVaccinationDialog = () => {
    setSelectedRecordType(HealthRecordTypeEnum.Vaccination);
    setRecordDialogOpen(true);
  };
  
  const openAddExaminationDialog = () => {
    setSelectedRecordType(HealthRecordTypeEnum.Examination);
    setRecordDialogOpen(true);
  };
  
  const openAddMedicationDialog = () => {
    setSelectedRecordType(HealthRecordTypeEnum.Medication);
    setRecordDialogOpen(true);
  };
  
  const openAddWeightDialog = () => {
    setWeightDialogOpen(true);
  };
  
  const openAddHealthIndicatorDialog = () => {
    setHealthIndicatorDialogOpen(true);
  };
  
  const handleSaveRecord = async (data: Partial<HealthRecord>) => {
    // Handle record save logic
    return handleAddHealthRecord(data);
  };
  
  const handleSaveWeight = async (data: Partial<WeightRecord>) => {
    // Mock implementation - would be implemented with a proper weight service
    console.log('Saving weight:', data);
    return Promise.resolve(data);
  };
  
  // Helper function to get records by type
  const getRecordsByType = (type: HealthRecordTypeEnum) => {
    return healthRecords.filter(record => record.record_type === type);
  };
  
  // Helper functions for the tabs
  const handleAddRecord = (type: HealthRecordTypeEnum) => {
    setSelectedRecordType(type);
    setRecordDialogOpen(true);
  };
  
  const handleEditRecord = (recordId: string) => {
    const record = healthRecords.find(r => r.id === recordId);
    if (record) {
      setRecordToEdit(record);
      setRecordDialogOpen(true);
    }
  };
  
  useEffect(() => {
    // Reset form state when tab changes
    setShowAddRecordDialog(false);
    setRecordToEdit(null);
    setRecordToDelete(null);
    setRecordDialogOpen(false);
    setWeightDialogOpen(false);
    setHealthIndicatorDialogOpen(false);
  }, [activeTab]);
  
  const contextValue: HealthTabContextProps = {
    dogId,
    activeTab,
    setActiveTab,
    healthRecords,
    isLoading,
    error,
    showAddRecordDialog,
    setShowAddRecordDialog,
    selectedRecordType,
    setSelectedRecordType,
    recordToEdit,
    setRecordToEdit,
    recordToDelete,
    setRecordToDelete,
    handleAddHealthRecord,
    handleUpdateHealthRecord,
    handleDeleteHealthRecord,
    refreshRecords,
    
    // Dialog states
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    healthIndicatorDialogOpen,
    setHealthIndicatorDialogOpen,
    selectedRecord,
    handleSaveRecord,
    handleSaveWeight,
    
    // Action handlers
    openAddVaccinationDialog,
    openAddExaminationDialog,
    openAddMedicationDialog,
    openAddWeightDialog,
    openAddHealthIndicatorDialog,
    
    // Weight tracking
    weightHistory,
    growthStats,
    
    // Helper functions for tabs
    getRecordsByType,
    handleAddRecord,
    handleEditRecord
  };
  
  return (
    <HealthTabContext.Provider value={contextValue}>
      {children}
    </HealthTabContext.Provider>
  );
};
