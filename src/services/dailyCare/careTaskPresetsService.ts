
import { supabase } from '@/integrations/supabase/client';
import { CareTaskPreset } from '@/types/dailyCare';

/**
 * Fetches care task presets for a breeder
 * @param breederId The ID of the breeder to fetch presets for
 * @returns Array of CareTaskPreset objects
 */
export const fetchCareTaskPresets = async (breederId?: string): Promise<CareTaskPreset[]> => {
  try {
    let query = supabase
      .from('care_task_presets')
      .select('*')
      .order('category', { ascending: true })
      .order('task_name', { ascending: true });
    
    if (breederId) {
      query = query.or(`breeder_id.eq.${breederId},is_default.eq.true`);
    } else {
      query = query.eq('is_default', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as CareTaskPreset[];
  } catch (error) {
    console.error('Error fetching care task presets:', error);
    return [];
  }
};

/**
 * Adds a new care task preset
 * @param category The category of the preset
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
        breeder_id: breederId,
        is_default: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return newPreset as CareTaskPreset;
  } catch (error) {
    console.error('Error adding care task preset:', error);
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
    console.error('Error deleting care task preset:', error);
    return false;
  }
};
