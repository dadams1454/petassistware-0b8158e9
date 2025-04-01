
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePuppyVaccinations = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch vaccinations
  const { data: vaccinations, isLoading, error } = useQuery({
    queryKey: ['puppyVaccinations', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];
      
      // Get completed vaccinations
      const { data: completedVaxData, error: completedError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('vaccination_date', { ascending: false });
      
      if (completedError) throw completedError;
      
      // Get scheduled vaccinations
      const { data: scheduledVaxData, error: scheduledError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('due_date', { ascending: true });
      
      if (scheduledError) throw scheduledError;
      
      // Mark completed scheduled vaccinations
      const validScheduledVax = scheduledVaxData.filter(scheduled => {
        // If there's a matching completed vaccination, don't include in scheduled
        return !completedVaxData.some(completed => 
          completed.vaccination_type === scheduled.vaccination_type
        );
      });
      
      // Combine both lists
      return [
        ...completedVaxData.map(vax => ({
          ...vax,
          is_completed: true
        })),
        ...validScheduledVax.map(vax => ({
          ...vax,
          is_completed: false
        }))
      ];
    },
    enabled: !!puppyId
  });
  
  // Add vaccination
  const addVaccination = useMutation({
    mutationFn: async (vaccination: any) => {
      // Determine if this is completed or scheduled
      if (vaccination.is_completed) {
        // Insert into completed vaccinations
        const { data, error } = await supabase
          .from('puppy_vaccinations')
          .insert({
            puppy_id: vaccination.puppy_id,
            vaccination_type: vaccination.vaccination_type,
            vaccination_date: vaccination.vaccination_date,
            administered_by: vaccination.administered_by,
            lot_number: vaccination.lot_number,
            notes: vaccination.notes
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // If this requires a follow-up, schedule it
        if (vaccination.requires_followup && vaccination.followup_date) {
          await supabase
            .from('puppy_vaccination_schedule')
            .insert({
              puppy_id: vaccination.puppy_id,
              vaccination_type: `${vaccination.vaccination_type} (Follow-up)`,
              due_date: vaccination.followup_date,
              notes: `Follow-up for ${vaccination.vaccination_date} vaccination`
            });
        }
        
        // Update the puppy's vaccination_dates field as a comma-separated list
        const { data: puppy } = await supabase
          .from('puppies')
          .select('vaccination_dates')
          .eq('id', vaccination.puppy_id)
          .single();
        
        let updatedDates = puppy?.vaccination_dates || '';
        if (updatedDates) updatedDates += ', ';
        updatedDates += `${vaccination.vaccination_type} (${vaccination.vaccination_date})`;
        
        await supabase
          .from('puppies')
          .update({ vaccination_dates: updatedDates })
          .eq('id', vaccination.puppy_id);
        
        return data;
      } else {
        // Insert into scheduled vaccinations
        const { data, error } = await supabase
          .from('puppy_vaccination_schedule')
          .insert({
            puppy_id: vaccination.puppy_id,
            vaccination_type: vaccination.vaccination_type,
            due_date: vaccination.vaccination_date,
            notes: vaccination.notes
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyVaccinations', puppyId] });
      queryClient.invalidateQueries({ queryKey: ['puppy', puppyId] });
      toast({
        title: 'Vaccination added',
        description: 'The vaccination record has been added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding vaccination',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Mark vaccination as complete
  const markComplete = useMutation({
    mutationFn: async (vaccinationId: string) => {
      // Get the scheduled vaccination
      const { data: scheduledVax, error: fetchError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('id', vaccinationId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Add to completed vaccinations
      const { data: completedVax, error: insertError } = await supabase
        .from('puppy_vaccinations')
        .insert({
          puppy_id: scheduledVax.puppy_id,
          vaccination_type: scheduledVax.vaccination_type,
          vaccination_date: new Date().toISOString().split('T')[0],
          notes: scheduledVax.notes
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Delete from scheduled vaccinations
      const { error: deleteError } = await supabase
        .from('puppy_vaccination_schedule')
        .delete()
        .eq('id', vaccinationId);
      
      if (deleteError) throw deleteError;
      
      // Update the puppy's vaccination_dates field as a comma-separated list
      const { data: puppy } = await supabase
        .from('puppies')
        .select('vaccination_dates')
        .eq('id', scheduledVax.puppy_id)
        .single();
      
      let updatedDates = puppy?.vaccination_dates || '';
      if (updatedDates) updatedDates += ', ';
      updatedDates += `${scheduledVax.vaccination_type} (${new Date().toISOString().split('T')[0]})`;
      
      await supabase
        .from('puppies')
        .update({ vaccination_dates: updatedDates })
        .eq('id', scheduledVax.puppy_id);
      
      return completedVax;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyVaccinations', puppyId] });
      queryClient.invalidateQueries({ queryKey: ['puppy', puppyId] });
      toast({
        title: 'Vaccination completed',
        description: 'The vaccination has been marked as complete',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error completing vaccination',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Filter vaccinations into different categories
  const completedVaccinations = vaccinations?.filter(v => v.is_completed) || [];
  
  const incompleteVaccinations = vaccinations?.filter(v => !v.is_completed) || [];
  
  // Get the current date
  const today = new Date();
  
  // Calculate upcoming and overdue vaccinations
  const upcomingVaccinations = incompleteVaccinations.filter(v => {
    if (!v.due_date) return false;
    const dueDate = new Date(v.due_date);
    return dueDate >= today;
  });
  
  const overdueVaccinations = incompleteVaccinations.filter(v => {
    if (!v.due_date) return false;
    const dueDate = new Date(v.due_date);
    return dueDate < today;
  });
  
  return {
    vaccinations: vaccinations || [],
    completedVaccinations,
    upcomingVaccinations,
    overdueVaccinations,
    isLoading,
    error,
    addVaccination: addVaccination.mutate,
    markComplete: markComplete.mutate
  };
};
