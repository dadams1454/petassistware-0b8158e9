
import { MedicationFrequency as MedicationFrequencyType } from '@/types/medication';
import { differenceInDays, differenceInHours, parseISO, addDays, addWeeks, addMonths, compareAsc } from 'date-fns';

// Re-export MedicationFrequency from types for consistent usage across the application
export { MedicationFrequency } from '@/types/medication';

/**
 * Medication status enum for consistent use across the application
 */
export enum MedicationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue'
}

/**
 * Type for medication status calculation result
 */
export type MedicationStatusResult = {
  status: 'current' | 'due_soon' | 'overdue' | 'incomplete';
  statusColor: string;
}

/**
 * Calculate the medication status based on last administration and frequency
 */
export const getMedicationStatus = (
  lastAdministeredDate: string | undefined, 
  frequency: MedicationFrequency
): MedicationStatusResult => {
  if (!lastAdministeredDate) {
    return {
      status: 'incomplete',
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
  }

  try {
    const lastAdministered = parseISO(lastAdministeredDate);
    const now = new Date();
    const daysSince = differenceInDays(now, lastAdministered);
    const hoursSince = differenceInHours(now, lastAdministered);

    // Define thresholds based on frequency
    let dueSoonThreshold = 0;
    let overdueThreshold = 0;

    switch (frequency) {
      case MedicationFrequency.DAILY:
        dueSoonThreshold = 0; // Same day
        overdueThreshold = 1; // 1+ days
        break;
      case MedicationFrequency.TWICE_DAILY:
        // For twice daily, use hours
        return hoursSince >= 14 
          ? { status: 'overdue', statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
          : hoursSince >= 9
          ? { status: 'due_soon', statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' }
          : { status: 'current', statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case MedicationFrequency.WEEKLY:
        dueSoonThreshold = 5; // 5-6 days
        overdueThreshold = 7; // 7+ days
        break;
      case MedicationFrequency.BIWEEKLY:
        dueSoonThreshold = 12; // 12-13 days
        overdueThreshold = 14; // 14+ days
        break;
      case MedicationFrequency.MONTHLY:
        dueSoonThreshold = 27; // 27-29 days
        overdueThreshold = 30; // 30+ days
        break;
      case MedicationFrequency.QUARTERLY:
        dueSoonThreshold = 85; // ~3 months - 5 days
        overdueThreshold = 90; // ~3 months
        break;
      case MedicationFrequency.ANNUALLY:
        dueSoonThreshold = 355; // ~1 year - 10 days
        overdueThreshold = 365; // ~1 year
        break;
      default:
        dueSoonThreshold = 2;
        overdueThreshold = 5;
        break;
    }

    // Determine status based on days since last administered
    if (daysSince >= overdueThreshold) {
      return {
        status: 'overdue',
        statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      };
    } else if (daysSince >= dueSoonThreshold) {
      return {
        status: 'due_soon',
        statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      };
    } else {
      return {
        status: 'current',
        statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      };
    }
  } catch (e) {
    // If date parsing fails, return incomplete status
    return {
      status: 'incomplete',
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
  }
};

/**
 * Format medication frequency for display
 */
export const formatMedicationFrequency = (frequency: MedicationFrequency): string => {
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return 'Daily';
    case MedicationFrequency.TWICE_DAILY:
      return 'Twice Daily';
    case MedicationFrequency.WEEKLY:
      return 'Weekly';
    case MedicationFrequency.BIWEEKLY:
      return 'Every 2 Weeks';
    case MedicationFrequency.MONTHLY:
      return 'Monthly';
    case MedicationFrequency.QUARTERLY:
      return 'Every 3 Months';
    case MedicationFrequency.ANNUALLY:
      return 'Yearly';
    case MedicationFrequency.AS_NEEDED:
      return 'As Needed';
    case MedicationFrequency.CUSTOM:
      return 'Custom Schedule';
    default:
      return String(frequency);
  }
};

/**
 * Get medication status class for UI display
 */
export const getMedicationStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'current':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'upcoming':
    case 'due_soon':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'discontinued':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
};

/**
 * Get time slots based on frequency
 */
export const getTimeSlotsForFrequency = (frequency: MedicationFrequencyType): string[] => {
  switch (frequency) {
    case MedicationFrequencyType.DAILY:
      return ['Morning', 'Evening'];
    case MedicationFrequencyType.TWICE_DAILY:
      return ['Morning', 'Noon', 'Evening'];
    case MedicationFrequencyType.WEEKLY:
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    case MedicationFrequencyType.BIWEEKLY:
      return ['Week 1', 'Week 2'];
    case MedicationFrequencyType.MONTHLY:
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    case MedicationFrequencyType.QUARTERLY:
      return ['January', 'April', 'July', 'October'];
    case MedicationFrequencyType.ANNUALLY:
      return ['Annual'];
    default:
      return ['As needed'];
  }
};

/**
 * Calculate the next due date based on medication frequency
 */
export const calculateNextDueDate = (startDate: Date, frequency: MedicationFrequencyType): Date => {
  const today = new Date();
  let nextDue: Date;

  switch (frequency) {
    case MedicationFrequencyType.DAILY:
      // If already given today, next is tomorrow
      nextDue = addDays(today, 1);
      break;
    case MedicationFrequencyType.TWICE_DAILY:
      // If morning dose, next is evening; if evening, next is morning of next day
      // For simplicity, just use 12 hours from now
      nextDue = new Date(today.getTime() + 12 * 60 * 60 * 1000);
      break;
    case MedicationFrequencyType.WEEKLY:
      nextDue = addWeeks(startDate, 1);
      if (compareAsc(nextDue, today) <= 0) {
        // If the calculated date is in the past, calculate from today
        nextDue = addWeeks(today, 1);
      }
      break;
    case MedicationFrequencyType.BIWEEKLY:
      nextDue = addWeeks(startDate, 2);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addWeeks(today, 2);
      }
      break;
    case MedicationFrequencyType.MONTHLY:
      nextDue = addMonths(startDate, 1);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addMonths(today, 1);
      }
      break;
    case MedicationFrequencyType.QUARTERLY:
      nextDue = addMonths(startDate, 3);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addMonths(today, 3);
      }
      break;
    case MedicationFrequencyType.ANNUALLY:
      nextDue = addMonths(startDate, 12);
      if (compareAsc(nextDue, today) <= 0) {
        nextDue = addMonths(today, 12);
      }
      break;
    case MedicationFrequencyType.AS_NEEDED:
    case MedicationFrequencyType.CUSTOM:
    default:
      // For as-needed or custom, don't set a specific next date
      nextDue = today;
      break;
  }

  return nextDue;
};
