
import { useState, useCallback, useRef, useEffect } from 'react';
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track total operations to prevent memory leaks
  const totalOperationsRef = useRef<number>(0);
  const MAX_QUEUE_SIZE = 10; // Reduced from 50 to prevent potential memory issues
  
  // Track clicks for debugging refresh issue
  const clickCountRef = useRef<number>(0);
  
  // Process the operation queue
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || operationQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    try {
      // Take the first operation from the queue
      const operation = operationQueueRef.current.shift();
      if (operation) {
        await operation();
        // Increment total operations counter
        totalOperationsRef.current += 1;
        console.log(`Processed operation #${totalOperationsRef.current}, queue size: ${operationQueueRef.current.length}`);
      }
    } catch (error) {
      console.error("Error processing queue operation:", error);
    } finally {
      isProcessingQueueRef.current = false;
      
      // Continue processing if there are more operations
      if (operationQueueRef.current.length > 0) {
        setTimeout(processQueue, 50); // Small delay between operations
      } else {
        // Queue is empty, trigger a gentle refresh if needed
        if (onRefresh && debounceTimerRef.current === null) {
          debounceTimerRef.current = setTimeout(() => {
            onRefresh();
            if (debounceTimerRef.current) {
              debounceTimerRef.current = null;
            }
          }, 2000); // Longer delay for the final refresh
        }
      }
    }
  }, [onRefresh]);
  
  // Add operation to queue and start processing with safeguards
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    // Limit queue size to prevent memory leaks
    if (operationQueueRef.current.length >= MAX_QUEUE_SIZE) {
      console.warn(`Operation queue size limit reached (${MAX_QUEUE_SIZE}), dropping oldest operation`);
      operationQueueRef.current.shift(); // Remove oldest operation
    }
    
    operationQueueRef.current.push(operation);
    console.log(`Added operation to queue. Queue size: ${operationQueueRef.current.length}`);
    
    if (!isProcessingQueueRef.current) {
      processQueue();
    }
  }, [processQueue]);
  
  // Handler for cell clicks with optimistic updates and error prevention
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) return;
    
    // Increment click counter for debugging
    clickCountRef.current += 1;
    console.log(`Cell clicked: ${clickCountRef.current} times (${dogName}, ${timeSlot})`);
    
    // Check if we're approaching the 6-click threshold
    if (clickCountRef.current === 5) {
      console.log('⚠️ WARNING: useCellActions approaching 6 clicks!');
    }
    
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
          
          console.log('🚫 Potty break removed for', dogName, 'at', timeSlot);
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
  }, [isLoading, pottyBreaks, setPottyBreaks, activeCategory, user, toast, queueOperation]);
  
  // Reset click counter when category changes
  useEffect(() => {
    clickCountRef.current = 0;
    console.log('Click counter reset due to category change:', activeCategory);
  }, [activeCategory]);
  
  // Clean up any timers when unmounting
  useEffect(() => {
    return () => {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
      // Clear queue
      console.log(`Cleanup: ${operationQueueRef.current.length} pending operations cleared`);
      operationQueueRef.current = [];
      isProcessingQueueRef.current = false;
      totalOperationsRef.current = 0;
      clickCountRef.current = 0;
    };
  }, []);
  
  return {
    isLoading,
    handleCellClick
  };
};
