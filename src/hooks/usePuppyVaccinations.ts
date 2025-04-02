
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VaccinationScheduleItem, VaccinationRecord } from '@/types/puppyTracking';
import { toast } from '@/components/ui/use-toast';

export const usePuppyVaccinations = (puppyId: string) => {
  const [vaccinations, setVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchVaccinations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First fetch vaccination schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId);
        
      if (scheduleError) throw scheduleError;
      
      // Then fetch vaccination records
      const { data: recordsData, error: recordsError } = await supabase
        .from('puppy_vaccinations')
        .select('*')
        .eq('puppy_id', puppyId);
        
      if (recordsError) throw recordsError;
      
      // Combine and format the data
      const scheduledVaccinations = scheduleData.map((item: any) => ({
        ...item,
        is_completed: false,
        completed: false
      }));
      
      const completedVaccinations = recordsData.map((item: any) => ({
        id: item.id,
        puppy_id: item.puppy_id,
        vaccination_type: item.vaccination_type,
        vaccination_date: item.vaccination_date,
        due_date: item.due_date || item.vaccination_date,
        is_completed: true,
        completed: true,
        notes: item.notes,
        administered_by: item.administered_by,
        lot_number: item.lot_number,
        created_at: item.created_at
      }));
      
      // Combine both arrays, prioritizing completed records
      const allVaccinations = [...scheduledVaccinations, ...completedVaccinations];
      
      // Group by vaccination type to avoid duplicates
      const vaccinationsByType: Record<string, VaccinationScheduleItem> = {};
      allVaccinations.forEach(vacc => {
        // If the type doesn't exist or the existing one isn't completed but this one is,
        // update the record
        if (!vaccinationsByType[vacc.vaccination_type] || 
            (!vaccinationsByType[vacc.vaccination_type].is_completed && vacc.is_completed)) {
          vaccinationsByType[vacc.vaccination_type] = vacc;
        }
      });
      
      setVaccinations(Object.values(vaccinationsByType));
    } catch (err) {
      console.error('Error fetching puppy vaccinations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch vaccinations'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (puppyId) {
      fetchVaccinations();
    }
  }, [puppyId]);
  
  // Function to add a new vaccination record
  const addVaccination = async (vaccinationData: Partial<VaccinationRecord>) => {
    try {
      const { data, error } = await supabase
        .from('puppy_vaccinations')
        .insert({
          puppy_id: puppyId,
          vaccination_type: vaccinationData.vaccination_type,
          vaccination_date: vaccinationData.vaccination_date,
          notes: vaccinationData.notes,
          administered_by: vaccinationData.administered_by,
          lot_number: vaccinationData.lot_number
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Vaccination Added',
        description: 'The vaccination record has been added successfully',
      });
      
      await fetchVaccinations();
      return data;
    } catch (err) {
      console.error('Error adding vaccination:', err);
      toast({
        title: 'Error',
        description: 'Failed to add vaccination record',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  // Function to schedule a future vaccination
  const scheduleVaccination = async (scheduleData: Partial<VaccinationScheduleItem>) => {
    try {
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .insert({
          puppy_id: puppyId,
          vaccination_type: scheduleData.vaccination_type,
          due_date: scheduleData.due_date,
          notes: scheduleData.notes,
          is_completed: false,
          completed: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Vaccination Scheduled',
        description: 'The vaccination has been scheduled successfully',
      });
      
      await fetchVaccinations();
      return data;
    } catch (err) {
      console.error('Error scheduling vaccination:', err);
      toast({
        title: 'Error',
        description: 'Failed to schedule vaccination',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  // Function to mark a scheduled vaccination as complete
  const completeVaccination = async (scheduleId: string, completionData: Partial<VaccinationRecord>) => {
    try {
      // First add a vaccination record
      const { data: vaccinationData, error: vaccinationError } = await supabase
        .from('puppy_vaccinations')
        .insert({
          puppy_id: puppyId,
          vaccination_type: completionData.vaccination_type,
          vaccination_date: completionData.vaccination_date || new Date().toISOString().slice(0, 10),
          notes: completionData.notes,
          administered_by: completionData.administered_by,
          lot_number: completionData.lot_number
        })
        .select()
        .single();
        
      if (vaccinationError) throw vaccinationError;
      
      // Then delete the schedule item
      const { error: deleteError } = await supabase
        .from('puppy_vaccination_schedule')
        .delete()
        .eq('id', scheduleId);
        
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Vaccination Completed',
        description: 'The vaccination has been marked as completed',
      });
      
      await fetchVaccinations();
      return vaccinationData;
    } catch (err) {
      console.error('Error completing vaccination:', err);
      toast({
        title: 'Error',
        description: 'Failed to complete vaccination',
        variant: 'destructive',
      });
      throw err;
    }
  };
  
  return {
    vaccinations,
    isLoading,
    error,
    refresh: fetchVaccinations,
    addVaccination,
    scheduleVaccination,
    completeVaccination
  };
};
