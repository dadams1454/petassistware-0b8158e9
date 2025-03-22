
import { supabase } from '@/integrations/supabase/client';
import { DailyCarelog, CareLogFormData } from '@/types/dailyCare';

/**
 * Fetches care logs for a specific dog
 * @param dogId The ID of the dog to fetch care logs for
 * @returns Array of DailyCarelog objects
 */
export const fetchDogCareLogs = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    // Add retry mechanism with exponential backoff
    let retries = 3;
    let lastError;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Actual fetch operation
        const { data, error } = await supabase
          .from('daily_care_logs')
          .select('*')
          .eq('dog_id', dogId)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        lastError = error;
        // Exponential backoff with jitter (100ms, 200ms, 400ms)
        const delay = Math.min(100 * Math.pow(2, attempt), 1000) + Math.random() * 100;
        console.log(`Retry attempt ${attempt + 1} for dog ${dogId} in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we've exhausted all retries, throw the last error
    throw lastError || new Error('Failed to fetch care logs after multiple attempts');
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
    // Ensure the timestamp is in a format Supabase can handle
    let timestamp = data.timestamp;
    if (!(timestamp instanceof Date)) {
      timestamp = new Date(timestamp);
    }
    
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
        timestamp: timestamp.toISOString(),
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

/**
 * Fetches feeding logs for a specific date
 * @param date The date to fetch feeding logs for
 * @returns Array of feeding logs with dog information
 */
export const fetchFeedingLogsByDate = async (date: Date): Promise<any[]> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select(`
        *,
        dog:dog_id(id, name)
      `)
      .eq('category', 'feeding')
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString());

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feeding logs for day:', error);
    throw error;
  }
};
