
import { useState } from 'react';
import { useHealthRecordsData } from './useHealthRecordsData';
import { useWeightRecordsData } from './useWeightRecordsData';
import { HealthRecord, WeightRecord } from '@/types/health';
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
  const weightRecordsData = useWeightRecordsData(dogId);
  
  const isLoading = loading || healthRecordsData.isLoading || weightRecordsData.isLoading;
  const error = healthRecordsData.error || weightRecordsData.error;
  
  const refreshAllData = async (): Promise<void> => {
    await withLoading(async () => {
      await Promise.all([
        healthRecordsData.refreshHealthRecords(),
        weightRecordsData.refreshWeightRecords()
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
    weightRecords: weightRecordsData.weightRecords,
    vaccinationRecords: healthRecordsData.vaccinationRecords,
    examinationRecords: healthRecordsData.examinationRecords,
    medicationRecords: healthRecordsData.medicationRecords,
    refreshHealthRecords: healthRecordsData.refreshHealthRecords,
    refreshWeightRecords: weightRecordsData.refreshWeightRecords,
    refreshAllData
  };
};
