
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook for handling feeding-specific operations with optimistic UI updates
 */
export const useFeedingOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  // Track pending feeding operations for optimistic UI updates
  const [pendingFeedings, setPendingFeedings] = useState<Record<string, Set<string>>>({});

  // Check if a feeding operation is pending for a specific dog and time slot
  const isPendingFeeding = useCallback((dogId: string, timeSlot: string) => {
    return pendingFeedings[dogId]?.has(timeSlot) || false;
  }, [pendingFeedings]);

  // Handle logging feeding with meal times and optimistic updates
  const logFeeding = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    queueOperation: (operation: () => Promise<void>) => void
  ) => {
    // Show immediate toast feedback
    toast({
      title: 'Logging feeding...',
      description: `Recording that ${dogName} was fed at ${timeSlot.toLowerCase()}`,
    });
    
    // Optimistic UI update - mark this feeding as pending
    setPendingFeedings(prev => {
      const updatedPending = { ...prev };
      if (!updatedPending[dogId]) {
        updatedPending[dogId] = new Set();
      }
      updatedPending[dogId].add(timeSlot);
      return updatedPending;
    });
    
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
        
        // Show success toast
        toast({
          title: 'Feeding logged',
          description: `${dogName} was fed at ${timeSlot.toLowerCase()}`,
        });
      } catch (error) {
        console.error('Error in queued feeding operation:', error);
        
        // Show error toast
        toast({
          title: 'Error logging feeding',
          description: `Failed to log feeding for ${dogName}`,
          variant: 'destructive',
        });
      } finally {
        // Remove from pending operations regardless of success/failure
        setPendingFeedings(prev => {
          const updatedPending = { ...prev };
          if (updatedPending[dogId]) {
            updatedPending[dogId].delete(timeSlot);
            if (updatedPending[dogId].size === 0) {
              delete updatedPending[dogId];
            }
          }
          return updatedPending;
        });
      }
    });
  }, [user, toast]);

  return {
    logFeeding,
    isPendingFeeding
  };
};
