
import { useState } from 'react';
import { useHealthRecordsData } from './useHealthRecordsData';
import { useWeightData } from '@/modules/weight/hooks/useWeightData';
import { HealthRecord } from '@/types/health';
import { WeightRecord } from '@/types/weight';
import { UseLoadingResult, useLoading } from '@/contexts/dailyCare/hooks/useLoading';

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
  const { loading, withLoading } = useLoading();
  
  const healthRecordsData = useHealthRecordsData(dogId);
  const weightData = useWeightData({ dogId });
  
  const isLoading = loading || healthRecordsData.isLoading || weightData.isLoading;
  const error = healthRecordsData.error || weightData.error;
  
  // Function to refresh all data
  const refreshAllData = async (): Promise<void> => {
    await withLoading(async () => {
      await Promise.all([
        healthRecordsData.refreshHealthRecords(),
        weightData.fetchWeightHistory()
      ]);
    });
  };

  return {
    activeTab,
    setActiveTab,
    dogId,
    isLoading,
    error,
    healthRecords: healthRecordsData.healthRecords,
    weightRecords: weightData.weightRecords,
    vaccinationRecords: healthRecordsData.vaccinationRecords,
    examinationRecords: healthRecordsData.examinationRecords,
    medicationRecords: healthRecordsData.medicationRecords,
    refreshHealthRecords: healthRecordsData.refreshHealthRecords,
    refreshWeightRecords: weightData.fetchWeightHistory,
    refreshAllData
  };
};
