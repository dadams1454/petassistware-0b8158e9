
import { supabase } from '@/integrations/supabase/client';
import { DogCareStatus } from '@/types/dailyCare';
import { createMockDogFlags } from '@/utils/mockDogFlags';

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
