
import { supabase } from '@/integrations/supabase/client';
import { DailyCarelog, CareLogFormData } from '@/types/dailyCare';

/**
 * Fetch care logs for a specific dog
 * @param dogId ID of the dog to fetch care logs for
 * @returns Array of care logs
 */
export const fetchDogCareLogs = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error('Error fetching care logs:', error);
      throw error;
    }
    
    return data as DailyCarelog[] || [];
  } catch (error) {
    console.error('Error in fetchDogCareLogs:', error);
    return [];
  }
};

/**
 * Fetch care logs for a specific dog and category
 * @param dogId ID of the dog to fetch care logs for
 * @param category Category of care logs to fetch
 * @returns Array of care logs
 */
export const fetchDogCareLogsByCategory = async (dogId: string, category: string): Promise<DailyCarelog[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', category)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error(`Error fetching ${category} care logs:`, error);
      throw error;
    }
    
    return data as DailyCarelog[] || [];
  } catch (error) {
    console.error(`Error in fetchDogCareLogsByCategory for ${category}:`, error);
    return [];
  }
};

/**
 * Add a new care log
 * @param data Care log data to add
 * @param userId ID of the user creating the care log
 * @returns The newly created care log, or null if error
 */
export const addCareLog = async (data: CareLogFormData, userId: string): Promise<DailyCarelog | null> => {
  try {
    // Format the timestamp to ISO string if it's a Date object
    const timestamp = data.timestamp instanceof Date
      ? data.timestamp.toISOString()
      : data.timestamp;
      
    const careLog = {
      dog_id: data.dog_id,
      category: data.category,
      task_name: data.task_name,
      timestamp,
      notes: data.notes || null,
      created_by: userId
    };
    
    console.log('Adding care log:', careLog);
    
    const { data: newLog, error } = await supabase
      .from('daily_care_logs')
      .insert([careLog])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding care log:', error);
      throw error;
    }
    
    console.log('Care log added successfully:', newLog);
    return newLog as DailyCarelog;
  } catch (error) {
    console.error('Error in addCareLog:', error);
    return null;
  }
};

/**
 * Delete a care log
 * @param id ID of the care log to delete
 * @returns Success status
 */
export const deleteCareLog = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daily_care_logs')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting care log:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCareLog:', error);
    return false;
  }
};

/**
 * Get the latest care logs for each category for a dog
 * @param dogId ID of the dog to fetch care logs for
 * @param categories List of categories to fetch
 * @returns Object with latest care log for each category
 */
export const getLatestCareLogsByCategory = async (
  dogId: string, 
  categories: string[] = [
    'pottybreaks', 
    'feeding', 
    'medication', 
    'grooming', 
    'exercise', 
    'wellness', 
    'training', 
    'notes'
  ]
): Promise<Record<string, DailyCarelog | null>> => {
  try {
    // Create a query to fetch the latest log for each category
    const promises = categories.map(async (category) => {
      const { data, error } = await supabase
        .from('daily_care_logs')
        .select('*')
        .eq('dog_id', dogId)
        .eq('category', category)
        .order('timestamp', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error(`Error fetching latest ${category} log:`, error);
        return [category, null];
      }
      
      return [category, data && data.length > 0 ? data[0] : null];
    });
    
    const results = await Promise.all(promises);
    return Object.fromEntries(results);
  } catch (error) {
    console.error('Error in getLatestCareLogsByCategory:', error);
    return {};
  }
};
