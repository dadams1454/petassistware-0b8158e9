
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { addCareLog, deleteCareLog, fetchFeedingLogsByDate } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';

export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Debounce timer reference
  const debounceTimerRef = useRef<number | null>(null);
  const feedingLogsCache = useRef<Record<string, string>>({});
  const lastFeedingRefreshRef = useRef<number>(0);
  const FEEDING_CACHE_TTL = 10000; // 10 seconds cache time-to-live
  
  // Track active operations to prevent duplicate clicks
  const activeOperationsRef = useRef<Set<string>>(new Set());
  
  // Clear cache when category changes or date changes
  useEffect(() => {
    console.log(`🔄 Category changed to ${activeCategory} or date changed - clearing feeding logs cache`);
    feedingLogsCache.current = {};
    lastFeedingRefreshRef.current = 0;
    activeOperationsRef.current.clear();
  }, [activeCategory, currentDate]);
  
  // Helper function to refresh feeding logs cache with better error handling
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
    } catch (error) {
      console.error('❌ Error refreshing feeding logs cache:', error);
      toast({
        title: "Error loading feeding data",
        description: "Could not refresh feeding records. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentDate, toast]);
  
  // Handler for cell clicks
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Create operation key to track this specific operation
    const operationKey = `${category}-${dogId}-${timeSlot}`;
    
    // Skip if already loading or this operation is in progress
    if (isLoading || activeOperationsRef.current.has(operationKey)) {
      console.log(`🔄 Cell click ignored - operation "${operationKey}" already in progress`);
      return;
    }
    
    // Check if category matches what we're handling
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    // Mark operation as active
    activeOperationsRef.current.add(operationKey);
    console.log(`🖱️ Cell clicked: ${dogName} (${dogId}) - ${timeSlot} - ${category}`);
    
    try {
      setIsLoading(true);
      
      if (category === 'pottybreaks') {
        // Handle potty break logging
        handlePottyBreak(dogId, dogName, timeSlot);
      } else if (category === 'feeding') {
        // Handle feeding log toggle
        await handleFeeding(dogId, dogName, timeSlot);
      }
      
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
      toast({
        title: `Error logging ${category}`,
        description: `Could not log ${category} for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      
      // Remove from active operations
      activeOperationsRef.current.delete(operationKey);
      
      // Schedule a refresh after a brief delay to limit API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        if (onRefresh) {
          console.log('🔄 Executing debounced refresh');
          onRefresh();
        }
        debounceTimerRef.current = null;
      }, 1000);
    }
  }, [isLoading, activeCategory, pottyBreaks, setPottyBreaks, onRefresh, refreshFeedingLogsCache, toast]);
  
  // Split into separate functions for better organization
  const handlePottyBreak = useCallback((dogId: string, dogName: string, timeSlot: string) => {
    // Check if this dog already has a potty break at this time
    const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
    if (hasPottyBreak) {
      // Remove the potty break from UI state
      const updatedDogBreaks = pottyBreaks[dogId].filter(slot => slot !== timeSlot);
      const updatedPottyBreaks = { ...pottyBreaks };
      
      if (updatedDogBreaks.length === 0) {
        delete updatedPottyBreaks[dogId];
      } else {
        updatedPottyBreaks[dogId] = updatedDogBreaks;
      }
      
      setPottyBreaks(updatedPottyBreaks);
      
      toast({
        title: 'Potty break removed',
        description: `Removed potty break for ${dogName} at ${timeSlot}`,
      });
    } else {
      // Add a new potty break and update UI state immediately for responsiveness
      const updatedPottyBreaks = { ...pottyBreaks };
      if (!updatedPottyBreaks[dogId]) {
        updatedPottyBreaks[dogId] = [];
      }
      
      if (!updatedPottyBreaks[dogId].includes(timeSlot)) {
        updatedPottyBreaks[dogId] = [...updatedPottyBreaks[dogId], timeSlot];
      }
      
      setPottyBreaks(updatedPottyBreaks);
      
      // Now save to database (fire and forget)
      logDogPottyBreak(dogId, timeSlot)
        .catch(error => {
          console.error('Error logging potty break:', error);
          // Revert UI state if saving fails
          const revertedBreaks = { ...updatedPottyBreaks };
          if (revertedBreaks[dogId]) {
            revertedBreaks[dogId] = revertedBreaks[dogId].filter(t => t !== timeSlot);
            if (revertedBreaks[dogId].length === 0) {
              delete revertedBreaks[dogId];
            }
            setPottyBreaks(revertedBreaks);
          }
          
          toast({
            title: 'Error saving potty break',
            description: 'The potty break could not be saved. Please try again.',
            variant: 'destructive'
          });
        });
      
      toast({
        title: 'Potty break logged',
        description: `${dogName} was taken out at ${timeSlot}`,
      });
    }
  }, [pottyBreaks, setPottyBreaks, toast]);
  
  const handleFeeding = useCallback(async (dogId: string, dogName: string, timeSlot: string) => {
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
      // Set appropriate hours based on meal time
      const timestamp = new Date(currentDate);
      
      if (timeSlot === "Morning") {
        timestamp.setHours(7, 0, 0, 0);  // 7:00 AM
      } else if (timeSlot === "Noon") {
        timestamp.setHours(12, 0, 0, 0); // 12:00 PM
      } else if (timeSlot === "Evening") {
        timestamp.setHours(18, 0, 0, 0); // 6:00 PM
      }
      
      // Map meal names based on time slot
      const mealName = `${timeSlot} Feeding`;
      
      console.log(`🍽️ Adding new feeding log: ${dogName} - ${mealName} at ${timestamp.toISOString()}`);
      
      if (!user || !user.id) {
        console.error('No user ID available for adding care log');
        toast({
          title: 'Error logging feeding',
          description: 'User authentication required. Please log in again.',
          variant: 'destructive',
        });
        return;
      }
      
      const newLog = await addCareLog({
        dog_id: dogId,
        category: 'feeding',
        task_name: mealName,
        timestamp: timestamp,
        notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
      }, user.id);
      
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
        toast({
          title: 'Error logging feeding',
          description: 'Could not log feeding. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [currentDate, user, refreshFeedingLogsCache, onRefresh, toast]);
  
  // Initialize cache when the hook is mounted
  useEffect(() => {
    if (activeCategory === 'feeding') {
      refreshFeedingLogsCache();
    }
  }, [activeCategory, refreshFeedingLogsCache]);
  
  return {
    isLoading,
    handleCellClick,
    refreshCache: refreshFeedingLogsCache
  };
};
