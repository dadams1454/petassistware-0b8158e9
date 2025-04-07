
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WeightRecord } from '@/types/weight';
import { supabase } from '@/integrations/supabase/client';
import { mapWeightRecordFromDB, mapWeightRecordToDB } from '@/lib/mappers/weightMapper';
import { useToast } from '@/components/ui/use-toast';
import { differenceInDays } from 'date-fns';

interface UseWeightDataProps {
  puppyId?: string;
  dogId?: string;
}

export const useWeightData = ({ puppyId, dogId }: UseWeightDataProps) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query key for weight history
  const weightQueryKey = puppyId 
    ? ['puppyWeightHistory', puppyId] 
    : ['dogWeightHistory', dogId];

  // Fetch weight history
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: weightQueryKey,
    queryFn: async () => {
      let query = supabase.from('weights')
        .select('*')
        .order('date', { ascending: false });

      if (puppyId) {
        query = query.eq('puppy_id', puppyId);
      } else if (dogId) {
        query = query.eq('dog_id', dogId);
      } else {
        throw new Error('Either puppyId or dogId must be provided');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map(mapWeightRecordFromDB);
    },
    enabled: !!(puppyId || dogId)
  });

  // Add weight mutation
  const addWeightMutation = useMutation({
    mutationFn: async (weightData: Partial<WeightRecord>) => {
      // If a birth date is provided and not age_days, calculate age_days
      if (weightData.birth_date && !weightData.age_days && weightData.date) {
        const birthDate = new Date(weightData.birth_date);
        const recordDate = new Date(weightData.date);
        
        weightData.age_days = differenceInDays(recordDate, birthDate);
      }
      
      // Set the correct id field based on whether this is for a dog or puppy
      const dbRecord = mapWeightRecordToDB(weightData);
      
      const { data, error } = await supabase
        .from('weights')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapWeightRecordFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weightQueryKey });
      toast({
        title: 'Weight added',
        description: 'Weight record has been successfully saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding weight',
        description: error.message || 'Failed to save weight record.',
        variant: 'destructive',
      });
    },
  });

  // Delete weight mutation
  const deleteWeightMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weights')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weightQueryKey });
      toast({
        title: 'Weight deleted',
        description: 'Weight record has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting weight',
        description: error.message || 'Failed to delete weight record.',
        variant: 'destructive',
      });
    },
  });

  // Update weight records when data changes
  useEffect(() => {
    if (data) {
      setWeightRecords(data);
    }
  }, [data]);

  return {
    weightRecords,
    isLoading,
    error,
    fetchWeightHistory: refetch,
    addWeight: addWeightMutation.mutateAsync,
    deleteWeight: deleteWeightMutation.mutateAsync,
    isAdding: addWeightMutation.isPending,
    isDeleting: deleteWeightMutation.isPending,
  };
};
