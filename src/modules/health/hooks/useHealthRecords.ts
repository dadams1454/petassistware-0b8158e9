
/**
 * Hook for fetching and manipulating health records
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordOptions } from '../types';
import { toast } from '@/components/ui/use-toast';
import { HealthRecordType } from '@/types/health-enums';

/**
 * Hook to fetch, add, update, and delete health records
 * 
 * @param options Options for filtering health records
 * @returns Health records and CRUD operations
 */
export const useHealthRecords = (options: HealthRecordOptions = {}) => {
  const { dogId, puppyId, recordType, startDate, endDate, includeArchived } = options;
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const queryClient = useQueryClient();
  
  // Build the base query
  const buildQuery = () => {
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
    
    // Order by date (most recent first)
    query = query.order('date', { ascending: false });
    
    return query;
  };
  
  // Fetch health records
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['healthRecords', dogId, puppyId, recordType, startDate, endDate, includeArchived],
    queryFn: async () => {
      const query = buildQuery();
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching health records:', error);
        throw error;
      }
      
      // Map to HealthRecord type
      const records: HealthRecord[] = data.map(record => ({
        id: record.id,
        dog_id: record.dog_id || undefined,
        puppy_id: record.puppy_id || undefined,
        record_type: record.record_type as HealthRecordType || 'examination',
        title: record.title || '',
        date: record.date || record.visit_date,
        visit_date: record.visit_date,
        vet_name: record.vet_name || '',
        record_notes: record.record_notes || record.notes,
        document_url: record.document_url,
        created_at: record.created_at,
        next_due_date: record.next_due_date,
        performed_by: record.performed_by,
        
        // Vaccination-specific fields
        vaccine_name: record.vaccine_name,
        manufacturer: record.manufacturer,
        lot_number: record.lot_number,
        expiration_date: record.expiration_date,
        
        // Medication-specific fields
        medication_name: record.medication_name,
        dosage: record.dosage,
        dosage_unit: record.dosage_unit,
        frequency: record.frequency,
        start_date: record.start_date,
        end_date: record.end_date,
        duration: record.duration,
        duration_unit: record.duration_unit,
        administration_route: record.administration_route,
        
        // Examination-specific fields
        examination_type: record.examination_type,
        findings: record.findings,
        recommendations: record.recommendations,
        follow_up_date: record.follow_up_date,
        
        // Surgery-specific fields
        procedure_name: record.procedure_name,
        surgeon: record.surgeon,
        anesthesia_used: record.anesthesia_used,
        recovery_notes: record.recovery_notes,
      }));
      
      setHealthRecords(records);
      return records;
    }
  });
  
  // Add health record mutation
  const { mutate: addHealthRecord, isLoading: isAdding } = useMutation({
    mutationFn: async (data: Omit<HealthRecord, 'id' | 'created_at'>) => {
      const { data: newRecord, error } = await supabase
        .from('health_records')
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding health record:', error);
        throw error;
      }
      
      return newRecord;
    },
    onSuccess: (newRecord) => {
      // Add the new record to the state
      setHealthRecords(prev => [newRecord, ...prev]);
      
      // Invalidate health records query
      queryClient.invalidateQueries({
        queryKey: ['healthRecords', dogId, puppyId]
      });
      
      toast({
        title: 'Health record added',
        description: 'New health record has been successfully added.',
      });
    },
    onError: (error) => {
      console.error('Failed to add health record:', error);
      toast({
        title: 'Failed to add health record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update health record mutation
  const { mutate: updateHealthRecord, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: Partial<HealthRecord> & { id: string }) => {
      const { id, ...updateData } = data;
      
      const { data: updatedRecord, error } = await supabase
        .from('health_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating health record:', error);
        throw error;
      }
      
      return updatedRecord;
    },
    onSuccess: (updatedRecord) => {
      // Update the record in the state
      setHealthRecords(prev => prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      ));
      
      // Invalidate health records query
      queryClient.invalidateQueries({
        queryKey: ['healthRecords', dogId, puppyId]
      });
      
      toast({
        title: 'Health record updated',
        description: 'Health record has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update health record:', error);
      toast({
        title: 'Failed to update health record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Delete health record mutation
  const { mutate: deleteHealthRecord, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting health record:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: (id) => {
      // Remove the record from the state
      setHealthRecords(prev => prev.filter(record => record.id !== id));
      
      // Invalidate health records query
      queryClient.invalidateQueries({
        queryKey: ['healthRecords', dogId, puppyId]
      });
      
      toast({
        title: 'Health record deleted',
        description: 'Health record has been successfully deleted.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete health record:', error);
      toast({
        title: 'Failed to delete health record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Filter records by type
  const getRecordsByType = (type: HealthRecordType): HealthRecord[] => {
    return healthRecords.filter(record => record.record_type === type);
  };
  
  // Get vaccination records
  const vaccinationRecords = getRecordsByType('vaccination');
  
  // Get examination records
  const examinationRecords = getRecordsByType('examination');
  
  // Get medication records
  const medicationRecords = getRecordsByType('medication');
  
  // Function to manually refresh health records
  const refreshHealthRecords = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing health records:', error);
    }
  };
  
  return {
    healthRecords,
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    isLoading,
    error,
    refreshHealthRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    isAdding,
    isUpdating,
    isDeleting,
    getRecordsByType
  };
};
