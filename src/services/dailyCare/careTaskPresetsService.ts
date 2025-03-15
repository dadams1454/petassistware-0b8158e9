
import { supabase } from '@/integrations/supabase/client';
import { CareTaskPreset } from '@/types/dailyCare';

/**
 * Fetches all task presets for daily care
 * @returns Array of CareTaskPreset objects
 */
export const fetchCareTaskPresets = async (): Promise<CareTaskPreset[]> => {
  try {
    const { data, error } = await supabase
      .from('care_task_presets')
      .select('*')
      .order('category', { ascending: true })
      .order('task_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching care task presets:', error);
    throw error;
  }
};

/**
 * Adds a new care task preset
 * @param category The category of the task
 * @param taskName The name of the task
 * @param breederId The ID of the breeder creating the preset
 * @returns The created CareTaskPreset or null if unsuccessful
 */
export const addCareTaskPreset = async (
  category: string, 
  taskName: string, 
  breederId: string
): Promise<CareTaskPreset | null> => {
  try {
    const { data: newPreset, error } = await supabase
      .from('care_task_presets')
      .insert({
        category,
        task_name: taskName,
        is_default: false,
        breeder_id: breederId,
      })
      .select()
      .single();

    if (error) throw error;
    return newPreset;
  } catch (error) {
    console.error('Error adding task preset:', error);
    return null;
  }
};

/**
 * Deletes a care task preset
 * @param id The ID of the preset to delete
 * @returns True if successful, false otherwise
 */
export const deleteCareTaskPreset = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('care_task_presets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task preset:', error);
    return false;
  }
};
