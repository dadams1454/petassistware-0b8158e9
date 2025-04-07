
/**
 * Hook for fetching and managing weight records
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { WeightRecord, WeightRecordOptions } from '../types';
import { calculatePercentChange } from '@/utils/weightConversion';

/**
 * Hook to fetch and manage weight records
 * 
 * @param {WeightRecordOptions} options Options for filtering weight records
 * @returns {Object} Weight records data and operations
 */
export const useWeightRecords = (options: WeightRecordOptions = {}) => {
  const queryClient = useQueryClient();
  const { dogId, puppyId, startDate, endDate, limit } = options;
  
  // Build the query key based on provided options
  const queryKey = ['weightRecords', dogId, puppyId, startDate, endDate, limit];
  
  // Fetch weight records
  const {
    data: weightRecords = [],
    isLoading,
    error,
    refetch: fetchWeightHistory
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<WeightRecord[]> => {
      try {
        // Create a base query
        let query = supabase
          .from('weight_records')
          .select('*');
        
        // Apply filters
        if (dogId) {
          query = query.eq('dog_id', dogId);
        }
        
        if (puppyId) {
          query = query.eq('puppy_id', puppyId);
        }
        
        if (startDate) {
          query = query.gte('date', startDate);
        }
        
        if (endDate) {
          query = query.lte('date', endDate);
        }
        
        // Apply ordering and limits
        query = query.order('date', { ascending: false });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data as WeightRecord[];
      } catch (error) {
        console.error('Error fetching weight records:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch weight records',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: !!(dogId || puppyId) // Only run the query if either dogId or puppyId is provided
  });

  // Add a weight record
  const addWeightRecord = useMutation({
    mutationFn: async (record: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change'>) => {
      try {
        // Calculate percent change if there are previous records
        let percentChange: number | null = null;
        
        if (weightRecords.length > 0) {
          const lastRecord = weightRecords[0]; // The most recent record
          
          // Only calculate if units match or after conversion
          if (lastRecord.weight_unit === record.weight_unit) {
            percentChange = calculatePercentChange(lastRecord.weight, record.weight);
          } else {
            // We'd need to convert units first for accurate calculation
            // This is simplified - in a real app, you'd use a proper conversion function
            console.log('Units do not match, skipping percent change calculation');
          }
        }
        
        const { data, error } = await supabase
          .from('weight_records')
          .insert({
            ...record,
            percent_change: percentChange
          })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data as WeightRecord;
      } catch (error) {
        console.error('Error adding weight record:', error);
        toast({
          title: 'Error',
          description: 'Failed to add weight record',
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Weight record added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
    }
  });
  
  // Update a weight record
  const updateWeightRecord = useMutation({
    mutationFn: async ({ id, ...record }: WeightRecord) => {
      try {
        const { data, error } = await supabase
          .from('weight_records')
          .update(record)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data as WeightRecord;
      } catch (error) {
        console.error('Error updating weight record:', error);
        toast({
          title: 'Error',
          description: 'Failed to update weight record',
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Weight record updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
    }
  });
  
  // Delete a weight record
  const deleteWeightRecord = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('weight_records')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        return id;
      } catch (error) {
        console.error('Error deleting weight record:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete weight record',
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Weight record deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
    }
  });

  return {
    weightRecords,
    isLoading,
    error,
    fetchWeightHistory,
    addWeightRecord: addWeightRecord.mutate,
    updateWeightRecord: updateWeightRecord.mutate,
    deleteWeightRecord: deleteWeightRecord.mutate,
    isAdding: addWeightRecord.isPending,
    isUpdating: updateWeightRecord.isPending,
    isDeleting: deleteWeightRecord.isPending
  };
};
