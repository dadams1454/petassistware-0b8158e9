
import { useState } from 'react';
import { useHealthRecordsData } from './useHealthRecordsData';
import { useWeightRecords } from '@/modules/health';
import { HealthRecord } from '@/types/health';
import { WeightRecord } from '@/types/weight';

/**
 * Interface for the health tab state
 */
export interface HealthTabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dogId: string;
  isLoading: boolean;
  error: Error | null;
  healthRecords: HealthRecord[];
  weightRecords: WeightRecord[];
  vaccinationRecords: HealthRecord[];
  examinationRecords: HealthRecord[];
  medicationRecords: HealthRecord[];
  refreshHealthRecords: () => Promise<void>;
  refreshWeightRecords: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

/**
 * Custom hook to manage the health tab state
 * 
 * @param {string} dogId The ID of the dog
 * @returns {HealthTabState} The health tab state
 */
export const useHealthTabState = (dogId: string): HealthTabState => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  // Use our standardized hooks
  const healthRecordsData = useHealthRecordsData(dogId);
  const { 
    weightRecords, 
    isLoading: isLoadingWeights, 
    error: weightError,
    fetchWeightHistory 
  } = useWeightRecords({ dogId });
  
  const isLoading = healthRecordsData.isLoading || isLoadingWeights;
  const error = healthRecordsData.error || weightError;
  
  // Function to refresh all data
  const refreshAllData = async (): Promise<void> => {
    await Promise.all([
      healthRecordsData.refreshHealthRecords(),
      fetchWeightHistory()
    ]);
  };

  return {
    activeTab,
    setActiveTab,
    dogId,
    isLoading,
    error,
    healthRecords: healthRecordsData.healthRecords,
    weightRecords,
    vaccinationRecords: healthRecordsData.vaccinationRecords,
    examinationRecords: healthRecordsData.examinationRecords,
    medicationRecords: healthRecordsData.medicationRecords,
    refreshHealthRecords: healthRecordsData.refreshHealthRecords,
    refreshWeightRecords: fetchWeightHistory,
    refreshAllData
  };
};
