
import { useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addCareLog, deleteCareLog } from '@/services/dailyCare/careLogsService';

export interface UseFeedingOperationsProps {
  feedingLogsCache: React.MutableRefObject<Record<string, string>>;
  triggerDebouncedRefresh: () => void;
}

export const useFeedingOperations = ({ 
  feedingLogsCache, 
  triggerDebouncedRefresh 
}: UseFeedingOperationsProps) => {
  const { toast } = useToast();
  const pendingOperationsRef = useRef<Map<string, Promise<any>>>(new Map());
  
  // Handle feeding operations (add/delete)
  const performFeedingOperation = useCallback(async (
    dogId: string,
    dogName: string,
    timeSlot: string,
    isActive: boolean,
    userId?: string
  ) => {
    const cacheKey = `${dogId}-${timeSlot}`;
    
    try {
      if (isActive) {
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
            
            return { success: true, isActive: false };
          } else {
            // API call failed
            console.error(`❌ Failed to delete feeding log: ${existingLogId}`);
            
            toast({
              title: 'Error removing feeding',
              description: 'Could not remove the feeding record. Please try again.',
              variant: 'destructive',
            });
            
            return { success: false, isActive: true };
          }
        }
        
        return { success: false, isActive: true };
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
          
          return { success: true, isActive: true };
        } else {
          // API call failed
          console.error(`❌ Failed to add feeding log for ${dogName}`);
          
          toast({
            title: 'Error logging feeding',
            description: 'Could not log feeding. Please try again.',
            variant: 'destructive',
          });
          
          return { success: false, isActive: false };
        }
      }
    } catch (error) {
      console.error(`Error handling feeding operation:`, error);
      
      toast({
        title: `Error updating feeding record`,
        description: `Could not update feeding for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
      
      return { success: false, isActive };
    } finally {
      // Trigger a debounced refresh after operation completes
      triggerDebouncedRefresh();
    }
  }, [feedingLogsCache, toast, triggerDebouncedRefresh]);
  
  // Handle the feeding cell click with operation tracking
  const handleFeedingOperation = useCallback(async (
    dogId: string,
    dogName: string,
    timeSlot: string,
    isActive: boolean,
    userId?: string
  ) => {
    // Create a unique key for this cell
    const cacheKey = `${dogId}-${timeSlot}`;
    
    // Skip if we have a pending operation for this cell
    if (pendingOperationsRef.current.has(cacheKey)) {
      console.log('🔄 Operation already in progress for this cell, skipping');
      return { success: false, isActive };
    }
    
    // Create the operation function
    const operation = performFeedingOperation(dogId, dogName, timeSlot, isActive, userId);
    
    // Track this operation
    pendingOperationsRef.current.set(cacheKey, operation);
    
    // Wait for the operation to complete
    const result = await operation;
    
    // Remove from pending operations
    pendingOperationsRef.current.delete(cacheKey);
    
    return result;
  }, [performFeedingOperation]);
  
  return {
    handleFeedingOperation,
    pendingOperations: pendingOperationsRef
  };
};
