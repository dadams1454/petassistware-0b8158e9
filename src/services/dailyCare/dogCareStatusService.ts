
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
    console.log('🔍 Fetching dogs with care status for date:', date);
    
    // Debug the actual Supabase query being made
    console.log('📊 Supabase query: SELECT id, name, breed, color, photo_url FROM dogs ORDER BY name');
    
    // Fetch all dogs
    const dogsResponse = await supabase
      .from('dogs')
      .select('id, name, breed, color, photo_url')
      .order('name');
      
    // Log the raw response for debugging
    console.log('📊 Supabase dogs response:', {
      status: dogsResponse.status,
      statusText: dogsResponse.statusText,
      error: dogsResponse.error,
      count: dogsResponse.data?.length || 0
    });

    const { data: dogs, error: dogsError } = dogsResponse;

    if (dogsError) {
      console.error('❌ Error fetching dogs:', dogsError);
      throw dogsError;
    }
    
    if (!dogs || dogs.length === 0) {
      console.log('⚠️ No dogs found in database');
      return []; // Return empty array if no dogs found
    }

    console.log(`✅ Found ${dogs.length} dogs in database:`, dogs.map(d => d.name));
    
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
      console.error('❌ Error creating mock dog flags:', error);
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
          console.log(`🔍 Fetching care logs for dog ${dog.name} (${dog.id})`);
          
          const logsResponse = await supabase
            .from('daily_care_logs')
            .select('*')
            .eq('dog_id', dog.id)
            .gte('timestamp', todayStart.toISOString())
            .lte('timestamp', todayEnd.toISOString())
            .order('timestamp', { ascending: false })
            .limit(1);
            
          console.log(`📊 Care logs response for ${dog.name}:`, {
            status: logsResponse.status,
            error: logsResponse.error,
            count: logsResponse.data?.length || 0
          });
          
          const { data: logs, error: logsError } = logsResponse;

          if (logsError) {
            console.warn(`⚠️ Error fetching logs for dog ${dog.id}:`, logsError);
            // Continue with no logs instead of throwing
            return {
              dog_id: dog.id,
              dog_name: dog.name,
              dog_photo: dog.photo_url,
              breed: dog.breed || 'Unknown',
              color: dog.color || 'Unknown',
              last_care: null,
              flags: mockDogFlags[dog.id] || []
            } as DogCareStatus;
          }

          const dogStatus = {
            dog_id: dog.id,
            dog_name: dog.name,
            dog_photo: dog.photo_url,
            breed: dog.breed || 'Unknown',
            color: dog.color || 'Unknown',
            last_care: logs && logs.length > 0 ? {
              category: logs[0].category,
              task_name: logs[0].task_name,
              timestamp: logs[0].timestamp,
            } : null,
            flags: mockDogFlags[dog.id] || []
          } as DogCareStatus;
          
          console.log(`✅ Processed dog status for ${dog.name}:`, {
            id: dogStatus.dog_id,
            name: dogStatus.dog_name,
            lastCare: dogStatus.last_care ? `${dogStatus.last_care.task_name} at ${new Date(dogStatus.last_care.timestamp).toLocaleTimeString()}` : 'None'
          });
          
          return dogStatus;
        } catch (error) {
          console.error(`❌ Error processing dog ${dog.id}:`, error);
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

    console.log(`✅ Processed ${statuses.length} dogs with care status`);
    console.log('🐕 Dog names sample:', statuses.slice(0, 5).map(d => d.dog_name));
    return statuses;
  } catch (error) {
    console.error('❌ Error fetching all dogs care status:', error);
    // Return empty array instead of throwing
    return [];
  }
};
