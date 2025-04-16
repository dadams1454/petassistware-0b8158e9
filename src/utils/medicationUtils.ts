
/**
 * Utility functions for medication management
 */
import { format, parseISO, isBefore, isAfter, differenceInDays, addDays } from 'date-fns';
import { Medication } from '@/types/health';
import { MedicationStatusEnum, MedicationStatusResult, MedicationStatusDetail } from '@/types/medication-status';

/**
 * Calculate the status of a medication
 */
export function calculateMedicationStatus(medication: Medication): MedicationStatusResult {
  // If medication is marked as inactive, return completed
  if (medication.is_active === false || medication.active === false) {
    return MedicationStatusEnum.COMPLETED;
  }
  
  const now = new Date();
  
  // Check if the medication has an end date and it's in the past
  if (medication.end_date) {
    const endDate = parseISO(medication.end_date);
    if (isAfter(now, endDate)) {
      return MedicationStatusEnum.COMPLETED;
    }
  }
  
  // Calculate next due date if last_administered exists
  let nextDue: Date | null = null;
  
  if (medication.last_administered) {
    const lastGiven = parseISO(medication.last_administered);
    
    // Calculate next due based on frequency
    switch (medication.frequency?.toLowerCase()) {
      case 'daily':
      case 'once daily':
        nextDue = addDays(lastGiven, 1);
        break;
      case 'twice daily':
        nextDue = addDays(lastGiven, 0.5);
        break;
      case 'three times daily':
        nextDue = addDays(lastGiven, 0.33);
        break;
      case 'every other day':
        nextDue = addDays(lastGiven, 2);
        break;
      case 'weekly':
        nextDue = addDays(lastGiven, 7);
        break;
      case 'biweekly':
        nextDue = addDays(lastGiven, 14);
        break;
      case 'monthly':
        nextDue = addDays(lastGiven, 30);
        break;
      default:
        // If frequency is unknown, default to daily
        nextDue = addDays(lastGiven, 1);
    }
  } else if (medication.start_date) {
    // If no administration record, use start date
    nextDue = parseISO(medication.start_date);
  }
  
  // If we couldn't determine next due date, mark as pending
  if (!nextDue) {
    return MedicationStatusEnum.PENDING;
  }
  
  // Calculate detailed status based on next due date
  const daysUntilDue = differenceInDays(nextDue, now);
  
  // If next due date is today (or in the past by less than 1 day)
  if (daysUntilDue <= 0 && daysUntilDue > -1) {
    const result: MedicationStatusDetail = {
      status: MedicationStatusEnum.DUE,
      message: 'Due today',
      nextDue: nextDue
    };
    return result;
  }
  
  // If next due date is in the past (overdue)
  if (daysUntilDue < 0) {
    const daysOverdue = Math.abs(daysUntilDue);
    const result: MedicationStatusDetail = {
      status: MedicationStatusEnum.OVERDUE,
      message: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
      daysOverdue,
      nextDue: nextDue
    };
    return result;
  }
  
  // If next due date is in the future (upcoming)
  const result: MedicationStatusDetail = {
    status: MedicationStatusEnum.UPCOMING,
    message: `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
    daysUntilDue,
    nextDue: nextDue
  };
  return result;
}

/**
 * Format a date string to a human-readable format
 */
export function formatDateToDisplay(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Determine if a medication is preventative
 */
export function isPreventativeMedication(medication: Medication): boolean {
  // Look for keywords in name or notes that suggest preventative purpose
  const preventativeTerms = [
    'prevent', 
    'flea', 
    'tick', 
    'heartworm', 
    'worm', 
    'parasite', 
    'deworm'
  ];
  
  const nameToCheck = (medication.name || medication.medication_name || '').toLowerCase();
  const notesToCheck = (medication.notes || '').toLowerCase();
  
  return preventativeTerms.some(term => 
    nameToCheck.includes(term) || notesToCheck.includes(term)
  );
}

/**
 * Sort medications by status priority (due/overdue first, then upcoming, then others)
 */
export function sortMedicationsByPriority(medications: Medication[]): Medication[] {
  return [...medications].sort((a, b) => {
    const statusA = a.status || MedicationStatusEnum.PENDING;
    const statusB = b.status || MedicationStatusEnum.PENDING;
    
    const getPriority = (status: MedicationStatusResult): number => {
      const statusValue = typeof status === 'object' ? status.status : status;
      switch (statusValue) {
        case MedicationStatusEnum.OVERDUE:
          return 0;
        case MedicationStatusEnum.DUE:
          return 1;
        case MedicationStatusEnum.UPCOMING:
          return 2;
        case MedicationStatusEnum.ADMINISTERED:
          return 3;
        case MedicationStatusEnum.PENDING:
          return 4;
        case MedicationStatusEnum.PAUSED:
          return 5;
        case MedicationStatusEnum.COMPLETED:
          return 6;
        default:
          return 7;
      }
    };
    
    return getPriority(statusA) - getPriority(statusB);
  });
}
