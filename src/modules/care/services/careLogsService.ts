
import { apiClient } from '@/api/core/apiClient';
import { DailyCarelog, CareLogFormData } from '@/types/dailyCare';
import { errorHandlers } from '@/api/core/errors';

/**
 * Fetch care logs for a specific dog
 * @param dogId ID of the dog to fetch care logs for
 * @returns Array of care logs
 */
export const fetchDogCareLogs = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    const logs = await apiClient.select<DailyCarelog[]>('daily_care_logs', {
      eq: [['dog_id', dogId]],
      order: [['timestamp', { ascending: false }]]
    });
    
    return logs || [];
  } catch (error) {
    return errorHandlers.handleError(error, 'fetchDogCareLogs').details?.logs || [];
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
    const logs = await apiClient.raw.supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', category)
      .order('timestamp', { ascending: false });
      
    if (logs.error) throw logs.error;
    
    return logs.data as DailyCarelog[] || [];
  } catch (error) {
    return errorHandlers.handleError(error, `fetchDogCareLogsByCategory:${category}`).details?.logs || [];
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
    
    const newLog = await apiClient.insert<typeof careLog, DailyCarelog>(
      'daily_care_logs',
      careLog,
      { returnData: true, single: true }
    );
    
    console.log('Care log added successfully:', newLog);
    return newLog;
  } catch (error) {
    errorHandlers.handleError(error, 'addCareLog');
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
    await apiClient.delete('daily_care_logs', {
      eq: [['id', id]]
    });
    
    return true;
  } catch (error) {
    errorHandlers.handleError(error, 'deleteCareLog');
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
      try {
        const logs = await apiClient.raw.supabase
          .from('daily_care_logs')
          .select('*')
          .eq('dog_id', dogId)
          .eq('category', category)
          .order('timestamp', { ascending: false })
          .limit(1);
          
        return [category, logs.data && logs.data.length > 0 ? logs.data[0] : null];
      } catch (error) {
        console.error(`Error fetching latest ${category} log:`, error);
        return [category, null];
      }
    });
    
    const results = await Promise.all(promises);
    return Object.fromEntries(results);
  } catch (error) {
    errorHandlers.handleError(error, 'getLatestCareLogsByCategory');
    return {};
  }
};
