
import { useState, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';

export const useCellActions = (onRefresh?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addCareLog } = useDailyCare();
  const { toast } = useToast();

  const handleLogCare = useCallback(async (
    dogId: string, 
    timeSlot: string, 
    category: string
  ) => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log(`Logging care for ${dogId} at ${timeSlot} (${category})`);
    
    try {
      // Create formatted timestamp from timeSlot (assuming HH:MM format)
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const timestamp = new Date();
      timestamp.setHours(hours, minutes, 0, 0);
      
      // Create care log
      await addCareLog({
        dog_id: dogId,
        category,
        task_name: `${category} at ${timeSlot}`,
        timestamp,
        notes: `Logged via timetable at ${timeSlot}`
      });
      
      toast({
        title: "Care logged",
        description: `Successfully logged ${category} at ${timeSlot}`,
      });
      
      // Trigger refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error logging care:', error);
      toast({
        title: "Error",
        description: "Failed to log care",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addCareLog, isLoading, onRefresh, toast]);

  return {
    isLoading,
    handleLogCare
  };
};
