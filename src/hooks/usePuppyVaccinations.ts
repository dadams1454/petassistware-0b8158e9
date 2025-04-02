import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyVaccinationSchedule } from '@/types/puppyTracking';

export function usePuppyVaccinationSchedule(puppyId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [schedule, setSchedule] = useState<PuppyVaccinationSchedule[]>([]);

  useEffect(() => {
    fetchVaccinationSchedule();
  }, [puppyId]);

  const fetchVaccinationSchedule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('scheduled_date');

      if (error) throw error;

      setSchedule(data || []);
    } catch (err) {
      console.error('Error fetching vaccination schedule:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVaccinationScheduleItem = async (
    newItem: Omit<PuppyVaccinationSchedule, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const { error } = await supabase
        .from('puppy_vaccination_schedule')
        .insert([newItem]);

      if (error) throw error;

      // Refresh schedule after adding
      fetchVaccinationSchedule();
      return { success: true };
    } catch (err) {
      console.error('Error adding vaccination schedule item:', err);
      return { success: false, error: err };
    }
  };

  const updateVaccinationSchedule = async (
    scheduleId: string,
    updates: Partial<PuppyVaccinationSchedule>
  ) => {
    try {
      // Make sure notes is defined for compatibility
      const updatesWithNotes = {
        ...updates,
        notes: updates.notes || ''
      };

      const { error } = await supabase
        .from('puppy_vaccination_schedule')
        .update(updatesWithNotes)
        .eq('id', scheduleId);

      if (error) throw error;

      // Refresh schedule after update
      fetchVaccinationSchedule();
      return { success: true };
    } catch (err) {
      console.error('Error updating vaccination schedule:', err);
      return { success: false, error: err };
    }
  };

  const deleteVaccinationScheduleItem = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('puppy_vaccination_schedule')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      // Refresh schedule after deletion
      fetchVaccinationSchedule();
      return { success: true };
    } catch (err) {
      console.error('Error deleting vaccination schedule item:', err);
      return { success: false, error: err };
    }
  };

  return {
    schedule,
    isLoading,
    error,
    fetchVaccinationSchedule,
    addVaccinationScheduleItem,
    updateVaccinationSchedule,
    deleteVaccinationScheduleItem
  };
}
