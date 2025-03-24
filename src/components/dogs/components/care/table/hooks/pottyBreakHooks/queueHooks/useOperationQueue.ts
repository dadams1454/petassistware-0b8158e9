
import { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

/**
 * Enhanced hook for managing a queue of asynchronous operations with controlled execution
 * and improved batching for better performance
 */
export const useOperationQueue = (onQueueEmpty?: () => void) => {
  // Queue for batched operations
  const operationQueueRef = useRef<Array<() => Promise<void>>>([]);
  const isProcessingQueueRef = useRef(false);
  
  // Track operations to prevent memory leaks
  const totalOperationsRef = useRef<number>(0);
  const MAX_QUEUE_SIZE = 10; // Increased to handle more operations in a batch
  
  // Debounce timer for refresh with proper reference and cleanup
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced refresh function that only triggers when queue is empty
  const debouncedRefresh = useRef(
    debounce(() => {
      if (operationQueueRef.current.length === 0 && onQueueEmpty) {
        console.log("Queue empty, executing debounced refresh");
        try {
          onQueueEmpty();
        } catch (error) {
          console.error("Error in debounced refresh:", error);
        }
      }
    }, 1000) // Reduced from 2000ms to 1000ms for better responsiveness
  ).current;

  // Process the operation queue with enhanced error handling and batching
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || operationQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Processing queue: ${operationQueueRef.current.length} operations pending`);
    }
    
    try {
      // Process batches of operations in parallel for better performance
      // Take up to 3 operations from the queue for parallel processing
      const batchSize = Math.min(3, operationQueueRef.current.length);
      const batch = operationQueueRef.current.splice(0, batchSize);
      
      await Promise.allSettled(batch.map(async (operation, index) => {
        try {
          await operation();
          // Increment total operations counter
          totalOperationsRef.current += 1;
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Operation #${totalOperationsRef.current} (batch item ${index + 1}/${batchSize}) successful`);
          }
        } catch (error) {
          console.error(`❌ Error in queue operation (batch item ${index + 1}/${batchSize}):`, error);
          // Don't throw - we want to continue processing the queue
        }
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Batch of ${batchSize} operations completed. Remaining queue size: ${operationQueueRef.current.length}`);
      }
    } catch (error) {
      console.error("⚠️ Critical error processing queue:", error);
    } finally {
      isProcessingQueueRef.current = false;
      
      // Continue processing if there are more operations, with a tiny delay
      if (operationQueueRef.current.length > 0) {
        setTimeout(processQueue, 50); // Small delay between batches
      } else {
        // Queue is empty, trigger debounced refresh
        debouncedRefresh();
      }
    }
  }, [debouncedRefresh]);
  
  // Add operation to queue with improved safeguards and batching
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    // Limit queue size to prevent memory leaks, but with a higher limit
    if (operationQueueRef.current.length >= MAX_QUEUE_SIZE) {
      console.warn(`⚠️ Operation queue size limit reached (${MAX_QUEUE_SIZE}), dropping oldest operation`);
      operationQueueRef.current.shift(); // Remove oldest operation
    }
    
    operationQueueRef.current.push(operation);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Added operation to queue. Queue size: ${operationQueueRef.current.length}`);
    }
    
    // Start processing the queue immediately if it's not already being processed
    if (!isProcessingQueueRef.current) {
      processQueue();
    }
  }, [processQueue]);

  // Clean up any timers and resources when unmounting
  useEffect(() => {
    return () => {
      // Cancel debounced refresh
      debouncedRefresh.cancel();
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cleanup: ${operationQueueRef.current.length} pending operations cleared`);
      }
      
      operationQueueRef.current = [];
      isProcessingQueueRef.current = false;
    };
  }, [debouncedRefresh]);

  return {
    queueOperation,
    isProcessing: isProcessingQueueRef,
    queueSize: () => operationQueueRef.current.length,
    totalOperations: totalOperationsRef
  };
};
