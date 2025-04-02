
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all vaccination schedules for a specific puppy
 */
export const getVaccinationSchedules = async (puppyId: string) => {
  const { data, error } = await supabase
    .from('vaccination_schedules')
    .select('*')
    .eq('puppy_id', puppyId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching vaccination schedules:', error);
    throw new Error('Failed to fetch vaccination schedules');
  }

  return data || [];
};

/**
 * Save a vaccination schedule
 */
export const saveVaccinationSchedule = async (schedule: any) => {
  if (!schedule.puppy_id) {
    throw new Error('Puppy ID is required');
  }

  // Insert a new schedule or update an existing one
  const { data, error } = schedule.id
    ? await supabase
        .from('vaccination_schedules')
        .update(schedule)
        .eq('id', schedule.id)
        .select()
    : await supabase
        .from('vaccination_schedules')
        .insert(schedule)
        .select();

  if (error) {
    console.error('Error saving vaccination schedule:', error);
    throw new Error('Failed to save vaccination schedule');
  }

  return data?.[0] || null;
};

/**
 * Delete a vaccination schedule
 */
export const deleteVaccinationSchedule = async (scheduleId: string) => {
  const { error } = await supabase
    .from('vaccination_schedules')
    .delete()
    .eq('id', scheduleId);

  if (error) {
    console.error('Error deleting vaccination schedule:', error);
    throw new Error('Failed to delete vaccination schedule');
  }

  return true;
};

/**
 * Mark a vaccination as administered
 */
export const markVaccinationAdministered = async (
  scheduleId: string,
  administered: boolean,
  administeredDate?: string
) => {
  const { data, error } = await supabase
    .from('vaccination_schedules')
    .update({
      administered,
      administered_date: administeredDate || new Date().toISOString(),
    })
    .eq('id', scheduleId)
    .select();

  if (error) {
    console.error('Error updating vaccination status:', error);
    throw new Error('Failed to update vaccination status');
  }

  return data?.[0] || null;
};
