
import { useRef, useCallback } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

export const useOperationQueue = (onRefresh?: () => void) => {
  const queue = useRef<(() => Promise<void>)[]>([]);
  const isProcessing = useRef(false);
  const totalOperations = useRef(0);
  
  // Debounced refresh to avoid multiple refreshes
  const debouncedRefresh = useDebouncedCallback(() => {
    console.log('🔄 Executing debounced refresh');
    if (onRefresh) {
      onRefresh();
    }
  }, 2000);

  // Process the queue - this runs one operation at a time
  const processQueue = useCallback(async () => {
    // If already processing or queue is empty, return
    if (isProcessing.current || queue.current.length === 0) {
      return;
    }
    
    isProcessing.current = true;
    console.log(`🔄 Processing queue: ${queue.current.length} operations pending`);
    
    try {
      // Get the next operation from the queue
      const operation = queue.current.shift();
      if (operation) {
        totalOperations.current++;
        await operation();
        console.log(`✅ Operation #${totalOperations.current} successful, queue size: ${queue.current.length}`);
      }
    } catch (error) {
      console.error('❌ Error processing operation:', error);
    } finally {
      isProcessing.current = false;
      
      // If there are more items in the queue, process the next one
      if (queue.current.length > 0) {
        processQueue();
      } else {
        console.log('📭 Queue empty, scheduling refresh');
        debouncedRefresh();
      }
    }
  }, [debouncedRefresh]);

  // Add an operation to the queue and start processing if not already
  const queueOperation = useCallback((operation: () => Promise<void>) => {
    queue.current.push(operation);
    console.log(`➕ Added operation to queue. Queue size: ${queue.current.length}`);
    
    // Only start processing if not already in progress
    if (!isProcessing.current) {
      processQueue();
    }
  }, [processQueue]);

  return {
    queueOperation,
    totalOperations
  };
};
