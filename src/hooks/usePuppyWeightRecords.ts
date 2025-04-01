
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePuppyWeightRecords = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch weight records
  const { data: weightRecords, isLoading, error } = useQuery({
    queryKey: ['puppyWeightRecords', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];
      
      // First get the puppy to find birth date
      const { data: puppy, error: puppyError } = await supabase
        .from('puppies')
        .select('birth_date, litter_id, litter:litter_id(birth_date)')
        .eq('id', puppyId)
        .single();
      
      if (puppyError) throw puppyError;
      
      const birthDate = puppy.birth_date || puppy.litter?.birth_date;
      
      // Then get weight records
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Add birth date for calculating age
      return data.map(record => ({
        ...record,
        birth_date: birthDate
      }));
    },
    enabled: !!puppyId
  });
  
  // Add weight record
  const addWeightRecord = useMutation({
    mutationFn: async (record: any) => {
      // Calculate percentage change if there are previous records
      let percentChange = null;
      if (weightRecords && weightRecords.length > 0) {
        const lastRecord = weightRecords[weightRecords.length - 1];
        
        // Convert weights to the same unit if they're different
        const prevWeight = lastRecord.weight;
        const prevUnit = lastRecord.weight_unit;
        const newWeight = record.weight;
        const newUnit = record.weight_unit;
        
        let normalizedPrevWeight = prevWeight;
        let normalizedNewWeight = newWeight;
        
        // Normalize to the current unit for comparison
        if (prevUnit !== newUnit) {
          // Convert to standard unit (grams) then to target unit
          if (prevUnit === 'oz') normalizedPrevWeight = prevWeight * 28.35;
          if (prevUnit === 'g') normalizedPrevWeight = prevWeight;
          if (prevUnit === 'lbs') normalizedPrevWeight = prevWeight * 453.59;
          if (prevUnit === 'kg') normalizedPrevWeight = prevWeight * 1000;
          
          if (newUnit === 'oz') normalizedPrevWeight = normalizedPrevWeight / 28.35;
          if (newUnit === 'g') normalizedPrevWeight = normalizedPrevWeight;
          if (newUnit === 'lbs') normalizedPrevWeight = normalizedPrevWeight / 453.59;
          if (newUnit === 'kg') normalizedPrevWeight = normalizedPrevWeight / 1000;
        }
        
        percentChange = ((normalizedNewWeight - normalizedPrevWeight) / normalizedPrevWeight) * 100;
      }
      
      // Build the record with the percentage change
      const newRecord = {
        ...record,
        percent_change: percentChange
      };
      
      const { data, error } = await supabase
        .from('weight_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      // Also update the puppy's current weight
      await supabase
        .from('puppies')
        .update({ 
          current_weight: record.weight.toString(), 
        })
        .eq('id', puppyId);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyWeightRecords', puppyId] });
      queryClient.invalidateQueries({ queryKey: ['puppy', puppyId] });
      toast({
        title: 'Weight record added',
        description: 'The weight record has been added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding weight record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Delete weight record
  const deleteWeightRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      // If we deleted the last record, update the puppy's current weight to the previous record
      const remainingRecords = weightRecords?.filter(record => record.id !== recordId) || [];
      if (remainingRecords.length > 0) {
        const lastRecord = remainingRecords[remainingRecords.length - 1];
        await supabase
          .from('puppies')
          .update({ 
            current_weight: lastRecord.weight.toString(), 
          })
          .eq('id', puppyId);
      }
      
      return recordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyWeightRecords', puppyId] });
      queryClient.invalidateQueries({ queryKey: ['puppy', puppyId] });
      toast({
        title: 'Weight record deleted',
        description: 'The weight record has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting weight record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  return {
    weightRecords,
    isLoading,
    error,
    addWeightRecord: addWeightRecord.mutate,
    deleteWeightRecord: deleteWeightRecord.mutate,
    isAddingWeight: addWeightRecord.isPending,
    isDeletingWeight: deleteWeightRecord.isPending
  };
};
