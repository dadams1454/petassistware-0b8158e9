
/**
 * Hook for fetching and processing weight data
 */
import { useCallback, useMemo } from 'react';
import { useWeightRecords } from './useWeightRecords';
import { useWeightStats } from './useWeightStats';
import { WeightRecord } from '../types';
import { WeightUnit } from '@/types/weight-units';

interface UseWeightDataOptions {
  dogId?: string;
  puppyId?: string;
  preferredUnit?: WeightUnit;
}

/**
 * Hook to fetch and process weight data
 * 
 * @param options Options for filtering and processing weight data
 * @returns Weight data, statistics, and operations
 */
export const useWeightData = (options: UseWeightDataOptions = {}) => {
  const { dogId, puppyId, preferredUnit } = options;
  
  // Fetch weight records
  const {
    weightRecords,
    isLoading,
    error,
    fetchWeightHistory,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    isAdding,
    isUpdating,
    isDeleting
  } = useWeightRecords({ dogId, puppyId });
  
  // Calculate statistics
  const growthStats = useWeightStats(weightRecords, preferredUnit);
  
  // Sort records by date (most recent first)
  const sortedRecords = useMemo(() => {
    return [...weightRecords].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [weightRecords]);
  
  // Get the latest weight record
  const latestWeight = useMemo(() => {
    return sortedRecords.length > 0 ? sortedRecords[0] : null;
  }, [sortedRecords]);
  
  // Function to add a new weight record with age calculation
  const addWeightWithAge = useCallback(
    async (data: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change' | 'age_days'>) => {
      // Calculate age in days if birth_date is provided
      let ageInDays: number | undefined;
      
      if (data.birth_date) {
        const birthDate = new Date(data.birth_date);
        const recordDate = new Date(data.date);
        ageInDays = Math.floor((recordDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      return addWeightRecord({
        ...data,
        age_days: ageInDays
      });
    },
    [addWeightRecord]
  );
  
  return {
    weightRecords,
    sortedRecords,
    latestWeight,
    growthStats,
    isLoading,
    error,
    fetchWeightHistory,
    addWeightRecord: addWeightWithAge,
    updateWeightRecord,
    deleteWeightRecord,
    isAdding,
    isUpdating,
    isDeleting
  };
};
