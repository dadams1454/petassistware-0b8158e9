
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { addCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook for handling all cell click actions (potty breaks and feeding)
 */
export const useCellActions = (onRefresh?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const operationQueueRef = useRef<Array<() => Promise<void>>>([]);
  const isProcessingRef = useRef(false);
  const clickProtectionMap = useRef<Record<string, number>>({});
  
  // Process the queue
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || operationQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    setIsLoading(true);
    
    try {
      // Process operations one by one
      while (operationQueueRef.current.length > 0) {
        const operation = operationQueueRef.current.shift();
        if (operation) await operation();
      }
      
      // Call refresh callback if all operations succeeded
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error processing operation queue:', error);
    } finally {
      isProcessingRef.current = false;
      setIsLoading(false);
    }
  }, [onRefresh]);
  
  // Add operation to queue and process
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    operationQueueRef.current.push(operation);
    processQueue();
  }, [processQueue]);
  
  // Handle potty break logging
  const handlePottyBreak = useCallback((dogId: string, dogName: string, timeSlot: string) => {
    // Queue the potty break operation
    queueOperation(async () => {
      try {
        await logDogPottyBreak(dogId, timeSlot);
        console.log('Potty break logged successfully:', { dogId, timeSlot });
      } catch (error) {
        console.error('Error logging potty break:', error);
        toast({
          title: 'Error',
          description: `Could not log potty break for ${dogName}`,
          variant: 'destructive',
        });
        throw error; // Rethrow to stop queue processing
      }
    });
    
    // Show immediate feedback
    toast({
      title: 'Potty break logged',
      description: `${dogName} was taken out at ${timeSlot}`,
    });
  }, [queueOperation, toast]);
  
  // Handle feeding logging
  const handleFeeding = useCallback((dogId: string, dogName: string, timeSlot: string) => {
    // Map timeSlot to appropriate hours
    const timestamp = new Date();
    
    // Set hours based on meal time
    if (timeSlot === "Morning") {
      timestamp.setHours(7, 0, 0, 0);  // 7:00 AM
    } else if (timeSlot === "Noon") {
      timestamp.setHours(12, 0, 0, 0); // 12:00 PM
    } else if (timeSlot === "Evening") {
      timestamp.setHours(18, 0, 0, 0); // 6:00 PM
    }
    
    const mealName = `${timeSlot} Feeding`;
    
    // Queue the feeding operation
    queueOperation(async () => {
      try {
        if (!user?.id) {
          throw new Error("User ID not available");
        }
        
        await addCareLog({
          dog_id: dogId,
          category: 'feeding',
          task_name: mealName,
          timestamp: timestamp,
          notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
        }, user.id);
        
        console.log('Feeding logged successfully:', { dogId, timeSlot });
      } catch (error) {
        console.error('Error logging feeding:', error);
        toast({
          title: 'Error',
          description: `Could not log feeding for ${dogName}`,
          variant: 'destructive',
        });
        throw error; // Rethrow to stop queue processing
      }
    });
    
    // Show immediate feedback
    toast({
      title: 'Feeding logged',
      description: `${dogName} was fed at ${timeSlot.toLowerCase()}`,
    });
  }, [queueOperation, toast, user]);
  
  // Click protection to prevent rapid clicking
  const shouldAllowClick = useCallback((dogId: string, timeSlot: string): boolean => {
    const key = `${dogId}-${timeSlot}`;
    const now = Date.now();
    const lastClick = clickProtectionMap.current[key] || 0;
    
    // Allow clicks only every 500ms per dog+timeslot
    if (now - lastClick < 500) {
      console.log('Click throttled:', key);
      return false;
    }
    
    clickProtectionMap.current[key] = now;
    return true;
  }, []);
  
  // Combined cell click handler
  const handleCellClick = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string,
    status: { hasPottyBreak: boolean, hasCareLogged: boolean }
  ) => {
    if (isLoading) {
      console.log("Ignoring click - loading in progress");
      return;
    }
    
    if (!shouldAllowClick(dogId, timeSlot)) {
      return;
    }
    
    try {
      if (category === 'pottybreaks') {
        // For potty breaks
        handlePottyBreak(dogId, dogName, timeSlot);
      } else if (category === 'feeding') {
        // For feeding
        handleFeeding(dogId, dogName, timeSlot);
      }
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
      toast({
        title: `Error`,
        description: `Could not log ${category} for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    }
  }, [isLoading, shouldAllowClick, handlePottyBreak, handleFeeding, toast]);
  
  return {
    isLoading,
    handleCellClick
  };
};
