
/**
 * Hook for fetching and managing health records
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { HealthRecord, HealthRecordOptions, HealthRecordType } from '../types';

/**
 * Hook for fetching and managing health records
 * 
 * @param {HealthRecordOptions} options Options for filtering health records
 * @returns {Object} Health records data and operations
 */
export const useHealthRecords = (options: HealthRecordOptions = {}) => {
  const queryClient = useQueryClient();
  const { dogId, puppyId, recordType, startDate, endDate, includeArchived = false } = options;
  
  // Build the query key based on provided options
  const queryKey = ['healthRecords', dogId, puppyId, recordType, startDate, endDate, includeArchived];
  
  // Fetch health records
  const {
    data: healthRecords = [],
    isLoading,
    error,
    refetch: refreshHealthRecords
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<HealthRecord[]> => {
      try {
        // Create a base query
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
          query = query.gte('date', startDate);
        }
        
        if (endDate) {
          query = query.lte('date', endDate);
        }
        
        // Execute the query
        const { data, error } = await query.order('date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data as HealthRecord[];
      } catch (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch health records',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: !!(dogId || puppyId) // Only run the query if either dogId or puppyId is provided
  });

  // Add a health record
  const addHealthRecord = useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .insert(record)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data as HealthRecord;
      } catch (error) {
        console.error('Error adding health record:', error);
        toast({
          title: 'Error',
          description: 'Failed to add health record',
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
    }
  });
  
  // Update a health record
  const updateHealthRecord = useMutation({
    mutationFn: async ({ id, ...record }: HealthRecord) => {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .update(record)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data as HealthRecord;
      } catch (error) {
        console.error('Error updating health record:', error);
        toast({
          title: 'Error',
          description: 'Failed to update health record',
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
    }
  });
  
  // Delete a health record
  const deleteHealthRecord = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('health_records')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        return id;
      } catch (error) {
        console.error('Error deleting health record:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete health record',
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
    }
  });
  
  // Group health records by type
  const vaccinationRecords = healthRecords.filter(
    record => record.record_type === 'vaccination'
  );
  
  const examinationRecords = healthRecords.filter(
    record => record.record_type === 'examination'
  );
  
  const medicationRecords = healthRecords.filter(
    record => record.record_type === 'medication'
  );
  
  const surgeryRecords = healthRecords.filter(
    record => record.record_type === 'surgery'
  );
  
  const otherRecords = healthRecords.filter(
    record => !['vaccination', 'examination', 'medication', 'surgery'].includes(record.record_type)
  );

  return {
    healthRecords,
    isLoading,
    error,
    refreshHealthRecords,
    addHealthRecord: addHealthRecord.mutate,
    updateHealthRecord: updateHealthRecord.mutate,
    deleteHealthRecord: deleteHealthRecord.mutate,
    isAdding: addHealthRecord.isPending,
    isUpdating: updateHealthRecord.isPending,
    isDeleting: deleteHealthRecord.isPending,
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    surgeryRecords,
    otherRecords
  };
};
