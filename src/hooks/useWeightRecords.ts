
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types';
import { handleSupabaseError, showErrorToast } from '@/utils/errorHandling';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

/**
 * Hook for fetching and managing weight records
 */
export const useWeightRecords = (dogId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch weight records with React Query
  const {
    data: weightRecords = [],
    isLoading,
    error,
    refetch: refreshWeightRecords
  } = useQuery({
    queryKey: ['weightRecords', dogId],
    queryFn: async (): Promise<WeightRecord[]> => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (error) {
        const appError = handleSupabaseError(error);
        showErrorToast(appError);
        throw appError;
      }
      
      return data as WeightRecord[] || [];
    },
    enabled: !!dogId,
  });
  
  // Add a new weight record
  const addWeightRecord = useMutation({
    mutationFn: async (record: Omit<WeightRecord, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('weight_records')
        .insert(record)
        .select()
        .single();
      
      if (error) {
        const appError = handleSupabaseError(error);
        showErrorToast(appError);
        throw appError;
      }
      
      return data as WeightRecord;
    },
    onSuccess: () => {
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({ queryKey: ['weightRecords', dogId] });
    }
  });
  
  // Delete a weight record
  const deleteWeightRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId);
      
      if (error) {
        const appError = handleSupabaseError(error);
        showErrorToast(appError);
        throw appError;
      }
      
      return recordId;
    },
    onSuccess: () => {
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({ queryKey: ['weightRecords', dogId] });
    }
  });
  
  return {
    weightRecords,
    isLoading,
    error,
    refreshWeightRecords,
    addWeightRecord: addWeightRecord.mutate,
    isAdding: addWeightRecord.isPending,
    deleteWeightRecord: deleteWeightRecord.mutate,
    isDeleting: deleteWeightRecord.isPending
  };
};
