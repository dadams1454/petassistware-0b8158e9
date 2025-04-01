
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { VaccinationRecord, VaccinationScheduleItem } from '@/types/puppyTracking';

export const usePuppyVaccinations = (puppyId: string) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'overdue'>('all');

  // Fetch vaccinations
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['puppy-vaccinations', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];

      // Get completed vaccinations
      const { data: completedData, error: completedError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId);

      if (completedError) throw completedError;

      // Get scheduled vaccinations
      const { data: scheduledData, error: scheduledError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId);

      if (scheduledError) throw scheduledError;

      // Process completed vaccinations to match schedule format
      const processedCompletedData = completedData.map(record => ({
        ...record,
        due_date: record.vaccination_date,
        is_completed: true
      })) as VaccinationScheduleItem[];

      // Mark scheduled as not completed
      const processedScheduledData = scheduledData.map(record => ({
        ...record,
        is_completed: false
      })) as VaccinationScheduleItem[];

      // Return combined data
      return [...processedCompletedData, ...processedScheduledData];
    },
    enabled: !!puppyId
  });

  // Filtered data
  const vaccinationsByStatus = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: VaccinationScheduleItem[] = [];
    const completed: VaccinationScheduleItem[] = [];
    const overdue: VaccinationScheduleItem[] = [];

    data.forEach((vax) => {
      if (vax.is_completed) {
        completed.push(vax);
      } else {
        const dueDate = new Date(vax.due_date);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          overdue.push(vax);
        } else {
          upcoming.push(vax);
        }
      }
    });

    return { upcoming, completed, overdue };
  }, [data]);

  // Add vaccination
  const addVaccinationMutation = useMutation({
    mutationFn: async (vaccination: Partial<VaccinationRecord>) => {
      if (!vaccination.vaccination_type) {
        throw new Error('Vaccination type is required');
      }

      if (!vaccination.vaccination_date) {
        throw new Error('Vaccination date is required');
      }

      const { data, error } = await supabase
        .from('puppy_vaccinations')
        .insert([
          { ...vaccination, puppy_id: puppyId }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-vaccinations', puppyId] });
      toast.success('Vaccination recorded successfully');
    },
    onError: (error: any) => {
      toast.error(`Error recording vaccination: ${error.message}`);
    }
  });

  return {
    vaccinations: data,
    upcomingVaccinations: vaccinationsByStatus.upcoming,
    completedVaccinations: vaccinationsByStatus.completed,
    overdueVaccinations: vaccinationsByStatus.overdue,
    isLoading,
    error,
    addVaccination: addVaccinationMutation.mutateAsync,
    isAdding: addVaccinationMutation.isPending,
    filter,
    setFilter,
    refresh: refetch
  };
};
