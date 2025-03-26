
import { supabase } from '@/integrations/supabase/client';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';

/**
 * Fetches all dogs with their care status information for a specific date
 * @param date The date to fetch care status for
 * @returns Array of dogs with care status
 */
export const fetchAllDogsWithCareStatus = async (date = new Date()): Promise<DogCareStatus[]> => {
  try {
    console.log('Fetching dogs for date:', date.toISOString().split('T')[0]);
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Base query to fetch all dogs with more details
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
        requires_special_handling,
        microchip_number,
        registration_number,
        max_time_between_breaks
      `)
      .order('name');
      
    if (dogsError) {
      console.error('Error fetching dogs:', dogsError);
      throw dogsError;
    }
    
    if (!dogs || dogs.length === 0) {
      console.log('No dogs found in database');
      return [];
    }
    
    console.log(`Found ${dogs.length} dogs in database`);
    
    // Fetch potty breaks for the day to determine last care times
    const { data: pottyBreaks, error: pottyError } = await supabase
      .from('care_activities')
      .select('*')
      .eq('activity_type', 'potty')
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString());
      
    if (pottyError) {
      console.error('Error fetching potty breaks:', pottyError);
      // Continue without potty data rather than failing
    }
    
    // Fetch feeding activities for the day
    const { data: feedingActivities, error: feedingError } = await supabase
      .from('care_activities')
      .select('*')
      .eq('activity_type', 'feeding')
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString());
      
    if (feedingError) {
      console.error('Error fetching feeding activities:', feedingError);
      // Continue without feeding data rather than failing
    }
    
    // Map the dogs to DogCareStatus objects
    const dogCareStatuses: DogCareStatus[] = dogs.map(dog => {
      // Find potty breaks for this dog
      const dogPottyBreaks = pottyBreaks?.filter(pb => pb.dog_id === dog.id) || [];
      // Sort breaks by timestamp descending to get the latest one
      const sortedPottyBreaks = dogPottyBreaks.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Find feeding activities for this dog
      const dogFeedingActivities = feedingActivities?.filter(fa => fa.dog_id === dog.id) || [];
      // Sort activities by timestamp descending to get the latest one
      const sortedFeedingActivities = dogFeedingActivities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return {
        dog_id: dog.id,
        dog_name: dog.name,
        breed: dog.breed || '',
        color: dog.color || '',
        sex: dog.gender || '',
        dog_photo: dog.photo_url,
        dog_weight: dog.weight,
        potty_alert_threshold: dog.potty_alert_threshold,
        requires_special_handling: dog.requires_special_handling,
        last_potty_time: sortedPottyBreaks.length > 0 ? sortedPottyBreaks[0].timestamp : null,
        last_feeding_time: sortedFeedingActivities.length > 0 ? sortedFeedingActivities[0].timestamp : null,
        feeding_times_today: dogFeedingActivities.map(fa => fa.timestamp) || [],
        potty_times_today: dogPottyBreaks.map(pb => pb.timestamp) || [],
        medication_times_today: [],
        last_care: sortedPottyBreaks.length > 0 ? sortedPottyBreaks[0].timestamp : null,
        flags: [] as DogFlag[],
        registration_number: dog.registration_number,
        microchip_number: dog.microchip_number,
        max_time_between_breaks: dog.max_time_between_breaks
      };
    });
    
    console.log(`Processed ${dogCareStatuses.length} dogs with care status`);
    return dogCareStatuses;
  } catch (error) {
    console.error('Error fetching dogs with care status:', error);
    throw error;
  }
};
