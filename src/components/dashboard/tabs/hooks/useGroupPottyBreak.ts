
import { useToast } from '@/hooks/use-toast';
import { recordCareActivity } from '@/services/careService';

export const useGroupPottyBreak = (onSuccess?: () => void) => {
  const { toast } = useToast();
  
  const handleGroupPottyBreak = async (dogIds: string[]) => {
    if (!dogIds.length) return;
    
    try {
      // Log potty break for each dog in the group
      const timestamp = new Date().toISOString();
      const promises = dogIds.map(dogId => 
        recordCareActivity({
          dog_id: dogId,
          activity_type: 'potty',
          timestamp,
          notes: 'Group potty break'
        })
      );
      
      await Promise.all(promises);
      
      toast({
        title: 'Potty Break Recorded',
        description: `Potty break recorded for ${dogIds.length} dogs.`,
      });
      
      // Trigger the optional success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error recording group potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to record potty break.',
        variant: 'destructive',
      });
    }
  };
  
  return {
    handleGroupPottyBreak
  };
};
