
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WeightRecord } from '@/types';
import { WeightUnit } from '@/types/weight-units';
import { calculatePercentChange } from '@/components/litters/puppies/weight/weightUnits';
import { handleSupabaseError, showErrorToast } from '@/utils/errorHandling';
import { getPuppyWeightRecords, addPuppyWeightRecord, deleteWeightRecord } from '@/services/weightService';

export const usePuppyWeightRecords = (puppyId: string, birthDate?: string) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const queryClient = useQueryClient();

  // Fetch weight records
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['puppyWeightRecords', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];
      
      try {
        const records = await getPuppyWeightRecords(puppyId);
        setWeightRecords(records);
        return records;
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    enabled: !!puppyId
  });

  // Add a weight record
  const addWeightRecord = useMutation({
    mutationFn: async (record: Omit<WeightRecord, 'id' | 'created_at'>) => {
      try {
        // Calculate percent change based on previous weight if available
        let percentChange: number | undefined = undefined;
        if (weightRecords.length > 0) {
          const prevRecord = weightRecords[0]; // Most recent record
          percentChange = calculatePercentChange(prevRecord.weight, record.weight);
        }

        // Calculate age in days if birth date is provided
        let ageDays: number | undefined = undefined;
        if (birthDate && record.date) {
          const birthDateObj = new Date(birthDate);
          const recordDateObj = new Date(record.date);
          const diffTime = Math.abs(recordDateObj.getTime() - birthDateObj.getTime());
          ageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Add the record
        const newRecord = await addPuppyWeightRecord({
          ...record,
          puppy_id: puppyId,
          percent_change: percentChange,
          age_days: ageDays,
          birth_date: birthDate
        });

        // Update local state
        setWeightRecords(prev => [newRecord, ...prev]);
        
        return newRecord;
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyWeightRecords', puppyId] });
    }
  });

  // Delete a weight record
  const deleteWeightRecordMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteWeightRecord(id);
        return id;
      } catch (error) {
        const appError = handleSupabaseError(error as Error);
        showErrorToast(appError);
        throw appError;
      }
    },
    onSuccess: (id) => {
      // Update local state
      setWeightRecords(prev => prev.filter(record => record.id !== id));
      queryClient.invalidateQueries({ queryKey: ['puppyWeightRecords', puppyId] });
    }
  });

  return {
    weightRecords: data || [],
    isLoading,
    error,
    refetch,
    addWeightRecord: addWeightRecord.mutateAsync,
    isAddingWeight: addWeightRecord.isPending,
    deleteWeightRecord: deleteWeightRecordMutation.mutateAsync,
    isDeletingWeight: deleteWeightRecordMutation.isPending
  };
};
