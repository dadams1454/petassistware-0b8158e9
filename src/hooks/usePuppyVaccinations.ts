
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VaccinationSchedule } from '@/services/vaccinationService';

export const usePuppyVaccinationSchedule = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch vaccination schedule
  const { 
    data = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['vaccination-schedule', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      // Map database fields to VaccinationSchedule interface
      return (data || []).map(record => ({
        id: record.id,
        puppy_id: record.puppy_id,
        dog_id: record.dog_id,
        vaccine_name: record.vaccination_type,
        due_date: record.due_date,
        administered: record.administered || false,
        administered_date: record.administered_date,
        notes: record.notes,
        created_at: record.created_at
      })) as VaccinationSchedule[];
    },
    enabled: !!puppyId
  });
  
  // Add vaccination schedule
  const addVaccinationSchedule = useMutation({
    mutationFn: async (scheduleData: Omit<VaccinationSchedule, 'id' | 'created_at'>) => {
      // Prepare data for database - map VaccinationSchedule fields to database fields
      const dbRecord = {
        puppy_id: puppyId,
        vaccination_type: scheduleData.vaccine_name,
        due_date: scheduleData.due_date,
        administered: scheduleData.administered !== undefined ? scheduleData.administered : false,
        administered_date: scheduleData.administered_date,
        notes: scheduleData.notes,
        dog_id: scheduleData.dog_id
      };
      
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .insert(dbRecord)
        .select();
        
      if (error) throw error;
      
      // Convert back to VaccinationSchedule interface
      return {
        id: data[0].id,
        puppy_id: data[0].puppy_id,
        dog_id: data[0].dog_id,
        vaccine_name: data[0].vaccination_type,
        due_date: data[0].due_date,
        administered: data[0].administered || false,
        administered_date: data[0].administered_date,
        notes: data[0].notes,
        created_at: data[0].created_at
      } as VaccinationSchedule;
    },
    onSuccess: () => {
      toast({
        title: "Vaccination Scheduled",
        description: "Vaccination has been scheduled successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['vaccination-schedule', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to schedule vaccination: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Update vaccination schedule
  const updateVaccinationSchedule = useMutation({
    mutationFn: async (params: { id: string, updates: Partial<VaccinationSchedule> }) => {
      const { id, updates } = params;
      
      // Prepare data for database - map VaccinationSchedule fields to database fields
      const dbRecord: Record<string, any> = {};
      
      if (updates.vaccine_name !== undefined) dbRecord.vaccination_type = updates.vaccine_name;
      if (updates.due_date !== undefined) dbRecord.due_date = updates.due_date;
      if (updates.administered !== undefined) dbRecord.administered = updates.administered;
      if (updates.administered_date !== undefined) dbRecord.administered_date = updates.administered_date;
      if (updates.notes !== undefined) dbRecord.notes = updates.notes;
      if (updates.dog_id !== undefined) dbRecord.dog_id = updates.dog_id;
      
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .update(dbRecord)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      // Convert back to VaccinationSchedule interface
      return {
        id: data[0].id,
        puppy_id: data[0].puppy_id,
        dog_id: data[0].dog_id,
        vaccine_name: data[0].vaccination_type,
        due_date: data[0].due_date,
        administered: data[0].administered || false,
        administered_date: data[0].administered_date,
        notes: data[0].notes,
        created_at: data[0].created_at
      } as VaccinationSchedule;
    },
    onSuccess: () => {
      toast({
        title: "Vaccination Updated",
        description: "Vaccination schedule has been updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['vaccination-schedule', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update vaccination: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Delete vaccination schedule
  const deleteVaccinationSchedule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puppy_vaccination_schedule')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Vaccination Deleted",
        description: "Vaccination schedule has been deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['vaccination-schedule', puppyId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete vaccination: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Helper to construct the actual update call in TypeScript-friendly way
  const updateVaccinationScheduleHelper = (id: string, updates: Partial<VaccinationSchedule>) => {
    return updateVaccinationSchedule.mutateAsync({ id, updates });
  };
  
  return {
    schedule: data,
    isLoading,
    error,
    refetch,
    addVaccinationSchedule: addVaccinationSchedule.mutateAsync,
    updateVaccinationSchedule: updateVaccinationScheduleHelper,
    deleteVaccinationSchedule: deleteVaccinationSchedule.mutateAsync,
    isAdding: addVaccinationSchedule.isPending,
    isUpdating: updateVaccinationSchedule.isPending,
    isDeleting: deleteVaccinationSchedule.isPending
  };
};
