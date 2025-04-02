
import { supabase } from '@/integrations/supabase/client';

// Mock type for Supabase query result
type ResultOne = {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
  notes?: string;
};

/**
 * Get all vaccination schedules for a specific puppy
 */
export const getVaccinationSchedules = async (puppyId: string) => {
  try {
    // Use type assertion to work around the Supabase typing issue
    // This is a temporary fix until the Supabase types are properly set up
    const { data, error } = await (supabase
      .from('vaccination_schedules') as any)
      .select('*')
      .eq('puppy_id', puppyId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching vaccination schedules:', error);
      throw new Error('Failed to fetch vaccination schedules');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getVaccinationSchedules:', error);
    return [];
  }
};

/**
 * Save a vaccination schedule
 */
export const saveVaccinationSchedule = async (schedule: any) => {
  if (!schedule.puppy_id) {
    throw new Error('Puppy ID is required');
  }

  try {
    // Insert a new schedule or update an existing one
    const { data, error } = schedule.id
      ? await (supabase
          .from('vaccination_schedules') as any)
          .update(schedule)
          .eq('id', schedule.id)
          .select()
      : await (supabase
          .from('vaccination_schedules') as any)
          .insert(schedule)
          .select();

    if (error) {
      console.error('Error saving vaccination schedule:', error);
      throw new Error('Failed to save vaccination schedule');
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error in saveVaccinationSchedule:', error);
    return null;
  }
};

/**
 * Delete a vaccination schedule
 */
export const deleteVaccinationSchedule = async (scheduleId: string) => {
  try {
    const { error } = await (supabase
      .from('vaccination_schedules') as any)
      .delete()
      .eq('id', scheduleId);

    if (error) {
      console.error('Error deleting vaccination schedule:', error);
      throw new Error('Failed to delete vaccination schedule');
    }

    return true;
  } catch (error) {
    console.error('Error in deleteVaccinationSchedule:', error);
    return false;
  }
};

/**
 * Mark a vaccination as administered
 */
export const markVaccinationAdministered = async (
  scheduleId: string,
  administered: boolean,
  administeredDate?: string
) => {
  try {
    const { data, error } = await (supabase
      .from('vaccination_schedules') as any)
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
  } catch (error) {
    console.error('Error in markVaccinationAdministered:', error);
    return null;
  }
};
