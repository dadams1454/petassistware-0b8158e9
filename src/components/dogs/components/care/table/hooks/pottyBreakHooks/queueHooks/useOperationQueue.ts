
import { useState, useCallback } from 'react';

interface QueuedOperation {
  id: string;
  description: string;
  execute: () => Promise<any>;
}

export const useOperationQueue = () => {
  const [operationQueue, setOperationQueue] = useState<QueuedOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add operation to queue
  const queueOperation = useCallback((operation: QueuedOperation) => {
    setOperationQueue(prev => [...prev, operation]);
    processQueue();
  }, []);

  // Process the queue
  const processQueue = useCallback(async () => {
    if (isProcessing || operationQueue.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const operation = operationQueue[0];
      await operation.execute();
      setOperationQueue(prev => prev.slice(1)); // Remove processed operation
    } catch (error) {
      console.error('Error processing queue operation:', error);
    } finally {
      setIsProcessing(false);
      // If there are more operations, process next
      if (operationQueue.length > 1) {
        setTimeout(processQueue, 100);
      }
    }
  }, [isProcessing, operationQueue]);

  return {
    queueOperation,
    isProcessing,
    queueLength: operationQueue.length
  };
};
