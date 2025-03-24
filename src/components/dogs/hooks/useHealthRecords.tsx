
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord } from '../types/healthRecord';

export const useHealthRecords = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  // Fetch health records for a specific dog
  const {
    data: healthRecords,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dogHealthRecords', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('visit_date', { ascending: false });
      
      if (error) {
        toast({
          title: 'Error fetching health records',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as HealthRecord[];
    },
    enabled: !!dogId,
  });

  // Add a new health record
  const addHealthRecordMutation = useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('health_records')
        .insert([{ ...record, dog_id: dogId }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogHealthRecords', dogId] });
      toast({
        title: 'Record added',
        description: 'Health record has been added successfully',
      });
      setIsAddingRecord(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update an existing health record
  const updateHealthRecordMutation = useMutation({
    mutationFn: async (record: HealthRecord) => {
      const { data, error } = await supabase
        .from('health_records')
        .update(record)
        .eq('id', record.id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogHealthRecords', dogId] });
      toast({
        title: 'Record updated',
        description: 'Health record has been updated successfully',
      });
      setSelectedRecord(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a health record
  const deleteHealthRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      return recordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogHealthRecords', dogId] });
      toast({
        title: 'Record deleted',
        description: 'Health record has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Helper function to get records by type
  const getRecordsByType = (type: HealthRecord['record_type']) => {
    return healthRecords?.filter(record => record.record_type === type) || [];
  };

  return {
    healthRecords,
    isLoading,
    error,
    refetch,
    isAddingRecord,
    setIsAddingRecord,
    selectedRecord,
    setSelectedRecord,
    getRecordsByType,
    addHealthRecord: (record: Omit<HealthRecord, 'id' | 'created_at'>) => addHealthRecordMutation.mutate(record),
    updateHealthRecord: (record: HealthRecord) => updateHealthRecordMutation.mutate(record),
    deleteHealthRecord: (recordId: string) => deleteHealthRecordMutation.mutate(recordId),
  };
};
