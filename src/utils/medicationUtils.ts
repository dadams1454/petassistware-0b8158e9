
export enum MedicationStatus {
  Active = 'active',
  Completed = 'completed',
  Upcoming = 'upcoming',
  Expired = 'expired',
  Missed = 'missed'
}

export enum MedicationFrequency {
  DAILY = 'once-daily',
  TWICE_DAILY = 'twice-daily',
  THREE_TIMES_DAILY = 'three-times-daily',
  FOUR_TIMES_DAILY = 'four-times-daily',
  EVERY_OTHER_DAY = 'every-other-day',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual'
}

export interface MedicationStatusResult {
  status: MedicationStatus | 'incomplete';
  statusColor: string;
}

/**
 * Get medication status based on dates and completion
 */
export const getMedicationStatus = (
  startDate: string,
  endDate?: string,
  completed?: boolean
): MedicationStatusResult => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (completed) {
    return {
      status: MedicationStatus.Completed,
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
  }
  
  if (end && end < now) {
    return {
      status: MedicationStatus.Completed,
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
  }
  
  if (start > now) {
    return {
      status: MedicationStatus.Upcoming,
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
  }
  
  if (start <= now && (!end || end >= now)) {
    return {
      status: MedicationStatus.Active,
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    };
  }

  return {
    status: MedicationStatus.Expired,
    statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
};

/**
 * Get time slots for a given frequency
 */
export const getTimeSlotsForFrequency = (frequency: MedicationFrequency): string[] => {
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return ['8:00 AM'];
    case MedicationFrequency.TWICE_DAILY:
      return ['8:00 AM', '8:00 PM'];
    case MedicationFrequency.THREE_TIMES_DAILY:
      return ['8:00 AM', '2:00 PM', '8:00 PM'];
    case MedicationFrequency.FOUR_TIMES_DAILY:
      return ['6:00 AM', '12:00 PM', '6:00 PM', '12:00 AM'];
    case MedicationFrequency.EVERY_OTHER_DAY:
      return ['8:00 AM'];
    case MedicationFrequency.WEEKLY:
      return ['8:00 AM'];
    case MedicationFrequency.MONTHLY:
      return ['8:00 AM'];
    case MedicationFrequency.QUARTERLY:
      return ['8:00 AM'];
    case MedicationFrequency.ANNUAL:
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
  frequency: MedicationFrequency
): Date => {
  const date = new Date(lastDate);
  
  switch (frequency) {
    case MedicationFrequency.DAILY:
      date.setDate(date.getDate() + 1);
      break;
    case MedicationFrequency.TWICE_DAILY:
      date.setHours(date.getHours() + 12);
      break;
    case MedicationFrequency.THREE_TIMES_DAILY:
      date.setHours(date.getHours() + 8);
      break;
    case MedicationFrequency.FOUR_TIMES_DAILY:
      date.setHours(date.getHours() + 6);
      break;
    case MedicationFrequency.EVERY_OTHER_DAY:
      date.setDate(date.getDate() + 2);
      break;
    case MedicationFrequency.WEEKLY:
      date.setDate(date.getDate() + 7);
      break;
    case MedicationFrequency.MONTHLY:
      date.setMonth(date.getMonth() + 1);
      break;
    case MedicationFrequency.QUARTERLY:
      date.setMonth(date.getMonth() + 3);
      break;
    case MedicationFrequency.ANNUAL:
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setDate(date.getDate() + 1);
  }
  
  return date;
};
