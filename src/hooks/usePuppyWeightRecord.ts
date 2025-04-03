
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { standardizeWeightUnit, WeightUnit } from '@/types/common';

export const usePuppyWeightRecord = (puppyId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const addWeightMutation = useMutation({
    mutationFn: async (weightData: {
      weight: number;
      weight_unit: WeightUnit;
      date: string;
      notes?: string;
    }) => {
      setIsSubmitting(true);
      
      try {
        const standardUnit = standardizeWeightUnit(weightData.weight_unit);
        
        // Add weight record - we need to provide both dog_id and puppy_id
        // The weight_records table uses dog_id field for both dogs and puppies
        const { data, error } = await supabase
          .from('weight_records')
          .insert({
            dog_id: puppyId, // Required field - use puppy_id as dog_id
            puppy_id: puppyId, // Track specifically that this is a puppy
            weight: weightData.weight,
            weight_unit: standardUnit,
            unit: standardUnit, // Add unit field for compatibility
            date: weightData.date,
            notes: weightData.notes || null
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update puppy's current weight
        await supabase
          .from('puppies')
          .update({ 
            current_weight: `${weightData.weight} ${standardUnit}`
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
    weight_unit: WeightUnit;
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
