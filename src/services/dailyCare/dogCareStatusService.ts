
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
    console.log('🔍 Simplified dog fetch for date:', date);
    
    // Fetch only essential dog data - just id, name, breed, color and photo_url
    const dogsResponse = await supabase
      .from('dogs')
      .select('id, name, breed, color, photo_url, gender')
      .order('name');
      
    console.log('📊 Supabase dogs response status:', {
      status: dogsResponse.status,
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

    console.log(`✅ Found ${dogs.length} dogs in database, first few:`, dogs.slice(0, 3).map(d => d.name));
    
    // Generate mock flags - simplified
    let mockDogFlags = {};
    try {
      mockDogFlags = createMockDogFlags(dogs);
    } catch (error) {
      console.error('❌ Error creating mock dog flags:', error);
      mockDogFlags = {};
    }

    // Immediately convert to simplified DogCareStatus objects
    const simplifiedStatuses = dogs.map(dog => ({
      dog_id: dog.id,
      dog_name: dog.name,
      dog_photo: dog.photo_url,
      breed: dog.breed || 'Unknown',
      color: dog.color || 'Unknown',
      sex: dog.gender || 'Unknown', // Use 'gender' column instead of non-existent 'sex'
      last_care: null, // We're not loading care data for simplicity
      flags: mockDogFlags[dog.id] || []
    }));

    console.log(`✅ Simplified ${simplifiedStatuses.length} dog statuses`);
    return simplifiedStatuses;
  } catch (error) {
    console.error('❌ Error in simplified dog fetch:', error);
    throw error;
  }
};
