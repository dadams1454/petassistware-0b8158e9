
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/puppyTracking';
import { useToast } from '@/hooks/use-toast';

export const usePuppyWeights = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  
  // Fetch weight records
  const { data, isLoading, error } = useQuery({
    queryKey: ['puppy-weights', puppyId],
    queryFn: async () => {
      if (!puppyId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', puppyId) // Using dog_id column for puppy weights
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching puppy weights:', error);
        throw new Error(error.message);
      }
      
      return data || [];
    },
    enabled: !!puppyId
  });
  
  // Update local state when data changes
  useEffect(() => {
    if (data) {
      const formattedWeights = data.map(record => ({
        id: record.id,
        dog_id: record.dog_id,
        date: record.date,
        weight: record.weight,
        unit: record.weight_unit,
        weight_unit: record.weight_unit,
        notes: record.notes || '',
        created_at: record.created_at,
        percent_change: record.percent_change || null
      }));
      
      setWeights(formattedWeights);
    }
  }, [data]);
  
  // Add weight record
  const addWeightRecord = useMutation({
    mutationFn: async (weightData: {
      weight: number;
      weight_unit: string;
      date: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          dog_id: puppyId,
          weight: weightData.weight,
          weight_unit: weightData.weight_unit,
          date: weightData.date,
          notes: weightData.notes || null
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update puppy's current weight field
      await supabase
        .from('puppies')
        .update({
          current_weight: `${weightData.weight} ${weightData.weight_unit}`
        })
        .eq('id', puppyId);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-weights', puppyId] });
      queryClient.invalidateQueries({ queryKey: ['puppy', puppyId] });
      toast({
        title: 'Weight recorded',
        description: 'Weight has been successfully added'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Delete weight record
  const deleteWeightRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-weights', puppyId] });
      toast({
        title: 'Weight deleted',
        description: 'Weight record has been removed'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  return {
    weights,
    isLoading,
    error,
    addWeightRecord: addWeightRecord.mutate,
    deleteWeightRecord: deleteWeightRecord.mutate
  };
};
