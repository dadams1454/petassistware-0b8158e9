
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import type { WeightUnit } from '@/types/common';

interface UseWeightTrackingParams {
  dogId: string;
  puppyId?: string;
  onSuccess?: () => void;
}

export const useWeightTracking = ({ dogId, puppyId, onSuccess }: UseWeightTrackingParams) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation to add a weight record
  const { mutate: addWeight } = useMutation({
    mutationFn: async (weightData: Omit<WeightRecord, 'id' | 'created_at'>) => {
      setIsSubmitting(true);
      try {
        // Make sure we have the required fields
        const formattedDate = formatDateToYYYYMMDD(weightData.date);
        
        // Create the database record
        const { data, error } = await supabase
          .from('weight_records')
          .insert({
            dog_id: dogId,
            puppy_id: puppyId,
            weight: weightData.weight,
            weight_unit: weightData.weight_unit,
            date: formattedDate,
            notes: weightData.notes || ''
          })
          .select()
          .single();

        if (error) throw error;
        
        // Show success message
        toast({
          title: "Weight recorded",
          description: "Weight record has been successfully added."
        });
        
        // Call the success callback if provided
        if (onSuccess) onSuccess();
        
        return data as WeightRecord;
      } catch (error) {
        console.error('Error adding weight:', error);
        toast({
          title: "Error",
          description: "There was a problem saving the weight record.",
          variant: "destructive"
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetching
      queryClient.invalidateQueries({ queryKey: ['weight-records', dogId] });
      if (puppyId) {
        queryClient.invalidateQueries({ queryKey: ['puppy-weights', puppyId] });
      }
    }
  });

  // Mutation to update a weight record
  const { mutate: updateWeight } = useMutation({
    mutationFn: async (weightRecord: WeightRecord) => {
      setIsSubmitting(true);
      try {
        const formattedDate = formatDateToYYYYMMDD(weightRecord.date);
        
        const { data, error } = await supabase
          .from('weight_records')
          .update({
            weight: weightRecord.weight,
            weight_unit: weightRecord.weight_unit,
            date: formattedDate,
            notes: weightRecord.notes || ''
          })
          .eq('id', weightRecord.id)
          .select()
          .single();

        if (error) throw error;
        
        toast({
          title: "Weight updated",
          description: "Weight record has been successfully updated."
        });
        
        if (onSuccess) onSuccess();
        
        return data as WeightRecord;
      } catch (error) {
        console.error('Error updating weight:', error);
        toast({
          title: "Error",
          description: "There was a problem updating the weight record.",
          variant: "destructive"
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-records', dogId] });
      if (puppyId) {
        queryClient.invalidateQueries({ queryKey: ['puppy-weights', puppyId] });
      }
    }
  });

  // Mutation to delete a weight record
  const { mutate: deleteWeight } = useMutation({
    mutationFn: async (weightId: string) => {
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('weight_records')
          .delete()
          .eq('id', weightId);

        if (error) throw error;
        
        toast({
          title: "Weight deleted",
          description: "Weight record has been successfully deleted."
        });
        
        if (onSuccess) onSuccess();
        
        return weightId;
      } catch (error) {
        console.error('Error deleting weight:', error);
        toast({
          title: "Error",
          description: "There was a problem deleting the weight record.",
          variant: "destructive"
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-records', dogId] });
      if (puppyId) {
        queryClient.invalidateQueries({ queryKey: ['puppy-weights', puppyId] });
      }
    }
  });

  // Helper function to calculate growth stats
  const calculateGrowthStats = (weights: WeightRecord[]) => {
    if (!weights || weights.length === 0) {
      return {
        currentWeight: 0,
        weightUnit: 'lb' as WeightUnit,
        averageGrowth: 0,
        growthRate: 0,
        lastWeekGrowth: 0,
        projectedWeight: 0
      };
    }

    // Sort weights by date (newest first)
    const sortedWeights = [...weights].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestWeight = sortedWeights[0];
    const previousWeights = sortedWeights.slice(1);

    // Calculate average growth if we have multiple records
    let averageGrowth = 0;
    if (previousWeights.length > 0) {
      const growthValues = previousWeights.map((prev, index) => {
        const next = index === 0 ? latestWeight : previousWeights[index - 1];
        return next.weight - prev.weight;
      });
      
      averageGrowth = growthValues.reduce((sum, val) => sum + val, 0) / growthValues.length;
    }

    // Calculate growth rate (percentage)
    let growthRate = 0;
    if (previousWeights.length > 0) {
      const oldestWeight = sortedWeights[sortedWeights.length - 1];
      const totalGrowth = latestWeight.weight - oldestWeight.weight;
      growthRate = (totalGrowth / oldestWeight.weight) * 100;
    }

    // Estimate last week's growth
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const lastWeekWeight = sortedWeights.find(w => 
      new Date(w.date) <= oneWeekAgo
    );
    
    const lastWeekGrowth = lastWeekWeight 
      ? latestWeight.weight - lastWeekWeight.weight 
      : 0;

    // Project future weight (simple linear projection)
    const projectedWeight = latestWeight.weight + (averageGrowth * 4); // 4 weeks projection

    return {
      currentWeight: latestWeight.weight,
      weightUnit: latestWeight.weight_unit,
      averageGrowth,
      growthRate,
      lastWeekGrowth,
      projectedWeight
    };
  };

  return {
    isSubmitting,
    addWeight,
    updateWeight,
    deleteWeight,
    calculateGrowthStats
  };
};
