
export enum MedicationStatus {
  Active = 'active',
  Completed = 'completed',
  Upcoming = 'upcoming',
  Expired = 'expired',
  Missed = 'missed'
}

/**
 * Get medication status based on dates and completion
 */
export const getMedicationStatus = (
  startDate: string,
  endDate?: string,
  completed?: boolean
): MedicationStatus => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (completed) {
    return MedicationStatus.Completed;
  }
  
  if (end && end < now) {
    return MedicationStatus.Completed;
  }
  
  if (start > now) {
    return MedicationStatus.Upcoming;
  }
  
  if (start <= now && (!end || end >= now)) {
    return MedicationStatus.Active;
  }

  return MedicationStatus.Expired;
};

/**
 * Get time slots for a given frequency
 */
export const getTimeSlotsForFrequency = (frequency: string): string[] => {
  switch (frequency) {
    case 'once-daily':
      return ['8:00 AM'];
    case 'twice-daily':
      return ['8:00 AM', '8:00 PM'];
    case 'three-times-daily':
      return ['8:00 AM', '2:00 PM', '8:00 PM'];
    case 'four-times-daily':
      return ['6:00 AM', '12:00 PM', '6:00 PM', '12:00 AM'];
    case 'every-other-day':
      return ['8:00 AM'];
    case 'weekly':
      return ['8:00 AM'];
    case 'monthly':
      return ['8:00 AM'];
    default:
      return ['8:00 AM'];
  }
};

/**
 * Calculate the next due date based on a frequency
 */
export const calculateNextDueDate = (
  lastDate: Date | string,
  frequency: string
): Date => {
  const date = new Date(lastDate);
  
  switch (frequency) {
    case 'once-daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'twice-daily':
      date.setHours(date.getHours() + 12);
      break;
    case 'three-times-daily':
      date.setHours(date.getHours() + 8);
      break;
    case 'four-times-daily':
      date.setHours(date.getHours() + 6);
      break;
    case 'every-other-day':
      date.setDate(date.getDate() + 2);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      date.setDate(date.getDate() + 1);
  }
  
  return date;
};
