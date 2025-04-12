
import { useState, useCallback } from 'react';
import { HealthRecord, WeightRecord, HealthRecordTypeEnum } from '@/types';
import { useHealthRecords } from './useHealthRecords';
import { useWeightTracking } from './useWeightTracking';

export interface UseHealthTabResult {
  healthRecords: HealthRecord[];
  weightRecords: WeightRecord[];
  activeTab: string;
  recordDialogOpen: boolean;
  weightDialogOpen: boolean;
  healthIndicatorDialogOpen: boolean;
  selectedRecordType?: HealthRecordTypeEnum;
  selectedRecord?: string;
  isLoading: boolean;
  error: any;
  
  setActiveTab: (tab: string) => void;
  setRecordDialogOpen: (open: boolean) => void;
  setWeightDialogOpen: (open: boolean) => void;
  setHealthIndicatorDialogOpen: (open: boolean) => void;
  
  openAddVaccinationDialog: () => void;
  openAddExaminationDialog: () => void;
  openAddMedicationDialog: () => void;
  openAddWeightDialog: () => void;
  openAddHealthIndicatorDialog: () => void;
  
  handleSaveRecord: (record: any) => void;
  handleSaveWeight: (weight: any) => void;
  
  refreshHealthRecords: () => void;
  refreshWeightRecords: () => void;
  refreshAllData: () => Promise<void>;
  
  // Additional properties
  vaccinationRecords: HealthRecord[];
  examinationRecords: HealthRecord[];
  medicationRecords: HealthRecord[];
  getRecordsByType: (type: HealthRecordTypeEnum) => HealthRecord[];
}

export const useHealthTab = (dogId: string): UseHealthTabResult => {
  const [activeTab, setActiveTab] = useState('summary');
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [healthIndicatorDialogOpen, setHealthIndicatorDialogOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordTypeEnum>();
  const [selectedRecord, setSelectedRecord] = useState<string>();
  
  const { 
    healthRecords, 
    isLoading: isLoadingHealth, 
    error: healthError,
    refreshHealthRecords,
    addHealthRecord,
    updateHealthRecord
  } = useHealthRecords(dogId);
  
  const {
    weightRecords,
    isLoading: isLoadingWeight,
    error: weightError,
    refreshWeightRecords,
    addWeightRecord
  } = useWeightTracking(dogId);
  
  const openAddVaccinationDialog = useCallback(() => {
    setSelectedRecordType(HealthRecordTypeEnum.VACCINATION);
    setSelectedRecord(undefined);
    setRecordDialogOpen(true);
  }, []);
  
  const openAddExaminationDialog = useCallback(() => {
    setSelectedRecordType(HealthRecordTypeEnum.EXAMINATION);
    setSelectedRecord(undefined);
    setRecordDialogOpen(true);
  }, []);
  
  const openAddMedicationDialog = useCallback(() => {
    setSelectedRecordType(HealthRecordTypeEnum.MEDICATION);
    setSelectedRecord(undefined);
    setRecordDialogOpen(true);
  }, []);
  
  const openAddWeightDialog = useCallback(() => {
    setWeightDialogOpen(true);
  }, []);
  
  const openAddHealthIndicatorDialog = useCallback(() => {
    setHealthIndicatorDialogOpen(true);
  }, []);
  
  const handleSaveRecord = useCallback(async (record: any) => {
    try {
      if (record.id) {
        await updateHealthRecord(record);
      } else {
        await addHealthRecord({
          ...record,
          dog_id: dogId
        });
      }
      
      refreshHealthRecords();
    } catch (error) {
      console.error('Error saving health record:', error);
    }
  }, [dogId, addHealthRecord, updateHealthRecord, refreshHealthRecords]);
  
  const handleSaveWeight = useCallback(async (weight: any) => {
    try {
      await addWeightRecord({
        ...weight,
        dog_id: dogId
      });
      
      refreshWeightRecords();
    } catch (error) {
      console.error('Error saving weight record:', error);
    }
  }, [dogId, addWeightRecord, refreshWeightRecords]);
  
  const refreshAllData = useCallback(async () => {
    refreshHealthRecords();
    refreshWeightRecords();
  }, [refreshHealthRecords, refreshWeightRecords]);
  
  // Filter health records by type
  const getRecordsByType = useCallback((type: HealthRecordTypeEnum) => {
    return healthRecords.filter(record => record.record_type === type);
  }, [healthRecords]);
  
  const vaccinationRecords = getRecordsByType(HealthRecordTypeEnum.VACCINATION);
  const examinationRecords = getRecordsByType(HealthRecordTypeEnum.EXAMINATION);
  const medicationRecords = getRecordsByType(HealthRecordTypeEnum.MEDICATION);
  
  return {
    healthRecords,
    weightRecords,
    activeTab,
    recordDialogOpen,
    weightDialogOpen,
    healthIndicatorDialogOpen,
    selectedRecordType,
    selectedRecord,
    isLoading: isLoadingHealth || isLoadingWeight,
    error: healthError || weightError,
    
    setActiveTab,
    setRecordDialogOpen,
    setWeightDialogOpen,
    setHealthIndicatorDialogOpen,
    
    openAddVaccinationDialog,
    openAddExaminationDialog,
    openAddMedicationDialog,
    openAddWeightDialog,
    openAddHealthIndicatorDialog,
    
    handleSaveRecord,
    handleSaveWeight,
    
    refreshHealthRecords,
    refreshWeightRecords,
    refreshAllData,
    
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    getRecordsByType
  };
};
