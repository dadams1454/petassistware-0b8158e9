
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { HealthRecord, HealthRecordOptions, HealthRecordType } from '../types';
import { mapHealthRecordFromDB, mapHealthRecordToDB } from '@/lib/mappers/healthMapper';
import { stringToHealthRecordType } from '@/types/health-enums';

/**
 * Hook for managing health records for a dog or puppy
 */
export const useHealthRecords = (options: HealthRecordOptions = {}) => {
  const { dogId, puppyId, recordType, startDate, endDate } = options;
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const queryClient = useQueryClient();

  const queryKey = ['healthRecords', dogId, puppyId, recordType, startDate, endDate];

  // Fetch health records
  const {
    data: healthRecords = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        let query = supabase
          .from('health_records')
          .select('*');

        // Apply filters
        if (dogId) {
          query = query.eq('dog_id', dogId);
        }
        
        if (puppyId) {
          query = query.eq('puppy_id', puppyId);
        }
        
        if (recordType) {
          query = query.eq('record_type', recordType);
        }
        
        if (startDate) {
          query = query.gte('visit_date', startDate);
        }
        
        if (endDate) {
          query = query.lte('visit_date', endDate);
        }

        // Order by date descending
        query = query.order('visit_date', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Map the raw data to HealthRecord type
        return (data || []).map(record => mapHealthRecordFromDB(record));
      } catch (err) {
        console.error('Error fetching health records:', err);
        throw err;
      }
    },
    enabled: !!(dogId || puppyId),
  });

  // Add health record mutation
  const addHealthRecord = useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id'>) => {
      try {
        // Ensure required fields are present
        if (!record.dog_id && !record.puppy_id) {
          throw new Error('Either dog_id or puppy_id is required');
        }

        // Map the record for inserting into the database
        const dbRecord = mapHealthRecordToDB(record);

        const { data, error } = await supabase
          .from('health_records')
          .insert(dbRecord)
          .select();

        if (error) throw error;
        
        return mapHealthRecordFromDB(data[0]);
      } catch (err) {
        console.error('Error adding health record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Health record added',
        description: 'The health record has been successfully added.'
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add health record: ${error.message}`,
        variant: 'destructive'
      });
    },
  });

  // Update health record mutation
  const updateHealthRecord = useMutation({
    mutationFn: async ({ id, ...updates }: HealthRecord) => {
      try {
        // Map the record for updating in the database
        const dbUpdates = mapHealthRecordToDB(updates);

        const { data, error } = await supabase
          .from('health_records')
          .update(dbUpdates)
          .eq('id', id)
          .select();

        if (error) throw error;
        
        return mapHealthRecordFromDB(data[0]);
      } catch (err) {
        console.error('Error updating health record:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Health record updated',
        description: 'The health record has been successfully updated.'
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update health record: ${error.message}`,
        variant: 'destructive'
      });
    },
  });

  // Delete health record mutation
  const deleteHealthRecord = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('health_records')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        return id;
      } catch (err) {
        console.error('Error deleting health record:', err);
        throw err;
      }
    },
    onSuccess: (id) => {
      toast({
        title: 'Health record deleted',
        description: 'The health record has been successfully deleted.'
      });
      
      // Remove the record from selected if it was deleted
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(null);
      }
      
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete health record: ${error.message}`,
        variant: 'destructive'
      });
    },
  });

  // Utility functions for accessing specific record types
  const getRecordsByType = useCallback((type: HealthRecordType) => {
    return healthRecords.filter(record => 
      record.record_type === type || stringToHealthRecordType(record.record_type) === type
    );
  }, [healthRecords]);

  // Return vaccinations
  const vaccinationRecords = getRecordsByType('vaccination');
  
  // Return examinations
  const examinationRecords = getRecordsByType('examination');
  
  // Return medications
  const medicationRecords = getRecordsByType('medication');
  
  // Find upcoming vaccinations
  const upcomingVaccinations = vaccinationRecords
    .filter(record => record.next_due_date && new Date(record.next_due_date) > new Date())
    .sort((a, b) => {
      const dateA = new Date(a.next_due_date || '');
      const dateB = new Date(b.next_due_date || '');
      return dateA.getTime() - dateB.getTime();
    });

  return {
    healthRecords,
    selectedRecord,
    setSelectedRecord,
    isLoading,
    isError,
    error,
    refetch,
    addHealthRecord: addHealthRecord.mutateAsync,
    updateHealthRecord: updateHealthRecord.mutateAsync,
    deleteHealthRecord: deleteHealthRecord.mutateAsync,
    isAdding: addHealthRecord.isPending,
    isUpdating: updateHealthRecord.isPending,
    isDeleting: deleteHealthRecord.isPending,
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    upcomingVaccinations,
    getRecordsByType
  };
};
