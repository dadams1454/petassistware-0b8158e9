
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addCareLog, deleteCareLog, fetchFeedingLogsByDate } from '@/services/dailyCare/careLogsService';

interface UseFeedingCellActionsProps {
  currentDate: Date;
  onRefresh?: () => void;
}

export const useFeedingCellActions = ({ currentDate, onRefresh }: UseFeedingCellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Local state for optimistic UI updates
  const [activeFeedings, setActiveFeedings] = useState<Record<string, boolean>>({});
  
  // Feeding logs cache management
  const feedingLogsCache = useRef<Record<string, string>>({});
  const lastFeedingRefreshRef = useRef<number>(0);
  const FEEDING_CACHE_TTL = 30000; // 30 seconds cache time-to-live
  const pendingOperationsRef = useRef<Map<string, Promise<any>>>(new Map());
  
  // Create a debounced refresh function
  const refreshDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerDebouncedRefresh = useCallback(() => {
    if (refreshDebounceTimeoutRef.current) {
      clearTimeout(refreshDebounceTimeoutRef.current);
    }
    
    refreshDebounceTimeoutRef.current = setTimeout(() => {
      if (onRefresh) {
        console.log('🔄 Executing debounced feeding refresh');
        onRefresh();
      }
      refreshDebounceTimeoutRef.current = null;
    }, 1000); // 1 second debounce
  }, [onRefresh]);
  
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
        
        // Also update the active feedings state for UI consistency
        setActiveFeedings(prev => ({
          ...prev,
          [cacheKey]: true
        }));
      });
      
      lastFeedingRefreshRef.current = now;
      
      console.log(`✅ Feeding cache refreshed with ${feedingLogs.length} logs`);
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
    // Create a unique key for this cell
    const cacheKey = `${dogId}-${timeSlot}`;
    
    // Skip if we have a pending operation for this cell
    if (pendingOperationsRef.current.has(cacheKey)) {
      console.log('🔄 Operation already in progress for this cell, skipping');
      return;
    }
    
    // Check if cell is currently active in our local state
    const isCurrentlyActive = activeFeedings[cacheKey];
    
    // Optimistically update UI immediately
    setActiveFeedings(prev => ({
      ...prev, 
      [cacheKey]: !isCurrentlyActive
    }));
    
    // Create operation function
    const performOperation = async () => {
      try {
        if (isCurrentlyActive) {
          // If there's an existing log, delete it
          const existingLogId = feedingLogsCache.current[cacheKey];
          
          if (existingLogId) {
            console.log(`🗑️ Deleting feeding log: ${existingLogId}`);
            const success = await deleteCareLog(existingLogId);
            
            if (success) {
              // Remove from the cache
              delete feedingLogsCache.current[cacheKey];
              
              toast({
                title: 'Feeding record removed',
                description: `Removed ${timeSlot.toLowerCase()} feeding record for ${dogName}`,
              });
            } else {
              // Revert optimistic update if API call fails
              console.error(`❌ Failed to delete feeding log: ${existingLogId}`);
              setActiveFeedings(prev => ({
                ...prev,
                [cacheKey]: true
              }));
              
              toast({
                title: 'Error removing feeding',
                description: 'Could not remove the feeding record. Please try again.',
                variant: 'destructive',
              });
            }
          }
        } else {
          // Add new feeding record
          const timestamp = new Date();
          const mealName = `${timeSlot} Feeding`;
          
          const newLog = await addCareLog({
            dog_id: dogId,
            category: 'feeding',
            task_name: mealName,
            timestamp: timestamp,
            notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
          }, userId || '');
          
          if (newLog) {
            // Add to the cache
            feedingLogsCache.current[cacheKey] = newLog.id;
            
            toast({
              title: 'Feeding logged',
              description: `${dogName} was fed at ${timeSlot.toLowerCase()}`,
            });
          } else {
            // Revert optimistic update if API call fails
            console.error(`❌ Failed to add feeding log for ${dogName}`);
            setActiveFeedings(prev => ({
              ...prev,
              [cacheKey]: false
            }));
            
            toast({
              title: 'Error logging feeding',
              description: 'Could not log feeding. Please try again.',
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error(`Error handling feeding cell click:`, error);
        
        // Revert optimistic update on error
        setActiveFeedings(prev => ({
          ...prev, 
          [cacheKey]: isCurrentlyActive
        }));
        
        toast({
          title: `Error updating feeding record`,
          description: `Could not update feeding for ${dogName}. Please try again.`,
          variant: 'destructive',
        });
      } finally {
        // Remove from pending operations
        pendingOperationsRef.current.delete(cacheKey);
        
        // Trigger a debounced refresh after operation completes
        triggerDebouncedRefresh();
      }
    };
    
    // Track this operation
    const operation = performOperation();
    pendingOperationsRef.current.set(cacheKey, operation);
    
    // No need to await - let it run in background
    // The UI is already updated optimistically
  }, [activeFeedings, feedingLogsCache, toast, triggerDebouncedRefresh]);
  
  // Reset cache (e.g., when component unmounts or tab changes)
  const resetCache = useCallback(() => {
    console.log('🧹 Resetting feeding logs cache');
    feedingLogsCache.current = {};
    lastFeedingRefreshRef.current = 0;
    setActiveFeedings({});
  }, []);
  
  // Check if a cell is active (for UI purposes)
  const isCellActive = useCallback((dogId: string, timeSlot: string) => {
    const cacheKey = `${dogId}-${timeSlot}`;
    return !!activeFeedings[cacheKey];
  }, [activeFeedings]);
  
  // Initialize active feedings from cache on mount
  useEffect(() => {
    const initializeActiveFeedings = async () => {
      await refreshFeedingLogsCache(true);
      
      // Convert cache to active feedings state
      const initialActiveFeedings: Record<string, boolean> = {};
      Object.keys(feedingLogsCache.current).forEach(key => {
        initialActiveFeedings[key] = true;
      });
      
      setActiveFeedings(initialActiveFeedings);
    };
    
    initializeActiveFeedings();
  }, [refreshFeedingLogsCache]);
  
  return {
    isLoading,
    handleFeedingCellClick,
    refreshFeedingLogsCache,
    resetCache,
    isCellActive
  };
};
