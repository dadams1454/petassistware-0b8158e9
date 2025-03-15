
import { supabase } from '@/integrations/supabase/client';
import { DailyCarelog, CareLogFormData } from '@/types/dailyCare';

/**
 * Fetches care logs for a specific dog
 * @param dogId The ID of the dog to fetch care logs for
 * @returns Array of DailyCarelog objects
 */
export const fetchDogCareLogs = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching care logs:', error);
    throw error;
  }
};

/**
 * Adds a new care log for a dog
 * @param data The care log data to add
 * @param userId The ID of the user creating the log
 * @returns The created DailyCarelog or null if unsuccessful
 */
export const addCareLog = async (data: CareLogFormData, userId: string): Promise<DailyCarelog | null> => {
  try {
    // We'll need to store flags in a separate table in a real implementation
    // For now, store them in the notes field as JSON for simplicity
    const notesWithFlags = data.flags && data.flags.length > 0
      ? `${data.notes || ''}\n\nFLAGS: ${JSON.stringify(data.flags)}`
      : data.notes;

    const { data: newLog, error } = await supabase
      .from('daily_care_logs')
      .insert({
        dog_id: data.dog_id,
        created_by: userId,
        category: data.category,
        task_name: data.task_name,
        timestamp: data.timestamp.toISOString(),
        notes: notesWithFlags || null,
      })
      .select()
      .single();

    if (error) throw error;
    return newLog;
  } catch (error) {
    console.error('Error adding care log:', error);
    return null;
  }
};

/**
 * Deletes a care log
 * @param id The ID of the care log to delete
 * @returns True if successful, false otherwise
 */
export const deleteCareLog = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daily_care_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting care log:', error);
    return false;
  }
};
