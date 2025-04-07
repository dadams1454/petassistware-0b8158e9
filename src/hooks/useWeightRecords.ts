
import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { WeightRecord } from '@/types';
import { handleSupabaseError, showErrorToast } from '@/utils/errorHandling';
import { getWeightRecords, addWeightRecord, deleteWeightRecord } from '@/services/weightService';

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
      
      try {
        return await getWeightRecords(dogId);
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    enabled: !!dogId,
  });
  
  // Add a new weight record
  const addMutation = useMutation({
    mutationFn: async (record: Omit<WeightRecord, 'id' | 'created_at'>) => {
      try {
        return await addWeightRecord(record);
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    onSuccess: () => {
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({ queryKey: ['weightRecords', dogId] });
    }
  });
  
  // Delete a weight record
  const deleteMutation = useMutation({
    mutationFn: async (recordId: string) => {
      try {
        await deleteWeightRecord(recordId);
        return recordId;
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
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
    addWeightRecord: addMutation.mutate,
    isAdding: addMutation.isPending,
    deleteWeightRecord: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};
