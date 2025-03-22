
import { supabase } from '@/integrations/supabase/client';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';

/**
 * Fetches all dogs with their most recent care status for a specific date
 * @param date The date to check care status for (defaults to today)
 * @returns Array of DogCareStatus objects
 */
export const fetchAllDogsWithCareStatus = async (date = new Date()): Promise<DogCareStatus[]> => {
  try {
    console.log('🔍 Fetching dogs with care status for date:', date);
    
    // Fetch dogs with additional fields for flags/conditions
    const { data: dogs, error } = await supabase
      .from('dogs')
      .select(`
        id, 
        name, 
        breed, 
        color, 
        photo_url, 
        gender,
        is_pregnant,
        requires_special_handling,
        last_heat_date,
        potty_alert_threshold
      `)
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
      return []; 
    }

    console.log(`✅ Found ${dogs.length} dogs in database`);
    
    // Fetch incompatibilities between dogs
    const { data: incompatibilities, error: incompatibilitiesError } = await supabase
      .from('dog_incompatibilities')
      .select(`
        dog_id,
        incompatible_with,
        reason
      `)
      .eq('active', true);
    
    if (incompatibilitiesError) {
      console.error('❌ Error fetching dog incompatibilities:', incompatibilitiesError);
    }

    // Group incompatibilities by dog_id for easier lookup
    const dogIncompatibilities: Record<string, string[]> = {};
    if (incompatibilities) {
      incompatibilities.forEach(item => {
        if (!dogIncompatibilities[item.dog_id]) {
          dogIncompatibilities[item.dog_id] = [];
        }
        dogIncompatibilities[item.dog_id].push(item.incompatible_with);
      });
    }

    // Convert to DogCareStatus objects
    const dogStatuses = dogs.map(dog => {
      // Create flags based on actual dog data
      const flags: DogFlag[] = [];
      
      // Check if dog is in heat (if last_heat_date is recent - within 21 days)
      if (dog.last_heat_date) {
        const lastHeatDate = new Date(dog.last_heat_date);
        const daysSinceLastHeat = Math.floor((new Date().getTime() - lastHeatDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastHeat >= 0 && daysSinceLastHeat <= 21) {
          flags.push({ type: 'in_heat' });
        }
      }
      
      // Check if dog is pregnant
      if (dog.is_pregnant) {
        flags.push({ 
          type: 'special_attention',
          value: 'Pregnant' 
        });
      }
      
      // Add special handling flag if needed
      if (dog.requires_special_handling) {
        flags.push({ 
          type: 'special_attention',
          value: 'Needs special handling'
        });
      }
      
      // Add incompatibility flags
      if (dogIncompatibilities[dog.id] && dogIncompatibilities[dog.id].length > 0) {
        flags.push({
          type: 'incompatible',
          incompatible_with: dogIncompatibilities[dog.id]
        });
      }
      
      // Normalize gender to lowercase for consistent comparison
      const normalizedGender = dog.gender ? dog.gender.toLowerCase() : 'unknown';
      
      return {
        dog_id: dog.id || '',
        dog_name: dog.name || 'Unknown dog',
        dog_photo: dog.photo_url || '',
        breed: dog.breed || 'Unknown',
        color: dog.color || 'Unknown',
        sex: normalizedGender, // Normalize to lowercase for consistent comparison
        last_care: null, // We're not loading care data for simplicity
        flags: flags
      };
    });

    console.log(`✅ Converted ${dogStatuses.length} dog statuses with actual flags`);
    return dogStatuses;
  } catch (error) {
    console.error('❌ Error in dog fetch:', error);
    throw error;
  }
};
