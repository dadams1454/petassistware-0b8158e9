
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VaccinationScheduleItem } from '@/types/puppyTracking';
import { useToast } from '@/hooks/use-toast';

export const usePuppyVaccinations = (puppyId: string) => {
  const [vaccinations, setVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchVaccinations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get scheduled vaccinations from puppy_vaccination_schedule
      const { data: scheduledData, error: scheduledError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId);
        
      if (scheduledError) throw scheduledError;
      
      // Get completed vaccinations from puppy_vaccinations
      const { data: completedData, error: completedError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId);
        
      if (completedError) throw completedError;
      
      // Process scheduled vaccinations
      const scheduledVaccinations = scheduledData?.map(item => ({
        id: item.id,
        puppy_id: item.puppy_id,
        vaccination_type: item.vaccination_type,
        due_date: item.due_date,
        notes: item.notes,
        is_completed: false,
        created_at: item.created_at || new Date().toISOString()
      })) || [];
      
      // Process completed vaccinations
      const completedVaccinations = completedData?.map(item => ({
        id: item.id,
        puppy_id: item.puppy_id,
        vaccination_type: item.vaccination_type,
        vaccination_date: item.vaccination_date,
        due_date: item.vaccination_date, // Use vaccination_date as due_date for completed items
        notes: item.notes,
        is_completed: true,
        created_at: item.created_at || new Date().toISOString()
      })) || [];
      
      // Combine and set the vaccinations
      setVaccinations([...scheduledVaccinations, ...completedVaccinations] as VaccinationScheduleItem[]);
    } catch (err) {
      console.error('Error fetching vaccinations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch vaccinations'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const addVaccination = async (vaccinationData: Partial<VaccinationScheduleItem>) => {
    try {
      const newVaccination = {
        puppy_id: puppyId,
        vaccination_type: vaccinationData.vaccination_type || '',
        vaccination_date: vaccinationData.vaccination_date || new Date().toISOString().split('T')[0],
        notes: vaccinationData.notes,
        created_at: new Date().toISOString()
      };
      
      // Insert into puppy_vaccinations
      const { data, error } = await supabase
        .from('puppy_vaccinations')
        .insert(newVaccination)
        .select()
        .single();
        
      if (error) throw error;
      
      // If this was from a scheduled vaccination, mark it as completed
      if (vaccinationData.id) {
        const { error: updateError } = await supabase
          .from('puppy_vaccination_schedule')
          .update({ completed: true })
          .eq('id', vaccinationData.id);
          
        if (updateError) console.error('Error updating schedule:', updateError);
      }
      
      // Add to local state
      const newRecord: VaccinationScheduleItem = {
        id: data.id,
        puppy_id: puppyId,
        vaccination_type: data.vaccination_type,
        vaccination_date: data.vaccination_date,
        due_date: data.vaccination_date, // Use vaccination date as due date for completed items
        notes: data.notes || '',
        is_completed: true,
        created_at: data.created_at || new Date().toISOString()
      };
      
      setVaccinations([...vaccinations, newRecord]);
      
      toast({
        title: 'Vaccination Added',
        description: `${data.vaccination_type} recorded successfully.`,
      });
      
      return data;
    } catch (err) {
      console.error('Error adding vaccination:', err);
      toast({
        title: 'Error',
        description: 'Failed to add vaccination record.',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  const scheduleVaccination = async (scheduleData: Partial<VaccinationScheduleItem>) => {
    try {
      const newSchedule = {
        puppy_id: puppyId,
        vaccination_type: scheduleData.vaccination_type || '',
        due_date: scheduleData.due_date || new Date().toISOString().split('T')[0],
        notes: scheduleData.notes,
        completed: false,
        created_at: new Date().toISOString()
      };
      
      // Insert into puppy_vaccination_schedule
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .insert(newSchedule)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to local state
      const newRecord: VaccinationScheduleItem = {
        id: data.id,
        puppy_id: puppyId,
        vaccination_type: data.vaccination_type,
        due_date: data.due_date,
        notes: data.notes || '',
        is_completed: false,
        created_at: data.created_at || new Date().toISOString()
      };
      
      setVaccinations([...vaccinations, newRecord]);
      
      toast({
        title: 'Vaccination Scheduled',
        description: `${data.vaccination_type} scheduled for ${new Date(data.due_date).toLocaleDateString()}.`,
      });
      
      return data;
    } catch (err) {
      console.error('Error scheduling vaccination:', err);
      toast({
        title: 'Error',
        description: 'Failed to schedule vaccination.',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  useEffect(() => {
    if (puppyId) {
      fetchVaccinations();
    }
  }, [puppyId]);
  
  return {
    vaccinations,
    isLoading,
    error,
    refresh: fetchVaccinations,
    addVaccination,
    scheduleVaccination
  };
};
