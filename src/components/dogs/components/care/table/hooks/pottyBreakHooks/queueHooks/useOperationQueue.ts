
import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook for managing a queue of asynchronous operations with controlled execution
 */
export const useOperationQueue = (onQueueEmpty?: () => void) => {
  // Queue for batched operations
  const operationQueueRef = useRef<Array<() => Promise<void>>>([]);
  const isProcessingQueueRef = useRef(false);
  
  // Track operations to prevent memory leaks
  const totalOperationsRef = useRef<number>(0);
  const MAX_QUEUE_SIZE = 5;
  
  // Debounce timer for refresh
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      } else if (onQueueEmpty && debounceTimerRef.current === null) {
        // Queue is empty, trigger a gentle refresh if needed
        console.log("Queue empty, scheduling refresh");
        debounceTimerRef.current = setTimeout(() => {
          console.log("Executing debounced refresh");
          
          // Only refresh if we're still mounted
          try {
            onQueueEmpty();
          } catch (error) {
            console.error("Error in debounced refresh:", error);
          }
          
          if (debounceTimerRef.current) {
            debounceTimerRef.current = null;
          }
        }, 2000); // Longer delay for the final refresh
      }
    }
  }, [onQueueEmpty]);
  
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

  // Clean up any timers when unmounting
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
      console.log(`Cleanup: ${operationQueueRef.current.length} pending operations cleared`);
      operationQueueRef.current = [];
      isProcessingQueueRef.current = false;
    };
  }, []);

  return {
    queueOperation,
    isProcessing: isProcessingQueueRef,
    queueSize: () => operationQueueRef.current.length,
    totalOperations: totalOperationsRef
  };
};
