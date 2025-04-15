
import { DailyCarelog, CareLogFormData, CareTaskPreset } from '@/types/dailyCare';
import { errorHandlers } from '@/api/core/errors';
import { 
  mockCareLogs, 
  getMockCareLogsForDog, 
  getMockCareLogsByCategory, 
  getLatestMockCareLogsByCategory,
  mockCareTaskPresets 
} from '@/mockData/careLogs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch care logs for a specific dog
 * @param dogId ID of the dog to fetch care logs for
 * @returns Array of care logs
 */
export const fetchDogCareLogs = async (dogId: string): Promise<DailyCarelog[]> => {
  try {
    console.log(`Using mock data to fetch care logs for dog ID: ${dogId}`);
    return getMockCareLogsForDog(dogId);
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
    console.log(`Using mock data to fetch ${category} care logs for dog ID: ${dogId}`);
    return getMockCareLogsByCategory(dogId, category);
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
      : data.timestamp || new Date().toISOString();
      
    const careLog: DailyCarelog = {
      id: uuidv4(),
      dog_id: data.dog_id,
      category: data.category,
      task_name: data.task_name,
      timestamp,
      notes: data.notes || null,
      created_by: userId,
      created_at: new Date().toISOString()
    };
    
    console.log('Adding mock care log:', careLog);
    
    return careLog;
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
    console.log(`Delete care log called with ID: ${id}`);
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
    console.log(`Using mock data to fetch latest care logs by category for dog ID: ${dogId}`);
    return getLatestMockCareLogsByCategory(dogId, categories);
  } catch (error) {
    errorHandlers.handleError(error, 'getLatestCareLogsByCategory');
    return {};
  }
};

/**
 * Fetch all care task presets
 * @returns Array of care task presets
 */
export const fetchCareTaskPresets = async (): Promise<CareTaskPreset[]> => {
  try {
    console.log('Using mock data to fetch care task presets');
    return mockCareTaskPresets;
  } catch (error) {
    errorHandlers.handleError(error, 'fetchCareTaskPresets');
    return [];
  }
};

/**
 * Add a new care task preset
 * @param preset The preset to add
 * @returns The newly created preset, or null if error
 */
export const addCareTaskPreset = async (
  preset: Pick<CareTaskPreset, 'category' | 'task_name'>, 
  userId: string
): Promise<CareTaskPreset | null> => {
  try {
    const careTaskPreset: CareTaskPreset = {
      id: uuidv4(),
      category: preset.category,
      task_name: preset.task_name,
      created_by: userId,
      created_at: new Date().toISOString()
    };
    
    console.log('Adding mock care task preset:', careTaskPreset);
    
    return careTaskPreset;
  } catch (error) {
    errorHandlers.handleError(error, 'addCareTaskPreset');
    return null;
  }
};
