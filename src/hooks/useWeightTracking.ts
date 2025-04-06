
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { WeightRecord } from '@/types/weight';
import { 
  getWeightHistory, 
  addWeightRecord, 
  updateWeightRecord,
  deleteWeightRecord 
} from '@/services/healthService';
import { mapWeightRecordFromDB, mapWeightRecordToDB } from '@/lib/mappers/weightMapper';

export const useWeightTracking = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedWeight, setSelectedWeight] = useState<WeightRecord | null>(null);
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
    queryFn: async () => {
      const records = await getWeightHistory(dogId);
      return records.map(record => mapWeightRecordFromDB(record));
    },
    enabled: !!dogId
  });

  // Add a weight record
  const addWeight = useMutation({
    mutationFn: (record: Partial<WeightRecord>) => {
      const dbRecord = mapWeightRecordToDB({
        ...record,
        dog_id: dogId
      });
      return addWeightRecord(dbRecord);
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

  // Update a weight record
  const updateWeight = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WeightRecord> }) => {
      const dbRecord = mapWeightRecordToDB(data);
      return updateWeightRecord(id, dbRecord);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Weight record updated successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
      setSelectedWeight(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update weight record: ${(error as Error).message}`,
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

  // Calculate growth stats
  const calculateGrowthStats = (weights: WeightRecord[]) => {
    if (!weights || weights.length < 2) {
      return {
        percentChange: 0,
        averageGrowthRate: 0,
        weightGoal: null,
        onTrack: null,
        totalGrowth: null,
        currentWeight: weights?.[0]?.weight || 0,
        weightUnit: weights?.[0]?.weight_unit || 'lb'
      };
    }

    // Sort by date, most recent first
    const sortedWeights = [...weights].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const current = sortedWeights[0];
    const previous = sortedWeights[1];
    const earliest = sortedWeights[sortedWeights.length - 1];

    // Calculate percent change
    const percentChange = ((current.weight - previous.weight) / previous.weight) * 100;
    
    // Calculate growth rates
    let totalGrowthRate = 0;
    for (let i = 0; i < sortedWeights.length - 1; i++) {
      const currentEntry = sortedWeights[i];
      const nextEntry = sortedWeights[i + 1];
      const change = ((currentEntry.weight - nextEntry.weight) / nextEntry.weight) * 100;
      totalGrowthRate += change;
    }
    
    const averageGrowthRate = totalGrowthRate / (sortedWeights.length - 1);
    const totalGrowth = current.weight - earliest.weight;

    return {
      percentChange: parseFloat(percentChange.toFixed(2)),
      averageGrowthRate: parseFloat(averageGrowthRate.toFixed(2)),
      weightGoal: null, // This would be calculated based on breed standards
      onTrack: null, // This would be calculated based on breed standards
      totalGrowth: parseFloat(totalGrowth.toFixed(2)),
      currentWeight: current.weight,
      weightUnit: current.weight_unit
    };
  };

  return {
    weightHistory,
    isLoading,
    isError,
    error,
    refetch,
    selectedWeight,
    setSelectedWeight,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isSubmitting: addWeight.isPending || updateWeight.isPending || deleteWeight.isPending,
    addWeight: addWeight.mutateAsync,
    updateWeight: updateWeight.mutateAsync,
    deleteWeight: deleteWeight.mutateAsync,
    calculateGrowthStats,
    
    // For compatibility with older code
    addWeightRecord: addWeight.mutateAsync,
    updateWeightRecord: (id: string, data: Partial<WeightRecord>) => updateWeight.mutateAsync({ id, data }),
    deleteWeightRecord: deleteWeight.mutateAsync,
    growthStats: calculateGrowthStats(weightHistory)
  };
};
