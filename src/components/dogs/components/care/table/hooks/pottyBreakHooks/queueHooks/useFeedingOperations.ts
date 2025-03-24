
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { addCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook for handling feeding-specific operations
 */
export const useFeedingOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle logging feeding with meal times
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
      }
    });
  }, [user, toast]);

  return {
    logFeeding
  };
};
