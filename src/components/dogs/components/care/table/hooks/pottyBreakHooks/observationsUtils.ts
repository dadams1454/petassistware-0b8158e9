
import { ObservationRecord } from './observationTypes';

export const isObservationValid = (timestamp: string): boolean => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    // Valid if within the last 7 days
    return now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
  } catch (e) {
    return false;
  }
};

export const getTimeSlotFromTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const hours = date.getHours();
    return `${hours % 12 || 12}:00 ${hours >= 12 ? 'PM' : 'AM'}`;
  } catch (e) {
    return '';
  }
};

// Updated to use a more generic type since CareLog is not available
export const convertCareLogToObservation = (log: any): ObservationRecord => {
  const timeSlot = getTimeSlotFromTimestamp(log.timestamp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  
  return {
    id: log.id,
    dog_id: log.dog_id,
    created_at: log.created_at,
    observation: log.notes || log.task_name,
    observation_type: (log.task_name as any) || 'other',
    created_by: log.created_by,
    expires_at: expiresAt,
    timeSlot,
    category: log.category
  };
};
