
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WeightRecord, GrowthStats } from '@/types/weight';
import { calculatePercentChange } from '@/components/litters/puppies/weight/weightUnits';

export const useWeightTracking = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch weight history
  const { 
    data: weightHistory = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dogWeights', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Ensure all records have the correct shape
      return (data || []).map((record: any): WeightRecord => ({
        id: record.id,
        dog_id: record.dog_id,
        puppy_id: record.puppy_id,
        weight: record.weight,
        weight_unit: record.weight_unit,
        unit: record.weight_unit, // For backward compatibility
        date: record.date,
        notes: record.notes || '',
        percent_change: record.percent_change,
        created_at: record.created_at
      }));
    },
    enabled: !!dogId,
  });

  // Add a new weight record
  const addWeightMutation = useMutation({
    mutationFn: async (data: Partial<WeightRecord>) => {
      if (!dogId) return null;
      
      // Set the dog_id from the hook
      const recordData = {
        ...data,
        dog_id: dogId,
      };
      
      // Calculate percent change if there's previous data
      if (weightHistory && weightHistory.length > 0) {
        const latestWeight = weightHistory[0];
        if (data.weight && data.weight_unit === latestWeight.weight_unit) {
          recordData.percent_change = calculatePercentChange(latestWeight.weight, data.weight);
        }
      }
      
      const { data: result, error } = await supabase
        .from('weight_records')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Weight added',
        description: 'The weight record has been added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['dogWeights', dogId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add weight record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Update a weight record
  const updateWeightMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WeightRecord> }) => {
      const { data: result, error } = await supabase
        .from('weight_records')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Weight updated',
        description: 'The weight record has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['dogWeights', dogId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update weight record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Delete a weight record
  const deleteWeightMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: 'Weight deleted',
        description: 'The weight record has been deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['dogWeights', dogId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete weight record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Calculate growth stats
  const calculateGrowthStats = (): GrowthStats => {
    if (!weightHistory || weightHistory.length === 0) {
      return {
        currentWeight: 0,
        weightUnit: 'lb',
        averageGrowth: 0,
        growthRate: 0,
        lastWeekGrowth: 0,
        projectedWeight: 0
      };
    }

    // Sort by date, newest first
    const sortedWeights = [...weightHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentWeight = sortedWeights[0].weight;
    const weightUnit = sortedWeights[0].weight_unit;
    
    // If we have at least two records, calculate trends
    if (sortedWeights.length > 1) {
      // For growth rate
      const oldestRecord = sortedWeights[sortedWeights.length - 1];
      const daysDifference = Math.max(1, 
        (new Date(sortedWeights[0].date).getTime() - new Date(oldestRecord.date).getTime()) 
        / (1000 * 60 * 60 * 24)
      );
      
      const totalGrowth = currentWeight - oldestRecord.weight;
      const averageGrowth = totalGrowth / daysDifference;
      const growthRate = (totalGrowth / oldestRecord.weight) * 100;
      
      // For last week's growth
      let lastWeekGrowth = 0;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weekOldRecord = sortedWeights.find(record => 
        new Date(record.date).getTime() <= oneWeekAgo.getTime()
      );
      
      if (weekOldRecord) {
        lastWeekGrowth = currentWeight - weekOldRecord.weight;
      }
      
      // Projected weight (4 weeks in future)
      const projectedWeight = currentWeight + (averageGrowth * 28);
      
      return {
        currentWeight,
        weightUnit,
        averageGrowth,
        growthRate,
        lastWeekGrowth,
        projectedWeight
      };
    }
    
    return {
      currentWeight,
      weightUnit,
      averageGrowth: 0,
      growthRate: 0,
      lastWeekGrowth: 0,
      projectedWeight: currentWeight
    };
  };

  const getLatestWeight = () => {
    if (!weightHistory || weightHistory.length === 0) return null;
    return weightHistory[0];
  };

  // Calculate growth stats
  const growthStats = calculateGrowthStats();

  return {
    weightHistory,
    isLoading,
    isError,
    error,
    refetch,
    addWeightRecord: (data: Partial<WeightRecord>) => addWeightMutation.mutateAsync(data),
    updateWeightRecord: (id: string, data: Partial<WeightRecord>) => 
      updateWeightMutation.mutateAsync({ id, data }),
    deleteWeightRecord: (id: string) => deleteWeightMutation.mutateAsync(id),
    growthStats,
    getLatestWeight
  };
};
