
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePuppyWeightRecord = (puppyId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const addWeightMutation = useMutation({
    mutationFn: async (weightData: {
      weight: number;
      weight_unit: string;
      date: string;
      notes?: string;
    }) => {
      setIsSubmitting(true);
      
      try {
        // Add weight record - using dog_id field for puppy weight records
        const { data, error } = await supabase
          .from('weight_records')
          .insert({
            dog_id: puppyId, // Using dog_id instead of puppy_id as per the schema
            weight: weightData.weight,
            weight_unit: weightData.weight_unit,
            date: weightData.date,
            notes: weightData.notes
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update puppy's current weight
        await supabase
          .from('puppies')
          .update({ 
            current_weight: `${weightData.weight} ${weightData.weight_unit}`
          })
          .eq('id', puppyId);
        
        // Show success message
        toast({
          title: "Weight recorded",
          description: "The puppy's weight has been successfully recorded"
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['puppy-weights', puppyId] });
        queryClient.invalidateQueries({ queryKey: ['puppy-detail', puppyId] });
        
        return data;
      } catch (error: any) {
        console.error('Error adding weight record:', error);
        
        // Show error message
        toast({
          title: "Error",
          description: error.message || "Failed to record weight",
          variant: "destructive"
        });
        
        return null;
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  
  const addWeightRecord = async (data: {
    weight: number;
    weight_unit: string;
    date: string;
    notes?: string;
  }) => {
    const result = await addWeightMutation.mutateAsync(data);
    return !!result;
  };
  
  return {
    addWeightRecord,
    isSubmitting
  };
};
