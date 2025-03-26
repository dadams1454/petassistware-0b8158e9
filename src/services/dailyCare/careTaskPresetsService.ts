
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
 * @param categoryOrData The category of the preset or a preset data object
 * @param taskName The name of the task (optional if categoryOrData is an object)
 * @param breederId The ID of the breeder creating the preset (optional if categoryOrData is an object)
 * @returns The created CareTaskPreset or null if unsuccessful
 */
export const addCareTaskPreset = async (
  categoryOrData: string | Partial<CareTaskPreset>,
  taskName?: string,
  breederId?: string
): Promise<CareTaskPreset | null> => {
  try {
    let presetData: {
      category: string;
      task_name: string;
      breeder_id?: string;
      is_default: boolean;
    };
    
    if (typeof categoryOrData === 'string' && taskName && breederId) {
      // Old-style call with separate parameters
      presetData = {
        category: categoryOrData,
        task_name: taskName,
        breeder_id: breederId,
        is_default: false
      };
    } else if (typeof categoryOrData === 'object') {
      // New-style call with a data object
      if (!categoryOrData.category || !categoryOrData.task_name) {
        throw new Error('Category and task_name are required fields');
      }
      
      presetData = {
        category: categoryOrData.category,
        task_name: categoryOrData.task_name,
        breeder_id: categoryOrData.breeder_id,
        is_default: false
      };
    } else {
      throw new Error('Invalid arguments to addCareTaskPreset');
    }
    
    const { data: newPreset, error } = await supabase
      .from('care_task_presets')
      .insert(presetData)
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
