
import { useCallback } from 'react';
import { logFeedingTask } from '@/services/dailyCare/feeding/mutations';

export const useFeedingOperations = () => {
  // Log feeding operation
  const logFeeding = useCallback((
    dogId: string,
    dogName: string,
    timeSlot: string,
    queueOperation: (op: () => Promise<void>) => void
  ) => {
    queueOperation(async () => {
      console.log(`⏳ Logging feeding for ${dogName} at ${timeSlot}...`);
      
      try {
        // Make the API call
        await logFeedingTask(dogId, timeSlot);
        console.log(`✅ Successfully logged feeding for ${dogName} at ${timeSlot}`);
      } catch (error) {
        console.error(`❌ Error logging feeding for ${dogName}:`, error);
        throw error;
      }
    });
  }, []);

  return {
    logFeeding
  };
};
