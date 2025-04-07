
import { useEffect } from 'react';
import { useWeightData } from '@/hooks/useWeightData';
import { useToast } from '@/hooks/use-toast';

export const useWeightRecordsData = (dogId: string) => {
  const { weightRecords, isLoading, error, refreshWeightRecords } = useWeightData(dogId);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching weight records',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return {
    weightRecords,
    isLoading,
    error,
    refreshWeightRecords
  };
};
