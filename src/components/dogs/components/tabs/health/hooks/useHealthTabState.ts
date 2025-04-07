
import { useState } from 'react';
import { useHealthRecordsData } from './useHealthRecordsData';
import { useWeightRecordsData } from './useWeightRecordsData';

export const useHealthTabState = (dogId: string) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  const healthRecordsData = useHealthRecordsData(dogId);
  const weightRecordsData = useWeightRecordsData(dogId);
  
  const isLoading = healthRecordsData.isLoading || weightRecordsData.isLoading;
  
  const refreshAllData = async () => {
    await Promise.all([
      healthRecordsData.refreshHealthRecords(),
      weightRecordsData.refreshWeightRecords()
    ]);
  };

  return {
    activeTab,
    setActiveTab,
    dogId,
    isLoading,
    error: healthRecordsData.error || weightRecordsData.error,
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
