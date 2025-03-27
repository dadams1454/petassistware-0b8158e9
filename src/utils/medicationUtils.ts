
import { MedicationFrequency, MedicationStatus } from '@/types/medication';
import { format, parseISO, addDays, addWeeks, addMonths, isAfter } from 'date-fns';

// Re-export the enum for components that import from here
export { MedicationFrequency, MedicationStatus } from '@/types/medication';

// Determine status based on last administered date and frequency
export const getMedicationStatus = (
  lastAdministered: string | undefined,
  frequency: MedicationFrequency
): { status: MedicationStatus | 'incomplete'; statusColor: string } => {
  // If no administration record, return incomplete
  if (!lastAdministered) {
    return {
      status: 'incomplete',
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
  }

  // Parse the date
  try {
    const lastDate = parseISO(lastAdministered);
    const today = new Date();
    let nextDueDate: Date;

    // Calculate next due date based on frequency
    switch (frequency) {
      case MedicationFrequency.DAILY:
        nextDueDate = addDays(lastDate, 1);
        break;
      case MedicationFrequency.TWICE_DAILY:
        // Simplified: just 12 hours later
        nextDueDate = new Date(lastDate.getTime() + 12 * 60 * 60 * 1000);
        break;
      case MedicationFrequency.WEEKLY:
        nextDueDate = addDays(lastDate, 7);
        break;
      case MedicationFrequency.BIWEEKLY:
        nextDueDate = addDays(lastDate, 14);
        break;
      case MedicationFrequency.MONTHLY:
        nextDueDate = addMonths(lastDate, 1);
        break;
      case MedicationFrequency.QUARTERLY:
        nextDueDate = addMonths(lastDate, 3);
        break;
      case MedicationFrequency.ANNUALLY:
        nextDueDate = addMonths(lastDate, 12);
        break;
      case MedicationFrequency.AS_NEEDED:
      case MedicationFrequency.CUSTOM:
      case MedicationFrequency.OTHER:
      default:
        // For as-needed/custom frequencies, always consider current
        return {
          status: MedicationStatus.CURRENT,
          statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
    }

    // If next due date is in the future
    if (isAfter(nextDueDate, today)) {
      // If due within 3 days
      const dueWithinDays = 3;
      const warningDate = addDays(today, dueWithinDays);
      
      if (isAfter(nextDueDate, warningDate)) {
        return {
          status: MedicationStatus.CURRENT,
          statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
      } else {
        // Due soon
        return {
          status: 'due_soon',
          statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
      }
    } else {
      // Overdue
      return {
        status: MedicationStatus.OVERDUE,
        statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      };
    }
  } catch (error) {
    console.error('Error parsing medication date:', error);
    return {
      status: 'incomplete',
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
  }
};

// Calculate next due date based on frequency
export const getNextDueDate = (
  lastAdministered: string | Date,
  frequency: MedicationFrequency
): Date => {
  const lastDate = typeof lastAdministered === 'string'
    ? parseISO(lastAdministered)
    : lastAdministered;

  switch (frequency) {
    case MedicationFrequency.DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequency.TWICE_DAILY:
      return new Date(lastDate.getTime() + 12 * 60 * 60 * 1000);
    case MedicationFrequency.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequency.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequency.MONTHLY:
      return addMonths(lastDate, 1);
    case MedicationFrequency.QUARTERLY:
      return addMonths(lastDate, 3);
    case MedicationFrequency.ANNUALLY:
      return addMonths(lastDate, 12);
    default:
      // For other frequencies, default to one week
      return addDays(lastDate, 7);
  }
};

// Format a medication date for display
export const formatMedicationDate = (date: string | null | undefined): string => {
  if (!date) return 'Not set';
  
  try {
    return format(parseISO(date), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting medication date:', error);
    return 'Invalid date';
  }
};
