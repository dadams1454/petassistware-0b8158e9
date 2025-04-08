
/**
 * Hook for fetching and manipulating weight records within the health module
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '../types';
import { toast } from '@/components/ui/use-toast';

// Options for the hook
interface WeightRecordOptions {
  dogId?: string;
  puppyId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Hook to fetch, add, update, and delete weight records
 * This is the canonical implementation within the health module
 * 
 * @param options Options for filtering weight records
 * @returns Weight records and CRUD operations
 */
export const useWeightRecords = (options: WeightRecordOptions = {}) => {
  const { dogId, puppyId, startDate, endDate, limit } = options;
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const queryClient = useQueryClient();
  
  // Build the base query
  const buildQuery = () => {
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
    
    // Order by date (most recent first)
    query = query.order('date', { ascending: false });
    
    // Apply limit if specified
    if (limit) {
      query = query.limit(limit);
    }
    
    return query;
  };
  
  // Fetch weight records
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['weightRecords', dogId, puppyId, startDate, endDate, limit],
    queryFn: async () => {
      const query = buildQuery();
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching weight records:', error);
        throw error;
      }
      
      // Map to WeightRecord type
      const records: WeightRecord[] = data.map(record => ({
        id: record.id,
        dog_id: record.dog_id || undefined,
        puppy_id: record.puppy_id || undefined,
        weight: record.weight,
        weight_unit: record.weight_unit,
        date: record.date,
        notes: record.notes || undefined,
        percent_change: record.percent_change || undefined,
        created_at: record.created_at,
        age_days: record.age_days || undefined,
        birth_date: record.birth_date || undefined
      }));
      
      setWeightRecords(records);
      return records;
    }
  });
  
  // Add weight record mutation
  const { mutate: addWeightRecord, isLoading: isAdding } = useMutation({
    mutationFn: async (data: Omit<WeightRecord, 'id' | 'created_at'>) => {
      const { data: newRecord, error } = await supabase
        .from('weight_records')
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding weight record:', error);
        throw error;
      }
      
      return newRecord;
    },
    onSuccess: (newRecord) => {
      // Add the new record to the state
      setWeightRecords(prev => [newRecord, ...prev]);
      
      // Invalidate weight records query
      queryClient.invalidateQueries({
        queryKey: ['weightRecords', dogId, puppyId]
      });
      
      toast({
        title: 'Weight record added',
        description: 'New weight record has been successfully added.',
      });
    },
    onError: (error) => {
      console.error('Failed to add weight record:', error);
      toast({
        title: 'Failed to add weight record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update weight record mutation
  const { mutate: updateWeightRecord, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: Partial<WeightRecord> & { id: string }) => {
      const { id, ...updateData } = data;
      
      const { data: updatedRecord, error } = await supabase
        .from('weight_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating weight record:', error);
        throw error;
      }
      
      return updatedRecord;
    },
    onSuccess: (updatedRecord) => {
      // Update the record in the state
      setWeightRecords(prev => prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      ));
      
      // Invalidate weight records query
      queryClient.invalidateQueries({
        queryKey: ['weightRecords', dogId, puppyId]
      });
      
      toast({
        title: 'Weight record updated',
        description: 'Weight record has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update weight record:', error);
      toast({
        title: 'Failed to update weight record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Delete weight record mutation
  const { mutate: deleteWeightRecord, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting weight record:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: (id) => {
      // Remove the record from the state
      setWeightRecords(prev => prev.filter(record => record.id !== id));
      
      // Invalidate weight records query
      queryClient.invalidateQueries({
        queryKey: ['weightRecords', dogId, puppyId]
      });
      
      toast({
        title: 'Weight record deleted',
        description: 'Weight record has been successfully deleted.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete weight record:', error);
      toast({
        title: 'Failed to delete weight record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Calculate average weight
  const calculateAverageWeight = () => {
    if (weightRecords.length === 0) return null;
    
    // Since weights may be in different units, we can't simply average them
    // For now, just return the latest weight
    return weightRecords[0];
  };
  
  // Function to manually refresh weight records
  const refreshWeightRecords = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing weight records:', error);
    }
  };
  
  // Get the latest weight record
  const getLatestWeight = () => {
    if (weightRecords.length === 0) return null;
    return weightRecords[0];
  };
  
  return {
    weightRecords,
    isLoading,
    error,
    refreshWeightRecords,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    isAdding,
    isUpdating,
    isDeleting,
    calculateAverageWeight,
    getLatestWeight
  };
};
