
import { formatDateToYYYYMMDD } from './dateUtils';

export enum MedicationStatus {
  Active = 'active',
  Completed = 'completed',
  Upcoming = 'upcoming',
  Expired = 'expired',
  Missed = 'missed'
}

export enum MedicationFrequency {
  Once = 'once',
  Daily = 'daily',
  BID = 'bid', // Twice daily
  TID = 'tid', // Three times daily
  QID = 'qid', // Four times daily
  Weekly = 'weekly',
  Biweekly = 'biweekly',
  Monthly = 'monthly',
  AsNeeded = 'as_needed',
  Custom = 'custom'
}

/**
 * Get the status of a medication based on its dates and administration history
 */
export const getMedicationStatus = (
  startDate: string | Date,
  endDate: string | Date | null | undefined,
  lastAdministered: string | Date | null | undefined,
  frequency: string
): MedicationStatus => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const lastAdmin = lastAdministered ? new Date(lastAdministered) : null;
  
  // If medication hasn't started yet
  if (start > now) {
    return MedicationStatus.Upcoming;
  }
  
  // If medication has been completed
  if (end && end < now) {
    return MedicationStatus.Completed;
  }
  
  // If medication is current but overdue
  if (isOverdue(lastAdmin, frequency, now)) {
    return MedicationStatus.Missed;
  }
  
  // If medication is active and not overdue
  return MedicationStatus.Active;
};

/**
 * Determine if a medication is overdue based on last administration and frequency
 */
const isOverdue = (
  lastAdministered: Date | null, 
  frequency: string, 
  now: Date
): boolean => {
  if (!lastAdministered) {
    return true; // No administration record means it's overdue
  }
  
  const daysSinceLastAdmin = Math.floor(
    (now.getTime() - lastAdministered.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  switch (frequency.toLowerCase()) {
    case 'once':
      return false; // Once-only medications are never overdue after administration
    case 'daily':
      return daysSinceLastAdmin > 1;
    case 'bid': // Twice daily
      return daysSinceLastAdmin > 0.5;
    case 'tid': // Three times daily
      return daysSinceLastAdmin > 0.33;
    case 'qid': // Four times daily
      return daysSinceLastAdmin > 0.25;
    case 'weekly':
      return daysSinceLastAdmin > 7;
    case 'biweekly':
      return daysSinceLastAdmin > 14;
    case 'monthly':
      return daysSinceLastAdmin > 30;
    case 'as_needed':
      return false; // As-needed medications are never overdue
    default:
      return daysSinceLastAdmin > 1; // Default to daily
  }
};

/**
 * Get the times of day for medication administration based on frequency
 */
export const getTimeSlotsForFrequency = (frequency: string): string[] => {
  switch (frequency.toLowerCase()) {
    case 'once':
      return ['9:00 AM'];
    case 'daily':
      return ['9:00 AM'];
    case 'bid': // Twice daily
      return ['9:00 AM', '9:00 PM'];
    case 'tid': // Three times daily
      return ['8:00 AM', '2:00 PM', '8:00 PM'];
    case 'qid': // Four times daily
      return ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM'];
    case 'weekly':
      return ['Monday 9:00 AM'];
    case 'biweekly':
      return ['Monday 9:00 AM (every 2 weeks)'];
    case 'monthly':
      return ['1st of month 9:00 AM'];
    case 'as_needed':
      return ['As needed'];
    default:
      return ['9:00 AM'];
  }
};

/**
 * Calculate the next due date/time for a medication
 */
export const calculateNextDueDate = (
  lastAdministered: string | Date | null | undefined,
  frequency: string,
  startDate: string | Date
): Date => {
  const start = new Date(startDate);
  
  // If no last administration, use start date
  if (!lastAdministered) {
    return start;
  }
  
  const lastAdmin = new Date(lastAdministered);
  const nextDue = new Date(lastAdmin);
  
  switch (frequency.toLowerCase()) {
    case 'once':
      return lastAdmin; // No next due date for once-only medications
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case 'bid': // Twice daily
      nextDue.setHours(nextDue.getHours() + 12);
      break;
    case 'tid': // Three times daily
      nextDue.setHours(nextDue.getHours() + 8);
      break;
    case 'qid': // Four times daily
      nextDue.setHours(nextDue.getHours() + 6);
      break;
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case 'biweekly':
      nextDue.setDate(nextDue.getDate() + 14);
      break;
    case 'monthly':
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    case 'as_needed':
      return new Date(); // For as-needed, use current date
    default:
      nextDue.setDate(nextDue.getDate() + 1); // Default to daily
  }
  
  return nextDue;
};
