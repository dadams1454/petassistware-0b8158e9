
import { DailyCarelog } from '@/types/dailyCare';
import { ObservationType } from './observationTypes';

// Function to convert a timestamp to the nearest time slot format
export const getTimeSlotFromTimestamp = (timestamp: string, category: string = 'observation'): string => {
  if (category === 'feeding_observation') {
    // For feeding, extract hour to determine meal time
    const date = new Date(timestamp);
    const hour = date.getHours();
    
    // Morning: 5-10, Noon: 10-3, Evening: 3-8
    if (hour >= 5 && hour < 10) return 'Morning';
    if (hour >= 10 && hour < 15) return 'Noon';
    return 'Evening';
  } else {
    // For potty breaks, use the original logic
    const date = new Date(timestamp);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12 in 12-hour format
    
    // Round to nearest hour for now
    const formattedHour = `${hours}:00 ${ampm}`;
    
    return formattedHour;
  }
};

// Helper function to check if an observation is not expired (less than 24 hours old)
export const isObservationValid = (timestamp: string): boolean => {
  const observationTime = new Date(timestamp);
  const now = new Date();
  // Valid if created within the last 24 hours
  return now.getTime() - observationTime.getTime() < 24 * 60 * 60 * 1000;
};

// Helper function to convert care log to observation format
export const convertCareLogToObservation = (log: DailyCarelog): ObservationType => ({
  id: log.id,
  dog_id: log.dog_id,
  created_at: log.created_at,
  observation: log.notes || '',
  observation_type: log.task_name as 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
  created_by: log.created_by,
  expires_at: new Date(new Date(log.timestamp).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  timeSlot: getTimeSlotFromTimestamp(log.timestamp, log.category),
  category: log.category
});
