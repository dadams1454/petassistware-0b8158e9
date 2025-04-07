
import { useEffect } from 'react';
import { useWeightData } from '@/modules/weight/hooks/useWeightData';
import { useToast } from '@/components/ui/use-toast';

/**
 * Custom hook to get weight records data for a dog
 * @param dogId The ID of the dog
 * @returns Weight records data and helper functions
 */
export const useWeightRecordsData = (dogId: string) => {
  const weightData = useWeightData({ dogId });
  const { toast } = useToast();

  useEffect(() => {
    if (weightData.error) {
      toast({
        title: 'Error fetching weight records',
        description: weightData.error.message,
        variant: 'destructive',
      });
    }
  }, [weightData.error, toast]);

  return {
    weightRecords: weightData.weightRecords,
    isLoading: weightData.isLoading,
    error: weightData.error,
    refreshWeightRecords: weightData.fetchWeightHistory
  };
};
