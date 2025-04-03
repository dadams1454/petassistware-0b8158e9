
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { WeightRecord } from '@/types/health';
import { 
  getWeightHistory, 
  addWeightRecord, 
  deleteWeightRecord 
} from '@/services/healthService';

export const useWeightTracking = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch weight history
  const {
    data: weightHistory = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['weightHistory', dogId],
    queryFn: () => getWeightHistory(dogId),
    enabled: !!dogId
  });

  // Add a weight record
  const addWeight = useMutation({
    mutationFn: (record: Partial<WeightRecord>) => {
      return addWeightRecord({
        ...record,
        dog_id: dogId
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Weight record added successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add weight record: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });

  // Delete a weight record
  const deleteWeight = useMutation({
    mutationFn: (id: string) => {
      return deleteWeightRecord(id);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Weight record deleted successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete weight record: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });

  // Calculate weight change over time
  const calculateWeightChange = (currentWeight: number, previousWeight: number): number => {
    if (!previousWeight) return 0;
    const change = ((currentWeight - previousWeight) / previousWeight) * 100;
    return parseFloat(change.toFixed(1));
  };

  // Get the latest weight record
  const getLatestWeight = (): WeightRecord | undefined => {
    if (!weightHistory || weightHistory.length === 0) return undefined;
    return weightHistory[0];
  };

  return {
    weightHistory,
    isLoading,
    isError,
    error,
    refetch,
    isAddDialogOpen,
    setIsAddDialogOpen,
    addWeight: addWeight.mutateAsync,
    deleteWeight: deleteWeight.mutateAsync,
    calculateWeightChange,
    getLatestWeight
  };
};
