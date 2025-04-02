
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WeightRecord } from '../types/dog';

export const useWeightTracking = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch weight records
  const { 
    data: weightHistory, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dogWeightHistory', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (error) {
        toast({
          title: 'Error fetching weight history',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as WeightRecord[];
    },
    enabled: !!dogId,
  });
  
  // Add weight record
  const addWeightMutation = useMutation({
    mutationFn: async (weightData: Partial<WeightRecord>) => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const newWeightRecord = {
        ...weightData,
        dog_id: dogId,
      };
      
      const { data, error } = await supabase
        .from('weight_records')
        .insert(newWeightRecord)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogWeightHistory', dogId] });
      toast({
        title: 'Weight record added',
        description: 'The weight record has been successfully added.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding weight record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Calculate growth stats
  const growthStats = useMemo(() => {
    if (!weightHistory || weightHistory.length < 2) {
      return {
        averageGrowthRate: null,
        totalGrowth: null,
        recentGrowth: null,
      };
    }
    
    const sortedRecords = [...weightHistory].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstRecord = sortedRecords[0];
    const lastRecord = sortedRecords[sortedRecords.length - 1];
    const secondLastRecord = sortedRecords.length > 1 ? sortedRecords[sortedRecords.length - 2] : null;
    
    // Convert to common unit (lbs) for calculation
    const convertToLbs = (weight: number, unit: string) => {
      switch (unit.toLowerCase()) {
        case 'oz': return weight / 16;
        case 'kg': return weight * 2.20462;
        case 'g': return weight * 0.00220462;
        default: return weight; // Already in lbs
      }
    };
    
    const firstWeightLbs = convertToLbs(firstRecord.weight, firstRecord.weight_unit);
    const lastWeightLbs = convertToLbs(lastRecord.weight, lastRecord.weight_unit);
    
    const totalGrowth = lastWeightLbs - firstWeightLbs;
    const daysDiff = (new Date(lastRecord.date).getTime() - new Date(firstRecord.date).getTime()) / (1000 * 60 * 60 * 24);
    const averageGrowthRate = daysDiff > 0 ? totalGrowth / daysDiff : 0;
    
    let recentGrowth = null;
    if (secondLastRecord) {
      const secondLastWeightLbs = convertToLbs(secondLastRecord.weight, secondLastRecord.weight_unit);
      recentGrowth = lastWeightLbs - secondLastWeightLbs;
    }
    
    return {
      averageGrowthRate,
      totalGrowth,
      recentGrowth,
    };
  }, [weightHistory]);
  
  return {
    weightHistory,
    isLoading,
    error,
    refetch,
    addWeightRecord: addWeightMutation.mutate,
    isAdding: addWeightMutation.isPending,
    growthStats,
  };
};
