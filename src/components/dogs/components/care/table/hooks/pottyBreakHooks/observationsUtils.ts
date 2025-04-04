
import { format } from 'date-fns';
import { ObservationRecord, ObservationType } from './observationTypes';

// Check if observation is still valid (within 24 hours)
export function isObservationValid(timestamp: string | Date): boolean {
  const observationDate = new Date(timestamp);
  const now = new Date();
  const hourDifference = (now.getTime() - observationDate.getTime()) / (1000 * 60 * 60);
  return hourDifference <= 24; // Valid for 24 hours
}

// Convert timestamp to time slot format
export function getTimeSlotFromTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const hours = date.getHours();
    let slot = '';
    
    if (hours >= 5 && hours < 8) {
      slot = 'morning';
    } else if (hours >= 8 && hours < 12) {
      slot = 'morning';
    } else if (hours >= 12 && hours < 17) {
      slot = 'afternoon';
    } else {
      slot = 'evening';
    }
    
    return slot;
  } catch (error) {
    console.error('Error parsing timestamp for time slot:', error);
    return 'morning'; // Default fallback
  }
}

// Convert care log to observation record
export function convertCareLogToObservation(careLog: any): ObservationRecord {
  return {
    id: careLog.id,
    dog_id: careLog.dog_id,
    observation: careLog.notes || `${careLog.task_name} observed`,
    observation_type: (careLog.task_name as ObservationType) || 'other',
    created_at: careLog.timestamp || careLog.created_at,
    created_by: careLog.created_by,
    timeSlot: getTimeSlotFromTimestamp(careLog.timestamp || careLog.created_at),
    category: careLog.category || 'observation',
    expires_at: new Date(new Date(careLog.timestamp || careLog.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
