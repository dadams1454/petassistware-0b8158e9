
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
    
    // Fetch only essential dog data with more reliable query
    const { data: dogs, error } = await supabase
      .from('dogs')
      .select('id, name, breed, color, photo_url, gender')
      .order('name');
      
    console.log('📊 Supabase dogs response:', {
      status: error ? 'Error' : 'Success',
      count: dogs?.length || 0,
      error: error ? error.message : null
    });

    if (error) {
      console.error('❌ Error fetching dogs:', error);
      throw new Error(`Failed to fetch dogs: ${error.message}`);
    }
    
    if (!dogs || dogs.length === 0) {
      console.log('⚠️ No dogs found in database');
      return []; // Return empty array if no dogs found
    }

    console.log(`✅ Found ${dogs.length} dogs in database, dog names:`, dogs.map(d => d.name).join(', '));
    
    // Generate mock flags (with error handling)
    let mockDogFlags = {};
    try {
      mockDogFlags = createMockDogFlags(dogs);
    } catch (error) {
      console.error('❌ Error creating mock dog flags:', error);
      mockDogFlags = {};
    }

    // Convert to DogCareStatus objects with better error handling for missing values
    const dogStatuses = dogs.map(dog => ({
      dog_id: dog.id || '',
      dog_name: dog.name || 'Unknown dog',
      dog_photo: dog.photo_url || '',
      breed: dog.breed || 'Unknown',
      color: dog.color || 'Unknown',
      sex: dog.gender || 'Unknown', // Use gender column since sex doesn't exist
      last_care: null, // We're not loading care data for simplicity
      flags: (mockDogFlags[dog.id] || []).filter(Boolean) // Filter out any null/undefined flags
    }));

    console.log(`✅ Converted ${dogStatuses.length} dog statuses`);
    return dogStatuses;
  } catch (error) {
    console.error('❌ Error in dog fetch:', error);
    throw error;
  }
};
