
import { useCallback, useRef } from 'react';

/**
 * Custom hook to handle operation queueing for dog let out operations
 */
export const useOperationQueue = (onRefresh?: () => void) => {
  const queueRef = useRef<(() => Promise<void>)[]>([]);
  const isProcessingRef = useRef(false);
  const totalOperations = useRef(0);

  // Process all operations in the queue
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    
    try {
      // Process operations one by one
      while (queueRef.current.length > 0) {
        const operation = queueRef.current.shift();
        if (operation) {
          await operation();
        }
      }
      
      // After all operations complete, trigger refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error processing operation queue:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [onRefresh]);

  // Add an operation to the queue and start processing
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    // Add operation to queue
    queueRef.current.push(operation);
    totalOperations.current += 1;
    
    // Start processing if not already processing
    processQueue();
    
    // For debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Added operation to queue. Queue length: ${queueRef.current.length}, Total operations: ${totalOperations.current}`);
    }
  }, [processQueue]);

  return {
    queueOperation,
    isProcessing: isProcessingRef,
    totalOperations
  };
};
