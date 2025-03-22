
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { addCareLog } from '@/services/dailyCare/careLogsService';
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
  
  // Queue for batched operations
  const operationQueueRef = useRef<Array<() => Promise<void>>>([]);
  const isProcessingQueueRef = useRef(false);
  
  // Debounce timer references
  const debounceTimerRef = useRef<number | null>(null);
  
  // Process the operation queue
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || operationQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    try {
      // Take the first operation from the queue
      const operation = operationQueueRef.current.shift();
      if (operation) {
        await operation();
      }
    } finally {
      isProcessingQueueRef.current = false;
      
      // Continue processing if there are more operations
      if (operationQueueRef.current.length > 0) {
        setTimeout(processQueue, 50); // Small delay between operations
      } else {
        // Queue is empty, trigger a gentle refresh if needed
        if (onRefresh && debounceTimerRef.current === null) {
          debounceTimerRef.current = window.setTimeout(() => {
            onRefresh();
            debounceTimerRef.current = null;
          }, 2000); // Longer delay for the final refresh
        }
      }
    }
  }, [onRefresh]);
  
  // Add operation to queue and start processing
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    operationQueueRef.current.push(operation);
    
    if (!isProcessingQueueRef.current) {
      processQueue();
    }
  }, [processQueue]);
  
  // Handler for cell clicks with optimistic updates
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) return;
    
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    try {
      if (category === 'pottybreaks') {
        // Check if this dog already has a potty break at this time
        const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
        // Optimistically update UI immediately
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
          
          // Queue the actual operation
          queueOperation(async () => {
            // Here you would add code to remove the potty break from the database
            // For now, we're just simulating a successful operation
            console.log('Remove potty break operation queued:', { dogId, timeSlot });
          });
          
          toast({
            title: 'Potty break removed',
            description: `Removed potty break for ${dogName} at ${timeSlot}`,
          });
        } else {
          // Optimistically update UI first
          const updatedPottyBreaks = { ...pottyBreaks };
          if (!updatedPottyBreaks[dogId]) {
            updatedPottyBreaks[dogId] = [];
          }
          
          if (!updatedPottyBreaks[dogId].includes(timeSlot)) {
            updatedPottyBreaks[dogId] = [...updatedPottyBreaks[dogId], timeSlot];
          }
          
          setPottyBreaks(updatedPottyBreaks);
          
          // Queue the actual API operation
          queueOperation(async () => {
            try {
              await logDogPottyBreak(dogId, timeSlot);
              console.log('Potty break logged successfully:', { dogId, timeSlot });
            } catch (error) {
              console.error('Error in queued potty break operation:', error);
              // If the API call fails, revert the optimistic update
              const revertedBreaks = { ...updatedPottyBreaks };
              if (revertedBreaks[dogId]) {
                revertedBreaks[dogId] = revertedBreaks[dogId].filter(slot => slot !== timeSlot);
                if (revertedBreaks[dogId].length === 0) {
                  delete revertedBreaks[dogId];
                }
                setPottyBreaks(revertedBreaks);
              }
              
              // Show error toast
              toast({
                title: 'Error logging potty break',
                description: `Failed to log potty break for ${dogName}`,
                variant: 'destructive',
              });
            }
          });
          
          toast({
            title: 'Potty break logged',
            description: `${dogName} was taken out at ${timeSlot}`,
          });
        }
      } else if (category === 'feeding') {
        // Handle feeding log action with named times (Morning, Noon, Evening)
        const timestamp = new Date();
        
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
        
        // Queue the feeding operation
        queueOperation(async () => {
          try {
            await addCareLog({
              dog_id: dogId,
              category: 'feeding',
              task_name: mealName,
              timestamp: timestamp,
              notes: `${dogName} fed at ${timeSlot.toLowerCase()}`
            }, user?.id || '');
            console.log('Feeding logged successfully:', { dogId, timeSlot });
          } catch (error) {
            console.error('Error in queued feeding operation:', error);
            
            // Show error toast
            toast({
              title: 'Error logging feeding',
              description: `Failed to log feeding for ${dogName}`,
              variant: 'destructive',
            });
          }
        });
        
        toast({
          title: 'Feeding logged',
          description: `${dogName} was fed at ${timeSlot.toLowerCase()}`,
        });
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
    }
  }, [isLoading, pottyBreaks, setPottyBreaks, activeCategory, currentDate, user, toast, queueOperation]);
  
  // Clean up any timers when unmounting
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  return {
    isLoading,
    handleCellClick
  };
};
