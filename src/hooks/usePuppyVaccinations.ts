
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { addDays, isBefore, isAfter } from 'date-fns';
import { VaccinationScheduleItem, VaccinationRecord } from '@/types/puppyTracking';

export const usePuppyVaccinations = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all vaccinations - both completed and scheduled
  const {
    data: vaccinations = [], 
    isLoading, 
    error
  } = useQuery({
    queryKey: ['puppy-vaccinations', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];

      // First get completed vaccinations
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

      // Process scheduled items to mark which ones have already been completed
      // by matching on vaccination_type
      const scheduledWithStatus = scheduledData.map(item => {
        const matchingCompleted = completedData.find(
          completed => completed.vaccination_type === item.vaccination_type
        );
        return { 
          ...item, 
          is_completed: !!matchingCompleted,
          vaccination_date: matchingCompleted?.vaccination_date
        };
      });

      // Create a unified list
      const allVaccinations = [...scheduledWithStatus] as VaccinationScheduleItem[];

      // If no vaccinations exist yet, create default schedule
      if (allVaccinations.length === 0) {
        await createDefaultSchedule(puppyId);

        // Fetch the newly created schedule
        const { data: newSchedule, error: newError } = await supabase
          .from('puppy_vaccination_schedule')
          .select('*')
          .eq('puppy_id', puppyId);

        if (newError) throw newError;

        return newSchedule.map(item => ({
          ...item,
          is_completed: false
        })) as VaccinationScheduleItem[];
      }

      return allVaccinations;
    },
    enabled: !!puppyId
  });

  // Create default vaccination schedule
  const createDefaultSchedule = async (puppyId: string) => {
    // Get puppy birth date
    const { data: puppy, error: puppyError } = await supabase
      .from('puppies')
      .select('birth_date, litter:litter_id(birth_date)')
      .eq('id', puppyId)
      .single();
    
    if (puppyError) {
      throw puppyError;
    }

    const birthDate = puppy.birth_date || puppy.litter?.birth_date;
    if (!birthDate) {
      throw new Error('Birth date not found for puppy');
    }

    const birthDateObj = new Date(birthDate);
    const today = new Date();
    
    // Default vaccination schedule
    const defaultSchedule = [
      {
        puppy_id: puppyId,
        vaccination_type: 'DHPP (First)',
        due_date: addDays(birthDateObj, 42).toISOString().split('T')[0], // 6 weeks
        notes: 'First core vaccination'
      },
      {
        puppy_id: puppyId,
        vaccination_type: 'DHPP (Second)',
        due_date: addDays(birthDateObj, 56).toISOString().split('T')[0], // 8 weeks
        notes: 'Second core vaccination'
      },
      {
        puppy_id: puppyId,
        vaccination_type: 'DHPP (Third)',
        due_date: addDays(birthDateObj, 70).toISOString().split('T')[0], // 10 weeks
        notes: 'Third core vaccination'
      },
      {
        puppy_id: puppyId,
        vaccination_type: 'Rabies',
        due_date: addDays(birthDateObj, 112).toISOString().split('T')[0], // 16 weeks
        notes: 'Required by law'
      }
    ];

    const { error } = await supabase
      .from('puppy_vaccination_schedule')
      .insert(defaultSchedule);

    if (error) {
      throw error;
    }
  };

  // Add a vaccination record
  const addVaccination = useMutation({
    mutationFn: async (data: {
      vaccination_type: string;
      vaccination_date: string;
      administered_by?: string;
      lot_number?: string;
      notes?: string;
    }) => {
      // Add to completed vaccinations
      const { data: insertedData, error } = await supabase
        .from('puppy_vaccinations')
        .insert({
          puppy_id: puppyId,
          ...data
        })
        .select()
        .single();

      if (error) throw error;

      return insertedData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['puppy-vaccinations', puppyId] });
      toast({
        title: 'Vaccination Recorded',
        description: `${data.vaccination_type} vaccination has been recorded.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to record vaccination: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Add a scheduled vaccination
  const addScheduledVaccination = useMutation({
    mutationFn: async (data: {
      vaccination_type: string;
      due_date: string;
      notes?: string;
    }) => {
      const { data: insertedData, error } = await supabase
        .from('puppy_vaccination_schedule')
        .insert({
          puppy_id: puppyId,
          ...data
        })
        .select()
        .single();

      if (error) throw error;

      return insertedData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['puppy-vaccinations', puppyId] });
      toast({
        title: 'Vaccination Scheduled',
        description: `${data.vaccination_type} vaccination has been scheduled.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to schedule vaccination: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Delete a scheduled vaccination
  const deleteScheduledVaccination = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('puppy_vaccination_schedule')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-vaccinations', puppyId] });
      toast({
        title: 'Vaccination Removed',
        description: 'The scheduled vaccination has been removed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to remove vaccination: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Filter vaccinations
  const overdueVaccinations = vaccinations.filter(vax => 
    !vax.is_completed && 
    vax.due_date && 
    isBefore(new Date(vax.due_date), new Date())
  );
  
  const upcomingVaccinations = vaccinations.filter(vax => 
    !vax.is_completed && 
    vax.due_date && 
    !isBefore(new Date(vax.due_date), new Date())
  );
  
  const completedVaccinations = vaccinations.filter(vax => vax.is_completed);

  return {
    vaccinations,
    upcomingVaccinations,
    completedVaccinations,
    overdueVaccinations,
    isLoading,
    error,
    addVaccination: addVaccination.mutate,
    addScheduledVaccination: addScheduledVaccination.mutate,
    deleteScheduledVaccination: deleteScheduledVaccination.mutate
  };
};
