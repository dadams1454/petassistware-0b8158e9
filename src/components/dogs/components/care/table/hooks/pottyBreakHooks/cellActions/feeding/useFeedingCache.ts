
import { useRef, useCallback } from 'react';
import { fetchFeedingLogsByDate } from '@/services/dailyCare/careLogsService';

// Constants
export const FEEDING_CACHE_TTL = 30000; // 30 seconds cache time-to-live

export interface UseFeedingCacheProps {
  currentDate: Date;
}

export const useFeedingCache = ({ currentDate }: UseFeedingCacheProps) => {
  // Feeding logs cache management
  const feedingLogsCache = useRef<Record<string, string>>({});
  const lastFeedingRefreshRef = useRef<number>(0);
  
  // Helper function to refresh feeding logs cache
  const refreshFeedingLogsCache = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    
    // Skip refresh if it's been less than FEEDING_CACHE_TTL milliseconds since last refresh
    // unless force=true is passed
    if (!force && now - lastFeedingRefreshRef.current < FEEDING_CACHE_TTL) {
      console.log('⏳ Skipping feeding cache refresh - recently refreshed');
      return feedingLogsCache.current;
    }
    
    console.log('🔄 Refreshing feeding logs cache...');
    try {
      const feedingLogs = await fetchFeedingLogsByDate(currentDate);
      
      // Clear the existing cache
      feedingLogsCache.current = {};
      
      // Build a new cache of feeding logs with keys like 'dogId-timeSlot'
      feedingLogs.forEach(log => {
        const logTime = new Date(log.timestamp);
        const logHour = logTime.getHours();
        let mealTime = '';
        
        if (logHour >= 5 && logHour < 10) mealTime = 'Morning';
        else if (logHour >= 10 && logHour < 15) mealTime = 'Noon';
        else mealTime = 'Evening';
        
        // Store the log ID in the cache for deletion if needed
        const cacheKey = `${log.dog_id}-${mealTime}`;
        feedingLogsCache.current[cacheKey] = log.id;
      });
      
      lastFeedingRefreshRef.current = now;
      
      console.log(`✅ Feeding cache refreshed with ${feedingLogs.length} logs`);
      return feedingLogsCache.current;
    } catch (error) {
      console.error('❌ Error refreshing feeding logs cache:', error);
      return feedingLogsCache.current;
    }
  }, [currentDate]);
  
  // Reset cache (e.g., when component unmounts or tab changes)
  const resetCache = useCallback(() => {
    console.log('🧹 Resetting feeding logs cache');
    feedingLogsCache.current = {};
    lastFeedingRefreshRef.current = 0;
  }, []);
  
  return {
    feedingLogsCache,
    refreshFeedingLogsCache,
    resetCache
  };
};
