
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
    
    // Simplified query to get dogs without trying to join too many tables at once
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('id, name, breed, gender, color, birthdate, photo_url, weight, microchip_number')
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
    
    // Map the dogs to DogCareStatus objects with simplified approach
    const dogCareStatuses: DogCareStatus[] = dogs.map(dog => {
      return {
        dog_id: dog.id,
        dog_name: dog.name,
        breed: dog.breed || '',
        color: dog.color || '',
        sex: dog.gender || '',
        dog_photo: dog.photo_url,
        dog_weight: dog.weight,
        potty_alert_threshold: 300, // Default value
        requires_special_handling: false,
        // Set default values for care fields
        last_potty_time: null,
        last_feeding_time: null,
        feeding_times_today: [],
        potty_times_today: [],
        medication_times_today: [],
        last_care: null,
        flags: [] as DogFlag[],
        registration_number: dog.microchip_number,
        microchip_number: dog.microchip_number,
      };
    });
    
    // Now that we have the dogs, fetch care logs separately for better performance
    try {
      const { data: careLogs, error: careLogsError } = await supabase
        .from('daily_care_logs')
        .select('*')
        .gte('timestamp', startOfDay.toISOString())
        .lte('timestamp', endOfDay.toISOString());
        
      if (careLogsError) {
        console.error('Error fetching care logs:', careLogsError);
      } else if (careLogs && careLogs.length > 0) {
        console.log(`Found ${careLogs.length} care logs for today`);
        
        // Process the care logs to update the dog care status objects
        careLogs.forEach(log => {
          const dogStatus = dogCareStatuses.find(status => status.dog_id === log.dog_id);
          if (dogStatus) {
            // Update last care information
            if (!dogStatus.last_care || new Date(log.timestamp) > new Date(dogStatus.last_care.timestamp)) {
              dogStatus.last_care = {
                category: log.category,
                task_name: log.task_name,
                timestamp: log.timestamp
              };
            }
            
            // Update specific care type information
            if (log.category.toLowerCase().includes('potty')) {
              dogStatus.last_potty_time = log.timestamp;
              dogStatus.potty_times_today = [...(dogStatus.potty_times_today || []), log.timestamp];
            } else if (log.category.toLowerCase().includes('feeding')) {
              dogStatus.last_feeding_time = log.timestamp;
              dogStatus.feeding_times_today = [...(dogStatus.feeding_times_today || []), log.timestamp];
            } else if (log.category.toLowerCase().includes('medication')) {
              dogStatus.medication_times_today = [...(dogStatus.medication_times_today || []), log.timestamp];
            }
          }
        });
      } else {
        console.log('No care logs found for today');
      }
    } catch (careError) {
      console.error('Error processing care logs:', careError);
      // Continue with basic dog information even if care logs fail
    }
    
    console.log(`Processed ${dogCareStatuses.length} dogs with care status`);
    return dogCareStatuses;
  } catch (error) {
    console.error('Error fetching dogs with care status:', error);
    throw error;
  }
};
