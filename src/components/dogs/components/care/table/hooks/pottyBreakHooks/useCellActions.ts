
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
  
  // Track total operations and clicks to prevent memory leaks and detect 6-click issue
  const totalOperationsRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const MAX_QUEUE_SIZE = 5; // Reduced from 10 to prevent potential memory issues
  
  // Process the operation queue with enhanced error handling
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || operationQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    console.log(`Processing queue: ${operationQueueRef.current.length} operations pending`);
    
    try {
      // Take the first operation from the queue
      const operation = operationQueueRef.current.shift();
      if (operation) {
        try {
          await operation();
          // Increment total operations counter
          totalOperationsRef.current += 1;
          console.log(`✅ Operation #${totalOperationsRef.current} successful, queue size: ${operationQueueRef.current.length}`);
        } catch (error) {
          console.error("❌ Error in queue operation:", error);
          // Don't throw - we want to continue processing the queue
        }
      }
    } catch (error) {
      console.error("⚠️ Critical error processing queue:", error);
    } finally {
      isProcessingQueueRef.current = false;
      
      // Continue processing if there are more operations, with a delay to prevent rapid processing
      if (operationQueueRef.current.length > 0) {
        setTimeout(processQueue, 100); // Increased delay between operations
      } else {
        // Queue is empty, trigger a gentle refresh if needed
        if (onRefresh && debounceTimerRef.current === null) {
          console.log("Queue empty, scheduling refresh");
          debounceTimerRef.current = setTimeout(() => {
            console.log("Executing debounced refresh");
            
            // Only refresh if we're still mounted
            try {
              onRefresh();
            } catch (error) {
              console.error("Error in debounced refresh:", error);
            }
            
            if (debounceTimerRef.current) {
              debounceTimerRef.current = null;
            }
          }, 2000); // Longer delay for the final refresh
        }
      }
    }
  }, [onRefresh]);
  
  // Add operation to queue with improved safeguards
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    // Clear refresh timer when adding new operations
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Limit queue size to prevent memory leaks
    if (operationQueueRef.current.length >= MAX_QUEUE_SIZE) {
      console.warn(`⚠️ Operation queue size limit reached (${MAX_QUEUE_SIZE}), dropping oldest operation`);
      operationQueueRef.current.shift(); // Remove oldest operation
    }
    
    operationQueueRef.current.push(operation);
    console.log(`Added operation to queue. Queue size: ${operationQueueRef.current.length}`);
    
    if (!isProcessingQueueRef.current) {
      processQueue();
    }
  }, [processQueue]);
  
  // Handler for cell clicks with optimistic updates and enhanced error prevention
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) {
      console.log("Ignoring click - loading in progress");
      return;
    }
    
    // Increment click counter for debugging
    clickCountRef.current += 1;
    const clickNumber = clickCountRef.current;
    console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot})`);
    
    // Special handling around the 6-click threshold to prevent the issue
    if (clickNumber === 5) {
      console.log('⚠️ WARNING: useCellActions approaching 6 clicks! Adding protection');
    }
    
    if (clickNumber >= 6) {
      console.log('⚠️ 6+ CLICKS DETECTED: Applying extra safeguards');
      // Clear the queue to prevent overflow
      operationQueueRef.current = [];
      
      // Show a toast to let the user know we detected rapid clicking
      toast({
        title: 'Multiple clicks detected',
        description: 'Please wait a moment before making more changes',
      });
      
      return; // Prevent further processing
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
