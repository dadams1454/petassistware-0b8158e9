
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
    console.log('Adding care log with cache clear...');
    const newLog = await careLogs.addCareLog(data);
    if (newLog) {
      console.log('Care log added successfully, clearing cache and refreshing');
      // Clear cache to force refresh on next fetch
      dogCareStatus.clearCache();
      // Re-fetch to update the UI immediately with force refresh
      await dogCareStatus.fetchAllDogsWithCareStatus(new Date(), true);
    }
    return newLog;
  }, [careLogs, dogCareStatus]);

  // Enhanced fetchAllDogsWithCareStatus with better logging
  const fetchWithEnhancedLogging = useCallback(async (date = new Date(), forceRefresh = false): Promise<DogCareStatus[]> => {
    console.log(`🔍 Enhanced fetch called with: date=${date.toISOString().slice(0, 10)}, forceRefresh=${forceRefresh}`);
    
    try {
      const dogs = await dogCareStatus.fetchAllDogsWithCareStatus(date, forceRefresh);
      console.log(`✅ Enhanced fetch successful: retrieved ${dogs.length} dogs`);
      
      if (dogs.length > 0) {
        console.log('🐕 Sample dog names:', dogs.slice(0, 3).map(d => d.dog_name).join(', '));
      } else {
        console.warn('⚠️ No dogs returned from fetchAllDogsWithCareStatus');
      }
      
      return dogs;
    } catch (error) {
      console.error('❌ Enhanced fetch failed:', error);
      throw error; // Re-throw to allow component-level error handling
    }
  }, [dogCareStatus]);

  // Function to fetch recent care logs by category
  const fetchRecentCareLogsByCategory = useCallback(async (
    dogId: string, 
    category: string, 
    limit: number = 5
  ): Promise<DailyCarelog[]> => {
    return withLoading(async () => {
      try {
        return await careLogs.fetchDogCareLogsByCategory(dogId, category, limit);
      } catch (error) {
        console.error(`Error fetching recent ${category} logs:`, error);
        return [];
      }
    });
  }, [careLogs, withLoading]);

  return {
    loading: isLoading,
    // Re-export all methods from specialized hooks
    fetchDogCareLogs: careLogs.fetchDogCareLogs,
    fetchCareTaskPresets: careTaskPresets.fetchCareTaskPresets,
    fetchAllDogsWithCareStatus: fetchWithEnhancedLogging,
    dogStatuses: dogCareStatus.dogStatuses, // Expose dog statuses directly
    // Override addCareLog to include cache clearing
    addCareLog: addCareLogWithCacheClear,
    deleteCareLog: careLogs.deleteCareLog,
    addCareTaskPreset: careTaskPresets.addCareTaskPreset,
    deleteCareTaskPreset: careTaskPresets.deleteCareTaskPreset,
    // Add new function to fetch logs by category
    fetchRecentCareLogsByCategory,
  };
};
