
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { 
  getHealthRecords,
  addHealthRecord,
  updateHealthRecord,
  deleteHealthRecord 
} from '@/services/healthService';
import { HealthRecord } from '@/types';
import { handleSupabaseError, showErrorToast } from '@/utils/errorHandling';

export const useHealthRecords = (dogId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch health records
  const {
    data: healthRecords = [],
    isLoading,
    error,
    refetch: refreshHealthRecords
  } = useQuery({
    queryKey: ['healthRecords', dogId],
    queryFn: async () => {
      try {
        return await getHealthRecords(dogId);
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    enabled: !!dogId,
  });
  
  // Add a health record
  const addRecord = useMutation({
    mutationFn: async (record: Partial<HealthRecord>) => {
      try {
        return await addHealthRecord(record);
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
    }
  });
  
  // Update a health record
  const updateRecord = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<HealthRecord> }) => {
      try {
        return await updateHealthRecord(id, updates);
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
    }
  });
  
  // Delete a health record
  const deleteRecord = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteHealthRecord(id);
        return id;
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
    }
  });
  
  return {
    healthRecords,
    isLoading,
    error,
    refreshHealthRecords,
    addHealthRecord: addRecord.mutate,
    isAdding: addRecord.isPending,
    updateHealthRecord: updateRecord.mutate,
    isUpdating: updateRecord.isPending,
    deleteHealthRecord: deleteRecord.mutate,
    isDeleting: deleteRecord.isPending
  };
};
