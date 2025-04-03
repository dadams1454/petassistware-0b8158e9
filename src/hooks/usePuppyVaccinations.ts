
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  scheduled_date: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
  created_at: string;
}

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
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data as VaccinationSchedule[];
    },
    enabled: !!puppyId
  });
  
  // Add vaccination schedule
  const addVaccinationSchedule = useMutation({
    mutationFn: async (scheduleData: Omit<VaccinationSchedule, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .insert({
          puppy_id: puppyId,
          vaccination_type: scheduleData.vaccination_type,
          scheduled_date: scheduleData.scheduled_date,
          administered: scheduleData.administered,
          administered_date: scheduleData.administered_date,
          notes: scheduleData.notes
        })
        .select();
        
      if (error) throw error;
      return data[0] as VaccinationSchedule;
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
    mutationFn: async (id: string, updates: Partial<VaccinationSchedule>) => {
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0] as VaccinationSchedule;
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
  const updateVaccinationScheduleHelper = async (id: string, updates: Partial<VaccinationSchedule>) => {
    return updateVaccinationSchedule.mutateAsync(id, updates);
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
