
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord } from '@/types/dog';

export const useHealthRecords = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    data: healthRecords, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['healthRecords', dogId],
    queryFn: async () => {
      if (!dogId) return [];
      
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('visit_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: 'Failed to load health records',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Map to the HealthRecord type
      return (data || []).map(record => ({
        id: record.id,
        dog_id: record.dog_id,
        date: record.visit_date,
        record_type: record.record_type || 'examination',
        title: record.title || record.vet_name + ' Visit',
        description: record.record_notes || '',
        performed_by: record.performed_by || record.vet_name,
        next_due_date: record.next_due_date,
        created_at: record.created_at
      })) as HealthRecord[];
    },
    enabled: !!dogId,
  });

  const addHealthRecord = useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('health_records')
        .insert({
          dog_id: record.dog_id,
          visit_date: record.date,
          record_type: record.record_type,
          title: record.title,
          record_notes: record.description,
          performed_by: record.performed_by,
          vet_name: record.performed_by, // Add the missing vet_name property
          next_due_date: record.next_due_date,
        })
        .select();
        
      if (error) throw error;
      return data![0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      toast({
        title: 'Health record added',
        description: 'The health record has been successfully added',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add health record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateHealthRecord = useMutation({
    mutationFn: async ({ id, ...record }: HealthRecord) => {
      const { data, error } = await supabase
        .from('health_records')
        .update({
          visit_date: record.date,
          record_type: record.record_type,
          title: record.title,
          record_notes: record.description,
          performed_by: record.performed_by,
          vet_name: record.performed_by, // Add the missing vet_name property
          next_due_date: record.next_due_date,
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data![0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      toast({
        title: 'Health record updated',
        description: 'The health record has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update health record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteHealthRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      toast({
        title: 'Health record deleted',
        description: 'The health record has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete health record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    healthRecords,
    isLoading,
    error,
    refetch,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
  };
};
