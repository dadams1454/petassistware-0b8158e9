import { supabase } from '@/integrations/supabase/client';
import { createMockDogFlags } from '@/utils/mockDogFlags';

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
 * Fetches all dogs with their most recent care status for a specific date
 * @param date The date to check care status for (defaults to today)
 * @returns Array of DogCareStatus objects
 */
export const fetchAllDogsWithCareStatus = async (date = new Date()): Promise<DogCareStatus[]> => {
  try {
    // Fetch all dogs
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('id, name, breed, color, photo_url')
      .order('name');

    if (dogsError) throw dogsError;
    
    if (!dogs || dogs.length === 0) {
      return []; // Return empty array if no dogs found
    }

    // For each dog, fetch their most recent care log for the specified date
    const todayStart = new Date(date);
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(date);
    todayEnd.setHours(23, 59, 59, 999);

    // Generate mock flags for dogs (using fallback if there's an error)
    let mockDogFlags = {};
    try {
      mockDogFlags = createMockDogFlags(dogs);
    } catch (error) {
      console.error('Error creating mock dog flags:', error);
      // Use empty flags as fallback
      mockDogFlags = dogs.reduce((acc, dog) => {
        acc[dog.id] = [];
        return acc;
      }, {});
    }

    // Process each dog with error handling
    const statuses = await Promise.all(
      dogs.map(async (dog) => {
        try {
          const { data: logs, error: logsError } = await supabase
            .from('daily_care_logs')
            .select('*')
            .eq('dog_id', dog.id)
            .gte('timestamp', todayStart.toISOString())
            .lte('timestamp', todayEnd.toISOString())
            .order('timestamp', { ascending: false })
            .limit(1);

          if (logsError) {
            console.warn(`Error fetching logs for dog ${dog.id}:`, logsError);
            // Continue with no logs instead of throwing
            return {
              dog_id: dog.id,
              dog_name: dog.name,
              dog_photo: dog.photo_url,
              breed: dog.breed,
              color: dog.color,
              last_care: null,
              flags: mockDogFlags[dog.id] || []
            } as DogCareStatus;
          }

          return {
            dog_id: dog.id,
            dog_name: dog.name,
            dog_photo: dog.photo_url,
            breed: dog.breed,
            color: dog.color,
            last_care: logs && logs.length > 0 ? {
              category: logs[0].category,
              task_name: logs[0].task_name,
              timestamp: logs[0].timestamp,
            } : null,
            flags: mockDogFlags[dog.id] || []
          } as DogCareStatus;
        } catch (error) {
          console.error(`Error processing dog ${dog.id}:`, error);
          // Return basic dog info with null care status
          return {
            dog_id: dog.id,
            dog_name: dog.name,
            dog_photo: dog.photo_url,
            breed: dog.breed || 'Unknown',
            color: dog.color || 'Unknown',
            last_care: null,
            flags: []
          } as DogCareStatus;
        }
      })
    );

    return statuses;
  } catch (error) {
    console.error('Error fetching all dogs care status:', error);
    // Return empty array instead of throwing
    return [];
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
