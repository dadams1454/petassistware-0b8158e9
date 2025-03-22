
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';
import { useDailyCare } from '@/contexts/dailyCare';

export const useFeedingActions = (
  activeCategory: string = 'feeding',
  onRefresh?: () => void
) => {
  const [feedingLogs, setFeedingLogs] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const { deleteCareLog: contextDeleteCareLog } = useDailyCare();
  
  // Get start of day for date calculations
  const getStartOfDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  
  // Check if it's a new day since the app was last used
  const isNewDay = useCallback(() => {
    const lastUsed = localStorage.getItem('lastFeedingCheckDate');
    if (!lastUsed) return true;
    
    const lastUsedDate = new Date(lastUsed);
    const today = getStartOfDay();
    
    // Return true if the stored date is from a previous day
    return lastUsedDate.getTime() < today.getTime();
  }, []);
  
  // Reset feeding logs at midnight or when switching to the feeding category
  const checkAndResetFeedingLogs = useCallback(() => {
    if (isNewDay()) {
      console.log('New day detected, resetting feeding logs');
      setFeedingLogs({});
      localStorage.setItem('lastFeedingCheckDate', new Date().toISOString());
    }
  }, [isNewDay]);
  
  // Run check when component mounts and when active category changes
  useEffect(() => {
    if (activeCategory === 'feeding') {
      console.log('Checking if feeding logs need to be reset');
      checkAndResetFeedingLogs();
    }
  }, [activeCategory, checkAndResetFeedingLogs]);
  
  // Manual reset function
  const resetFeedingLogs = useCallback(() => {
    console.log('Manually resetting feeding logs');
    setFeedingLogs({});
    localStorage.setItem('lastFeedingCheckDate', new Date().toISOString());
    if (onRefresh) {
      onRefresh();
    }
    
    toast({
      title: 'Feeding logs reset',
      description: 'All feeding data has been reset for today.',
    });
  }, [onRefresh, toast]);
  
  // Handle feeding log action
  const handleFeedingAction = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string
  ) => {
    if (activeCategory !== 'feeding') {
      console.log('Feeding action ignored - not in feeding category');
      return;
    }
    
    try {
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
      
      // Trigger refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error handling feeding action:', error);
      toast({
        title: 'Error logging feeding',
        description: `Could not log feeding for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    }
  }, [activeCategory, feedingLogs, contextDeleteCareLog, user, toast, onRefresh]);
  
  return {
    feedingLogs,
    handleFeedingAction,
    resetFeedingLogs,
    checkAndResetFeedingLogs
  };
};
