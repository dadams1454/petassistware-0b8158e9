
import { DailyCarelog } from '@/types/dailyCare';
import { Observation } from './observationTypes';

/**
 * Check if an observation timestamp is still valid (within 24 hours)
 */
export const isObservationValid = (timestamp: string): boolean => {
  const observationTime = new Date(timestamp);
  const now = new Date();
  
  // 24 hour expiration
  const expiration = new Date(observationTime);
  expiration.setHours(expiration.getHours() + 24);
  
  return expiration > now;
};

/**
 * Convert a timestamp to a time slot string
 */
export const getTimeSlotFromTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const formattedHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const amPm = hours >= 12 ? 'PM' : 'AM';
  
  return `${formattedHour}:00 ${amPm}`;
};

/**
 * Convert a care log to an observation object
 */
export const convertCareLogToObservation = (log: DailyCarelog): Observation => {
  return {
    id: log.id,
    dog_id: log.dog_id,
    created_at: log.created_at,
    observation: log.notes || log.task_name,
    observation_type: log.task_name,
    created_by: log.created_by,
    expires_at: new Date(new Date(log.timestamp).getTime() + 24 * 60 * 60 * 1000).toISOString(),
    timeSlot: getTimeSlotFromTimestamp(log.timestamp),
    category: log.category === 'feeding' ? 'feeding_observation' : 'observation'
  };
};
