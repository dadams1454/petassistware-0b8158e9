
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DailyCarelog, CareTaskPreset, CareLogFormData, DogCareStatus } from '@/types/dailyCare';
import { useCareLogs } from './hooks/useCareLogs';
import { useCareTaskPresets } from './hooks/useCareTaskPresets';
import { useDogCareStatus } from './hooks/useDogCareStatus';

export const useDailyCareActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  
  // Initialize the specialized hooks
  const careLogs = useCareLogs(userId);
  const careTaskPresets = useCareTaskPresets(userId);
  const dogCareStatus = useDogCareStatus();
  
  // Combine loading states
  const isLoading = careLogs.loading || careTaskPresets.loading || dogCareStatus.loading || loading;
  
  // Set common loading handler for operations performed in this hook
  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  // Special handler for adding care log that clears the cache
  const addCareLogWithCacheClear = useCallback(async (data: CareLogFormData): Promise<DailyCarelog | null> => {
    const newLog = await careLogs.addCareLog(data);
    if (newLog) {
      // Clear cache to force refresh on next fetch
      dogCareStatus.clearCache();
    }
    return newLog;
  }, [careLogs, dogCareStatus]);

  return {
    loading: isLoading,
    // Re-export all methods from specialized hooks
    fetchDogCareLogs: careLogs.fetchDogCareLogs,
    fetchCareTaskPresets: careTaskPresets.fetchCareTaskPresets,
    fetchAllDogsWithCareStatus: dogCareStatus.fetchAllDogsWithCareStatus,
    // Override addCareLog to include cache clearing
    addCareLog: addCareLogWithCacheClear,
    deleteCareLog: careLogs.deleteCareLog,
    addCareTaskPreset: careTaskPresets.addCareTaskPreset,
    deleteCareTaskPreset: careTaskPresets.deleteCareTaskPreset,
  };
};
