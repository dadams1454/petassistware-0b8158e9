
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HealthRecord } from '@/types/dog';

export const useDogHealthRecords = (dogId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch health records
  const {
    data: healthRecords = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dog-health-records', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('visit_date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!dogId
  });
  
  // Add health record
  const addHealthRecordMutation = useMutation({
    mutationFn: async (record: Partial<HealthRecord>) => {
      // Ensure we have the required fields
      if (!record.visit_date) {
        throw new Error('Visit date is required');
      }
      
      if (!record.vet_name) {
        throw new Error('Veterinarian name is required');
      }
      
      const { data, error } = await supabase
        .from('health_records')
        .insert(record)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-health-records', dogId] });
      toast.success('Health record added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding health record:', error);
      toast.error(`Failed to add health record: ${error.message}`);
    }
  });
  
  const addHealthRecord = (record: Partial<HealthRecord>) => {
    return addHealthRecordMutation.mutateAsync(record);
  };
  
  return {
    healthRecords,
    isLoading,
    error,
    refresh: refetch,
    addHealthRecord,
    isAdding: addHealthRecordMutation.isPending
  };
};
