
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addCareLog, deleteCareLog, fetchFeedingLogsByDate } from '@/services/dailyCare/careLogsService';

interface UseFeedingCellActionsProps {
  currentDate: Date;
  onRefresh?: () => void;
}

export const useFeedingCellActions = ({ currentDate, onRefresh }: UseFeedingCellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Feeding logs cache management
  const feedingLogsCache = useRef<Record<string, string>>({});
  const lastFeedingRefreshRef = useRef<number>(0);
  const FEEDING_CACHE_TTL = 10000; // 10 seconds cache time-to-live
  
  // Helper function to refresh feeding logs cache
  const refreshFeedingLogsCache = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    
    // Skip refresh if it's been less than FEEDING_CACHE_TTL milliseconds since last refresh
    // unless force=true is passed
    if (!force && now - lastFeedingRefreshRef.current < FEEDING_CACHE_TTL) {
      console.log('⏳ Skipping feeding cache refresh - recently refreshed');
      return;
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
        console.log(`📝 Cached feeding log: ${cacheKey} -> ${log.id}`);
      });
      
      lastFeedingRefreshRef.current = now;
      
      console.log(`✅ Feeding cache refreshed with ${feedingLogs.length} logs`);
      console.log('Current cache:', feedingLogsCache.current);
    } catch (error) {
      console.error('❌ Error refreshing feeding logs cache:', error);
    }
  }, [currentDate]);
  
  // Handle feeding cell clicks
  const handleFeedingCellClick = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    userId?: string
  ) => {
    if (isLoading) {
      console.log('🔄 Cell click ignored - loading in progress');
      return;
    }
    
    console.log(`🍽️ Feeding cell clicked: ${dogName} (${dogId}) - ${timeSlot}`);
    
    try {
      setIsLoading(true);
      
      // Refresh the cache first to ensure we have up-to-date data
      await refreshFeedingLogsCache(true);
      
      const cacheKey = `${dogId}-${timeSlot}`;
      const existingLogId = feedingLogsCache.current[cacheKey];
      
      console.log(`🍽️ Feeding cell clicked: ${cacheKey}, existingLogId: ${existingLogId}`);
      
      if (existingLogId) {
        // If there's an existing log, delete it
        console.log(`🗑️ Attempting to delete feeding log: ${existingLogId}`);
        const success = await deleteCareLog(existingLogId);
        
        if (success) {
          // Remove from the cache immediately
          console.log(`✅ Successfully deleted feeding log: ${existingLogId}`);
          delete feedingLogsCache.current[cacheKey];
          
          toast({
            title: 'Feeding record removed',
            description: `Removed ${timeSlot.toLowerCase()} feeding record for ${dogName}`,
          });
          
          // Force a refresh to update UI immediately
          if (onRefresh) {
            console.log('🔄 Forcing refresh after feeding log deletion');
            onRefresh();
          }
        } else {
          console.error(`❌ Failed to delete feeding log: ${existingLogId}`);
          toast({
            title: 'Error removing feeding',
            description: 'Could not remove the feeding record. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        // Always use current timestamp for the actual log time
        const timestamp = new Date();
        
        // Map meal names based on time slot
        const mealName = `${timeSlot} Feeding`;
        
        console.log(`🍽️ Adding new feeding log: ${dogName} - ${mealName} at ${timestamp.toISOString()}`);
        
        const newLog = await addCareLog({
          dog_id: dogId,
          category: 'feeding',
          task_name: mealName,
          timestamp: timestamp,
          notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
        }, userId || '');
        
        if (newLog) {
          // Add to the cache immediately
          console.log(`✅ Successfully added feeding log: ${newLog.id}`);
          feedingLogsCache.current[cacheKey] = newLog.id;
          
          toast({
            title: 'Feeding logged',
            description: `${dogName} was fed at ${timeSlot.toLowerCase()}`,
          });
          
          // Force a refresh to update UI
          if (onRefresh) {
            console.log('🔄 Forcing refresh after adding feeding log');
            onRefresh();
          }
        } else {
          console.error(`❌ Failed to add feeding log for ${dogName}`);
        }
      }
      
      // Always refresh the cache after a feeding operation
      setTimeout(() => {
        refreshFeedingLogsCache(true);
      }, 500);
      
    } catch (error) {
      console.error(`Error handling feeding cell click:`, error);
      toast({
        title: `Error logging feeding`,
        description: `Could not log feeding for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, refreshFeedingLogsCache, toast, onRefresh]);
  
  // Reset cache (e.g., when component unmounts or tab changes)
  const resetCache = useCallback(() => {
    console.log('🧹 Resetting feeding logs cache');
    feedingLogsCache.current = {};
    lastFeedingRefreshRef.current = 0;
  }, []);
  
  return {
    isLoading,
    handleFeedingCellClick,
    refreshFeedingLogsCache,
    resetCache
  };
};
