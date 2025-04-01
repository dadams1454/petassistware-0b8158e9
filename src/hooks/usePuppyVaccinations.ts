
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VaccinationRecord, VaccinationScheduleItem } from '@/types/puppyTracking';
import { format, isPast, addDays } from 'date-fns';

export const usePuppyVaccinations = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingVaccination, setIsAddingVaccination] = useState(false);

  // Fetch vaccination schedule and completed vaccinations
  const { data, isLoading, error } = useQuery({
    queryKey: ['puppy-vaccinations', puppyId],
    queryFn: async () => {
      try {
        // Fetch scheduled vaccinations
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('puppy_vaccination_schedule')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('due_date', { ascending: true });
        
        if (scheduleError) throw scheduleError;
        
        // Fetch completed vaccinations
        const { data: completedData, error: completedError } = await supabase
          .from('puppy_vaccinations')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('vaccination_date', { ascending: false });
        
        if (completedError) throw completedError;
        
        return {
          schedule: scheduleData || [],
          completed: completedData || []
        };
      } catch (err) {
        console.error('Error fetching puppy vaccinations:', err);
        throw err;
      }
    }
  });

  // Add vaccination mutation
  const { mutateAsync: addVaccinationMutation } = useMutation({
    mutationFn: async (vaccinationData: Partial<VaccinationRecord>) => {
      setIsAddingVaccination(true);
      try {
        // Insert vaccination record
        const { data: newVaccination, error } = await supabase
          .from('puppy_vaccinations')
          .insert({
            puppy_id: puppyId,
            vaccination_type: vaccinationData.vaccination_type,
            vaccination_date: vaccinationData.vaccination_date,
            lot_number: vaccinationData.lot_number || null,
            administered_by: vaccinationData.administered_by || null,
            notes: vaccinationData.notes || null
          })
          .select()
          .single();
        
        if (error) throw error;
        return newVaccination;
      } catch (err) {
        console.error('Error adding vaccination:', err);
        throw err;
      } finally {
        setIsAddingVaccination(false);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Vaccination recorded',
        description: 'The vaccination record has been successfully added.',
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['puppy-vaccinations', puppyId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to record vaccination: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Wrapper function for adding a vaccination
  const addVaccination = async (data: Partial<VaccinationRecord>) => {
    return addVaccinationMutation(data);
  };

  // Process the data for easier use in components
  const vaccinations = (data?.schedule || []).concat(data?.completed || []);

  // Get scheduled vaccinations that haven't been completed
  const upcomingVaccinations = data?.schedule.filter(schedule => {
    // Check if there's no matching completed vaccination
    return !data.completed.some(completed => 
      completed.vaccination_type === schedule.vaccination_type
    );
  }) || [];

  // Get completed vaccinations
  const completedVaccinations = data?.completed || [];

  // Get overdue vaccinations
  const overdueVaccinations = upcomingVaccinations.filter(vaccination => 
    isPast(new Date(vaccination.due_date))
  );

  return {
    vaccinations,
    upcomingVaccinations,
    completedVaccinations,
    overdueVaccinations,
    isLoading,
    isAddingVaccination,
    error,
    addVaccination
  };
};
