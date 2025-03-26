
import { supabase } from '@/integrations/supabase/client';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';

/**
 * Fetches all dogs with their care status information for a specific date
 * @param date The date to fetch care status for
 * @returns Array of dogs with care status
 */
export const fetchAllDogsWithCareStatus = async (date = new Date()): Promise<DogCareStatus[]> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Base query to fetch all dogs
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select(`
        id,
        name,
        breed,
        gender,
        color,
        birthdate,
        photo_url,
        weight,
        potty_alert_threshold,
        requires_special_handling
      `);
      
    if (dogsError) throw dogsError;
    
    if (!dogs || dogs.length === 0) {
      return [];
    }
    
    // Map the dogs to DogCareStatus objects
    const dogCareStatuses: DogCareStatus[] = dogs.map(dog => ({
      dog_id: dog.id,
      dog_name: dog.name,
      breed: dog.breed, // Match the expected type by using 'breed' directly
      color: dog.color || '', // Match the expected type by using 'color' directly
      sex: dog.gender || '', // Map 'gender' to the expected 'sex' property
      dog_photo: dog.photo_url,
      dog_weight: dog.weight,
      potty_alert_threshold: dog.potty_alert_threshold,
      requires_special_handling: dog.requires_special_handling,
      last_potty_time: null,
      last_feeding_time: null,
      feeding_times_today: [],
      potty_times_today: [],
      medication_times_today: [],
      // Add the missing required properties
      last_care: null,
      flags: [] as DogFlag[]
    }));
    
    return dogCareStatuses;
  } catch (error) {
    console.error('Error fetching dogs with care status:', error);
    throw error;
  }
};
