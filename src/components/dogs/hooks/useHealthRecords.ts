
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum, stringToHealthRecordType } from '@/types/health';
import { toast } from '@/components/ui/use-toast';

export const useHealthRecords = (dogId: string) => {
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch health records
  const {
    data: healthRecords = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['healthRecords', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('visit_date', { ascending: false });

      if (error) throw error;

      // Map the raw data to HealthRecord type
      return (data || []).map(record => ({
        ...record,
        record_type: stringToHealthRecordType(record.record_type)
      } as HealthRecord));
    },
    enabled: !!dogId,
  });

  // Add health record mutation
  const addHealthRecord = useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id'>) => {
      if (!record.dog_id) {
        throw new Error('Dog ID is required');
      }

      if (!record.title) {
        throw new Error('Title is required');
      }

      const { data, error } = await supabase
        .from('health_records')
        .insert({
          dog_id: record.dog_id,
          record_type: record.record_type,
          title: record.title,
          visit_date: record.visit_date,
          vet_name: record.vet_name,
          record_notes: record.record_notes,
          next_due_date: record.next_due_date,
          document_url: record.document_url,
          ...record
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add health record: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update health record mutation
  const updateHealthRecord = useMutation({
    mutationFn: async (record: HealthRecord) => {
      if (!record.id) {
        throw new Error('Record ID is required');
      }

      const { data, error } = await supabase
        .from('health_records')
        .update({
          record_type: record.record_type,
          title: record.title,
          visit_date: record.visit_date,
          vet_name: record.vet_name,
          record_notes: record.record_notes,
          next_due_date: record.next_due_date,
          document_url: record.document_url,
          ...record
        })
        .eq('id', record.id)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update health record: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete health record mutation
  const deleteHealthRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      return recordId;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete health record: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter records by type
  useEffect(() => {
    if (healthRecords) {
      if (typeFilter) {
        setFilteredRecords(
          healthRecords.filter((record) => record.record_type === typeFilter)
        );
      } else {
        setFilteredRecords(healthRecords);
      }
    }
  }, [healthRecords, typeFilter]);

  // Get vaccinations that have a next_due_date
  const upcomingVaccinations = healthRecords.filter(
    (record) => 
      record.record_type === HealthRecordTypeEnum.Vaccination && 
      record.next_due_date && 
      new Date(record.next_due_date) > new Date()
  ).sort((a, b) => 
    new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime()
  );

  // Select a record by ID
  const selectRecordById = useCallback(
    (id: string) => {
      const record = healthRecords.find((r) => r.id === id);
      setSelectedRecord(record || null);
      return record;
    },
    [healthRecords]
  );

  return {
    dogId,
    healthRecords,
    selectedRecord,
    isLoading,
    isLoadingRecord: isLoading && selectedRecord !== null,
    isError,
    error,
    filteredRecords,
    typeFilter,
    refetch,
    setSelectedRecord,
    selectRecordById,
    setTypeFilter,
    addHealthRecord: addHealthRecord.mutateAsync,
    updateHealthRecord: updateHealthRecord.mutateAsync,
    deleteHealthRecord: deleteHealthRecord.mutateAsync,
    isAdding: addHealthRecord.isPending,
    isUpdating: updateHealthRecord.isPending,
    isDeleting: deleteHealthRecord.isPending,
    upcomingVaccinations,
  };
};
