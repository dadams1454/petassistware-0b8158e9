
import { supabase } from '@/integrations/supabase/client';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import { getLatestCareLogsByCategory } from './careLogsService';

/**
 * Fetches all dogs with their care status information for a specific date
 * @param date The date to fetch care status for
 * @returns Array of dogs with care status
 */
export const fetchAllDogsWithCareStatus = async (date = new Date()): Promise<DogCareStatus[]> => {
  try {
    console.log(`Fetching dogs with care status for date: ${date.toISOString().slice(0, 10)}`);
    
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
      
    if (dogsError) {
      console.error('Error fetching dogs:', dogsError);
      throw dogsError;
    }
    
    if (!dogs || dogs.length === 0) {
      console.log('No dogs found in database');
      return [];
    }
    
    console.log(`Found ${dogs.length} dogs`);
    
    // For each dog, fetch their latest care logs for each category
    const dogCareStatuses: DogCareStatus[] = await Promise.all(dogs.map(async (dog) => {
      // Get the latest care logs for all categories
      const latestLogs = await getLatestCareLogsByCategory(dog.id);
      
      // Create a basic dog care status object
      const dogStatus: DogCareStatus = {
        dog_id: dog.id,
        dog_name: dog.name,
        breed: dog.breed, 
        color: dog.color || '', 
        sex: dog.gender || '', 
        dog_photo: dog.photo_url,
        dog_weight: dog.weight,
        potty_alert_threshold: dog.potty_alert_threshold,
        requires_special_handling: dog.requires_special_handling,
        last_potty_time: latestLogs.pottybreaks?.timestamp || null,
        last_feeding_time: latestLogs.feeding?.timestamp || null,
        last_medication_time: latestLogs.medication?.timestamp || null,
        last_grooming_time: latestLogs.grooming?.timestamp || null,
        last_exercise_time: latestLogs.exercise?.timestamp || null,
        last_wellness_time: latestLogs.wellness?.timestamp || null,
        last_training_time: latestLogs.training?.timestamp || null,
        feeding_times_today: [],
        potty_times_today: [],
        medication_times_today: [],
        exercise_times_today: [],
        grooming_times_today: [],
        wellness_times_today: [],
        training_times_today: [],
        // Determine the most recent care of any type for the "last_care" field
        last_care: determineLastCare(latestLogs),
        flags: [] as DogFlag[]
      };
      
      // Fetch today's care logs for each category to populate the *_times_today arrays
      await populateTodayCareLogs(dogStatus, startOfDay, endOfDay);
      
      return dogStatus;
    }));
    
    return dogCareStatuses;
  } catch (error) {
    console.error('Error fetching dogs with care status:', error);
    throw error;
  }
};

/**
 * Determines the most recent care log from a set of logs
 */
function determineLastCare(latestLogs: Record<string, any>) {
  // Get all logs that aren't null
  const validLogs = Object.entries(latestLogs)
    .filter(([_, log]) => log !== null)
    .map(([category, log]) => ({ ...log, category }));
  
  if (validLogs.length === 0) return null;
  
  // Sort by timestamp and get the most recent
  validLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const mostRecent = validLogs[0];
  
  return {
    category: mostRecent.category,
    task_name: mostRecent.task_name,
    timestamp: mostRecent.timestamp
  };
}

/**
 * Populates today's care logs for each category
 */
async function populateTodayCareLogs(dogStatus: DogCareStatus, startOfDay: Date, endOfDay: Date) {
  try {
    const dogId = dogStatus.dog_id;
    
    // Fetch all care logs for today for this dog
    const { data: todayLogs, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .gte('timestamp', startOfDay.toISOString())
      .lte('timestamp', endOfDay.toISOString())
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error('Error fetching today\'s care logs:', error);
      return;
    }
    
    if (!todayLogs || todayLogs.length === 0) {
      // No logs today
      return;
    }
    
    // Group logs by category
    const categories = {
      pottybreaks: 'potty_times_today',
      feeding: 'feeding_times_today',
      medication: 'medication_times_today',
      exercise: 'exercise_times_today',
      grooming: 'grooming_times_today',
      wellness: 'wellness_times_today',
      training: 'training_times_today'
    };
    
    // Process each log and add to the appropriate array
    todayLogs.forEach(log => {
      const categoryKey = categories[log.category as keyof typeof categories];
      if (categoryKey && dogStatus[categoryKey as keyof DogCareStatus]) {
        // Cast to any because TypeScript doesn't know these are arrays
        (dogStatus[categoryKey as keyof DogCareStatus] as any).push(log);
      }
    });
    
  } catch (error) {
    console.error('Error in populateTodayCareLogs:', error);
  }
}
