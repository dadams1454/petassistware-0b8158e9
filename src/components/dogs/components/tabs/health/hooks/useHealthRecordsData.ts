
/**
 * Hook for fetching health records specific to the health tab context
 */
import { useHealthRecords } from '@/modules/health';
import { HealthRecord } from '@/types/health';

/**
 * Custom hook to fetch health records for a specific dog
 * 
 * @param {string} dogId The ID of the dog to fetch health records for
 * @returns {Object} The health records data and operations
 */
export const useHealthRecordsData = (dogId: string) => {
  const {
    healthRecords = [],
    isLoading,
    error,
    refreshHealthRecords,
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    surgeryRecords,
    otherRecords,
  } = useHealthRecords({ dogId });

  return {
    healthRecords,
    isLoading,
    error,
    refreshHealthRecords,
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    surgeryRecords,
    otherRecords,
  };
};
