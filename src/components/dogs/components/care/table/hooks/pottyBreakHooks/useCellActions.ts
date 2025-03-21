
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { addCareLog, deleteCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';
import { useDailyCare } from '@/contexts/dailyCare';

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
  const { deleteCareLog: contextDeleteCareLog } = useDailyCare();
  
  // State to track feeding logs for each dog & time slot
  const [feedingLogs, setFeedingLogs] = useState<Record<string, string>>({});
  
  // Debounce timer references
  const debounceTimerRef = useRef<number | null>(null);
  
  // Get start of day for date calculations
  const getStartOfDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  
  // Check if it's a new day since the app was last used
  const isNewDay = () => {
    const lastUsed = localStorage.getItem('lastFeedingCheckDate');
    if (!lastUsed) return true;
    
    const lastUsedDate = new Date(lastUsed);
    const today = getStartOfDay();
    
    // Return true if the stored date is from a previous day
    return lastUsedDate.getTime() < today.getTime();
  };
  
  // Reset feeding logs at midnight
  const checkAndResetFeedingLogs = useCallback(() => {
    if (isNewDay()) {
      console.log('New day detected, resetting feeding logs');
      setFeedingLogs({});
      localStorage.setItem('lastFeedingCheckDate', new Date().toISOString());
    }
  }, []);
  
  // Run check when component mounts and when active category changes
  useEffect(() => {
    if (activeCategory === 'feeding') {
      checkAndResetFeedingLogs();
    }
  }, [activeCategory, checkAndResetFeedingLogs]);
  
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
        // Handle feeding log action with named times (Morning, Noon, Evening)
        const timestamp = new Date();
        const cellKey = `${dogId}-${timeSlot}`;
        const existingLogId = feedingLogs[cellKey];
        
        // Set appropriate hours based on meal time
        if (timeSlot === "Morning") {
          timestamp.setHours(7, 0, 0, 0);  // 7:00 AM
        } else if (timeSlot === "Noon") {
          timestamp.setHours(12, 0, 0, 0); // 12:00 PM
        } else if (timeSlot === "Evening") {
          timestamp.setHours(18, 0, 0, 0); // 6:00 PM
        }
        
        // Map meal names based on time slot
        const mealName = `${timeSlot} Feeding`;
        
        if (existingLogId) {
          // Delete the existing log
          const success = await contextDeleteCareLog(existingLogId);
          
          if (success) {
            // Remove from local state
            const updatedFeedingLogs = { ...feedingLogs };
            delete updatedFeedingLogs[cellKey];
            setFeedingLogs(updatedFeedingLogs);
            
            toast({
              title: 'Feeding log removed',
              description: `Removed ${timeSlot.toLowerCase()} feeding record for ${dogName}`,
            });
          }
        } else {
          // Add a new feeding log
          const newLog = await addCareLog({
            dog_id: dogId,
            category: 'feeding',
            task_name: mealName,
            timestamp: timestamp,
            notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
          }, user?.id || '');
          
          if (newLog) {
            // Store the log ID so we can delete it later if needed
            setFeedingLogs(prev => ({
              ...prev,
              [cellKey]: newLog.id
            }));
            
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
  }, [isLoading, pottyBreaks, setPottyBreaks, activeCategory, user, toast, onRefresh, feedingLogs, contextDeleteCareLog]);
  
  return {
    isLoading,
    handleCellClick,
    feedingLogs
  };
};

