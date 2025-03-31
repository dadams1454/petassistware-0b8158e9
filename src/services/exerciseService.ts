
import { supabase } from '@/integrations/supabase/client';

export interface ExerciseRecord {
  id: string;
  dog_id: string;
  exercise_type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  location: string;
  weather_conditions?: string;
  notes?: string;
  performed_by?: string;
  timestamp: string;
  created_at: string;
}

export interface ExerciseSummary {
  totalDuration: number;
  exerciseCount: number;
  averageDuration: number;
  byType: Record<string, number>;
  byIntensity: Record<string, number>;
}

/**
 * Record a new exercise activity
 */
export async function recordExercise(exercise: Omit<ExerciseRecord, 'id' | 'created_at'>): Promise<ExerciseRecord> {
  try {
    const { data, error } = await supabase
      .from('daily_care_logs')
      .insert([{
        dog_id: exercise.dog_id,
        category: 'exercise',
        task_name: exercise.exercise_type,
        timestamp: exercise.timestamp,
        notes: exercise.notes,
        created_by: exercise.performed_by,
        medication_metadata: {
          duration: exercise.duration,
          intensity: exercise.intensity,
          location: exercise.location,
          weather_conditions: exercise.weather_conditions
        }
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform the care log into an exercise record
    const metadataObj = typeof data.medication_metadata === 'string' 
      ? JSON.parse(data.medication_metadata) 
      : data.medication_metadata;
    
    return {
      id: data.id,
      dog_id: data.dog_id,
      exercise_type: data.task_name,
      duration: metadataObj?.duration || 0,
      intensity: metadataObj?.intensity || 'moderate',
      location: metadataObj?.location || '',
      weather_conditions: metadataObj?.weather_conditions,
      notes: data.notes,
      performed_by: data.created_by,
      timestamp: data.timestamp,
      created_at: data.created_at
    } as ExerciseRecord;
  } catch (error) {
    console.error('Error recording exercise:', error);
    throw error;
  }
}

/**
 * Get exercise records for a dog
 */
export async function getDogExerciseHistory(dogId: string, days: number = 30): Promise<ExerciseRecord[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('daily_care_logs')
      .select('*')
      .eq('dog_id', dogId)
      .eq('category', 'exercise')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    // Transform care logs to exercise records
    return (data || []).map(log => {
      const metadataObj = typeof log.medication_metadata === 'string' 
        ? JSON.parse(log.medication_metadata) 
        : log.medication_metadata;
        
      return {
        id: log.id,
        dog_id: log.dog_id,
        exercise_type: log.task_name,
        duration: metadataObj?.duration || 0,
        intensity: metadataObj?.intensity || 'moderate',
        location: metadataObj?.location || '',
        weather_conditions: metadataObj?.weather_conditions,
        notes: log.notes,
        performed_by: log.created_by,
        timestamp: log.timestamp,
        created_at: log.created_at
      } as ExerciseRecord;
    });
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    return [];
  }
}

/**
 * Calculate exercise summary statistics
 */
export function calculateExerciseSummary(exercises: ExerciseRecord[]): ExerciseSummary {
  if (!exercises.length) {
    return {
      totalDuration: 0,
      exerciseCount: 0,
      averageDuration: 0,
      byType: {},
      byIntensity: {}
    };
  }
  
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  
  // Group by exercise type
  const byType: Record<string, number> = {};
  exercises.forEach(ex => {
    byType[ex.exercise_type] = (byType[ex.exercise_type] || 0) + ex.duration;
  });
  
  // Group by intensity
  const byIntensity: Record<string, number> = {};
  exercises.forEach(ex => {
    byIntensity[ex.intensity] = (byIntensity[ex.intensity] || 0) + ex.duration;
  });
  
  return {
    totalDuration,
    exerciseCount: exercises.length,
    averageDuration: totalDuration / exercises.length,
    byType,
    byIntensity
  };
}

/**
 * Get recommended exercise by dog attributes
 */
export function getExerciseRecommendations(
  breed: string, 
  age: number, 
  weight: number, 
  healthConditions: string[] = []
): { 
  recommendedTypes: string[], 
  dailyMinutes: number, 
  maxIntensity: 'low' | 'moderate' | 'high',
  warnings: string[]
} {
  // Default recommendations
  let recommendedTypes = ['Walk', 'Play'];
  let dailyMinutes = 30;
  let maxIntensity: 'low' | 'moderate' | 'high' = 'moderate';
  const warnings: string[] = [];
  
  // Basic logic for customization (can be expanded with more detailed logic)
  
  // Age adjustments
  if (age < 1) {
    dailyMinutes = 15; // Puppies need less structured exercise
    maxIntensity = 'low';
    recommendedTypes = ['Short Walk', 'Gentle Play'];
    warnings.push('Puppies should avoid high-impact exercise until fully grown');
  } else if (age > 8) {
    dailyMinutes = 20; // Senior dogs
    maxIntensity = 'low';
    recommendedTypes = ['Gentle Walk', 'Mental Stimulation'];
    warnings.push('Senior dogs may need more rest between exercise sessions');
  }
  
  // Large breed considerations
  const largeBreeds = ['Newfoundland', 'Saint Bernard', 'Great Dane', 'Mastiff'];
  if (largeBreeds.includes(breed) || weight > 90) {
    if (age < 2) {
      warnings.push('Large breed puppies should avoid jumping and stairs until skeletal maturity');
    }
    recommendedTypes.push('Swimming');
  }
  
  // Health condition adjustments
  if (healthConditions.some(condition => ['arthritis', 'hip dysplasia', 'joint issues'].includes(condition.toLowerCase()))) {
    maxIntensity = 'low';
    recommendedTypes = recommendedTypes.filter(type => type !== 'Running').concat(['Swimming', 'Hydrotherapy']);
    warnings.push('Low-impact exercise recommended due to joint/mobility issues');
  }
  
  // High-energy breeds
  const highEnergyBreeds = ['Border Collie', 'Australian Shepherd', 'Jack Russell Terrier'];
  if (highEnergyBreeds.includes(breed) && !healthConditions.length) {
    dailyMinutes = 60;
    maxIntensity = 'high';
    recommendedTypes.push('Agility', 'Fetch', 'Running');
  }
  
  return {
    recommendedTypes,
    dailyMinutes,
    maxIntensity,
    warnings
  };
}
