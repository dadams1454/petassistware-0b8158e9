
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addWeightRecord, getWeightHistory, deleteWeightRecord } from '@/services/healthService';
import { WeightRecord, WeightUnitEnum } from '@/types/health';
import { useToast } from '@/hooks/use-toast';

export interface GrowthStats {
  percentChange: number;
  averageGrowthRate: number;
  projectedWeight: number | null;
  weightGoal: number | null;
  onTrack: boolean | null;
}

export const useWeightTracking = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [growthStats, setGrowthStats] = useState<GrowthStats>({
    percentChange: 0,
    averageGrowthRate: 0,
    projectedWeight: null,
    weightGoal: null,
    onTrack: null
  });
  
  // Fetch weight history
  const { 
    data: weightHistory = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['weightHistory', dogId],
    queryFn: () => getWeightHistory(dogId),
    enabled: !!dogId,
  });
  
  // Calculate growth statistics
  useEffect(() => {
    if (weightHistory && weightHistory.length >= 2) {
      // Sort by date, newest first
      const sortedWeights = [...weightHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Calculate percent change from previous to current weight
      const current = sortedWeights[0];
      const previous = sortedWeights[1];
      
      // Ensure weights are in the same unit
      const currentWeight = current.weight;
      const previousWeight = previous.weight;
      
      const percentChange = ((currentWeight - previousWeight) / previousWeight) * 100;
      
      // Calculate average growth rate (if we have more than 2 records)
      let averageGrowthRate = 0;
      if (sortedWeights.length > 2) {
        const growthRates: number[] = [];
        for (let i = 0; i < sortedWeights.length - 1; i++) {
          const current = sortedWeights[i];
          const previous = sortedWeights[i + 1];
          
          const daysBetween = Math.abs(
            (new Date(current.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysBetween > 0) {
            const rate = ((current.weight - previous.weight) / previous.weight) / daysBetween * 100;
            growthRates.push(rate);
          }
        }
        
        if (growthRates.length > 0) {
          averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
        }
      }
      
      // For now, set simple growth stats
      setGrowthStats({
        percentChange,
        averageGrowthRate,
        projectedWeight: null, // Would need more complex modeling
        weightGoal: null, // Would need breed-specific data
        onTrack: null // Need weight goals to determine
      });
    }
  }, [weightHistory]);
  
  // Add a new weight record
  const addWeight = useMutation({
    mutationFn: (record: Omit<WeightRecord, 'id' | 'created_at'>) => 
      addWeightRecord({
        ...record,
        dog_id: dogId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
      toast({
        title: 'Weight added',
        description: 'The weight record has been successfully added',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add weight',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete a weight record
  const deleteWeight = useMutation({
    mutationFn: (id: string) => deleteWeightRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightHistory', dogId] });
      toast({
        title: 'Weight deleted',
        description: 'The weight record has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete weight',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  return {
    weightHistory,
    isLoading,
    error,
    refetch,
    addWeightRecord: addWeight.mutate,
    deleteWeightRecord: deleteWeight.mutate,
    isAdding: addWeight.isPending,
    isDeleting: deleteWeight.isPending,
    growthStats
  };
};
