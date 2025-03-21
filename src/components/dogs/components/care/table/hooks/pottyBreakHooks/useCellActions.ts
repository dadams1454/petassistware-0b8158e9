
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { addCareLog, deleteCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';
import { fetchFeedingLogsByDate } from '@/services/dailyCare/careLogsService';

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
  
  // Debounce timer references
  const debounceTimerRef = useRef<number | null>(null);
  const feedingLogsCache = useRef<Record<string, string>>({});
  
  // Handler for cell clicks
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) return;
    
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (category === 'pottybreaks') {
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
          // Add a new potty break and update UI state
          await logDogPottyBreak(dogId, timeSlot);
          
          // Update local state for immediate UI update
          const updatedPottyBreaks = { ...pottyBreaks };
          if (!updatedPottyBreaks[dogId]) {
            updatedPottyBreaks[dogId] = [];
          }
          
          if (!updatedPottyBreaks[dogId].includes(timeSlot)) {
            updatedPottyBreaks[dogId] = [...updatedPottyBreaks[dogId], timeSlot];
          }
          
          setPottyBreaks(updatedPottyBreaks);
          
          toast({
            title: 'Potty break logged',
            description: `${dogName} was taken out at ${timeSlot}`,
          });
        }
      } else if (category === 'feeding') {
        // First check if the dog has already been fed at this time
        // Fetch current feeding logs if cache is empty
        if (Object.keys(feedingLogsCache.current).length === 0) {
          const feedingLogs = await fetchFeedingLogsByDate(currentDate);
          
          // Build a cache of feeding logs with keys like 'dogId-timeSlot'
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
        }
        
        const cacheKey = `${dogId}-${timeSlot}`;
        const existingLogId = feedingLogsCache.current[cacheKey];
        
        if (existingLogId) {
          // If there's an existing log, delete it
          const success = await deleteCareLog(existingLogId);
          
          if (success) {
            // Remove from the cache
            delete feedingLogsCache.current[cacheKey];
            
            toast({
              title: 'Feeding record removed',
              description: `Removed ${timeSlot.toLowerCase()} feeding record for ${dogName}`,
            });
          } else {
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
          
          const newLog = await addCareLog({
            dog_id: dogId,
            category: 'feeding',
            task_name: mealName,
            timestamp: timestamp,
            notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
          }, user?.id || '');
          
          if (newLog) {
            // Add to the cache
            feedingLogsCache.current[cacheKey] = newLog.id;
            
            toast({
              title: 'Feeding logged',
              description: `${dogName} was fed at ${timeSlot.toLowerCase()}`,
            });
          }
        }
      }
      
      // Schedule a refresh after a brief delay to limit API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        if (onRefresh) {
          onRefresh();
        }
        debounceTimerRef.current = null;
      }, 1000);
      
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
      toast({
        title: `Error logging ${category}`,
        description: `Could not log ${category} for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pottyBreaks, setPottyBreaks, activeCategory, currentDate, user, toast, onRefresh]);
  
  return {
    isLoading,
    handleCellClick
  };
};
