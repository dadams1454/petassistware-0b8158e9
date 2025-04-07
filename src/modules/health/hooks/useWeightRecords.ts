
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { WeightRecord } from '../types';
import { 
  calculatePercentChange, 
  convertWeightToGrams, 
  getWeightUnitInfo 
} from '@/utils/weightConversion';

/**
 * Hook for managing weight records for a dog or puppy
 */
export const useWeightRecords = (options: { dogId?: string; puppyId?: string } = {}) => {
  const { dogId, puppyId } = options;
  const queryClient = useQueryClient();
  
  // Ensure we have either a dog ID or puppy ID
  const entityId = dogId || puppyId;
  const entityType = dogId ? 'dog_id' : 'puppy_id';
  
  const queryKey = ['weightRecords', dogId, puppyId];

  // Fetch weight records
  const {
    data: weightRecords = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        if (!entityId) return [];
        
        const { data, error } = await supabase
          .from('weight_records')
          .select('*')
          .eq(entityType, entityId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        const records = data || [];
        
        // Calculate percent change for each record
        const recordsWithPercentChange = records.map((record, index, arr) => {
          // Skip the first record (most recent) as we can't calculate change
          if (index === 0) return record;
          
          const currentWeight = record.weight;
          const previousWeight = arr[index - 1].weight;
          
          // Convert weights to the same unit (grams) for accurate comparison
          const currentWeightInGrams = convertWeightToGrams(currentWeight, record.weight_unit);
          const previousWeightInGrams = convertWeightToGrams(previousWeight, arr[index - 1].weight_unit);
          
          // Calculate percent change
          const percentChange = calculatePercentChange(previousWeightInGrams, currentWeightInGrams);
          
          return {
            ...record,
            percent_change: percentChange
          };
        });
        
        return recordsWithPercentChange as WeightRecord[];
      } catch (err) {
        console.error('Error fetching weight records:', err);
        throw err;
      }
    },
    enabled: !!entityId,
  });

  // Add weight record mutation
  const addWeightRecord = useMutation({
    mutationFn: async (record: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change'>) => {
      try {
        if (!record[entityType]) {
          throw new Error(`${entityType} is required`);
        }

        const { data, error } = await supabase
          .from('weight_records')
          .insert(record)
          .select();

        if (error) throw error;
        
        return data[0] as WeightRecord;
      } catch (err) {
        console.error('Error adding weight record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Weight record added',
        description: 'The weight record has been successfully added.'
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add weight record: ${error.message}`,
        variant: 'destructive'
      });
    },
  });

  // Update weight record mutation
  const updateWeightRecord = useMutation({
    mutationFn: async ({ id, ...updates }: WeightRecord) => {
      try {
        const { data, error } = await supabase
          .from('weight_records')
          .update(updates)
          .eq('id', id)
          .select();

        if (error) throw error;
        
        return data[0] as WeightRecord;
      } catch (err) {
        console.error('Error updating weight record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Weight record updated',
        description: 'The weight record has been successfully updated.'
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update weight record: ${error.message}`,
        variant: 'destructive'
      });
    },
  });

  // Delete weight record mutation
  const deleteWeightRecord = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('weight_records')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        return id;
      } catch (err) {
        console.error('Error deleting weight record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Weight record deleted',
        description: 'The weight record has been successfully deleted.'
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete weight record: ${error.message}`,
        variant: 'destructive'
      });
    },
  });

  // Calculate growth statistics
  const getGrowthStats = useCallback(() => {
    if (!weightRecords.length) {
      return {
        percentChange: 0,
        averageGrowthRate: 0,
        projectedWeight: 0,
        weightGoal: 0,
        onTrack: false,
      };
    }

    const sortedRecords = [...weightRecords].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const oldestRecord = sortedRecords[0];
    const newestRecord = sortedRecords[sortedRecords.length - 1];
    
    // Convert weights to the same unit (grams) for accurate comparison
    const oldestWeightInGrams = convertWeightToGrams(oldestRecord.weight, oldestRecord.weight_unit);
    const newestWeightInGrams = convertWeightToGrams(newestRecord.weight, newestRecord.weight_unit);
    
    // Calculate overall percent change
    const percentChange = calculatePercentChange(oldestWeightInGrams, newestWeightInGrams);
    
    // Calculate average growth rate
    const daysDiff = Math.max(1, (new Date(newestRecord.date).getTime() - new Date(oldestRecord.date).getTime()) / (1000 * 60 * 60 * 24));
    const growthPerDay = (newestWeightInGrams - oldestWeightInGrams) / daysDiff;
    const averageGrowthRate = growthPerDay / oldestWeightInGrams * 100;
    
    // Project future weight (30 days from latest weight)
    const projectedWeight = newestWeightInGrams + (growthPerDay * 30);
    
    // Placeholder for weight goal (would normally be set by user or calculated based on breed standard)
    const weightGoal = newestWeightInGrams * 1.2; // 20% more than current weight
    
    // Check if on track to meet goal
    const onTrack = projectedWeight >= weightGoal;
    
    // Convert projected weight back to original unit
    const unitInfo = getWeightUnitInfo(newestRecord.weight_unit);
    const conversionFactor = unitInfo?.gramsPerUnit || 1;
    const projectedWeightInOriginalUnit = projectedWeight / conversionFactor;
    
    return {
      percentChange,
      averageGrowthRate,
      projectedWeight: projectedWeightInOriginalUnit,
      weightGoal: weightGoal / conversionFactor,
      onTrack,
      // Add current weight info
      currentWeight: {
        value: newestRecord.weight,
        unit: newestRecord.weight_unit,
        date: newestRecord.date
      }
    };
  }, [weightRecords]);

  // Get the latest weight record
  const getLatestWeight = useCallback(() => {
    if (!weightRecords.length) return null;
    
    return weightRecords[0]; // Records are already sorted by date descending
  }, [weightRecords]);

  return {
    weightRecords,
    isLoading,
    isError,
    error,
    refetch,
    addWeightRecord: addWeightRecord.mutateAsync,
    updateWeightRecord: updateWeightRecord.mutateAsync,
    deleteWeightRecord: deleteWeightRecord.mutateAsync,
    isAdding: addWeightRecord.isPending,
    isUpdating: updateWeightRecord.isPending,
    isDeleting: deleteWeightRecord.isPending,
    getGrowthStats,
    getLatestWeight
  };
};
