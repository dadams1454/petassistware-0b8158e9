import { format, addDays, differenceInDays, parseISO } from 'date-fns';

// Define MedicationFrequency enum
export enum MedicationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Biweekly = 'biweekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
  AsNeeded = 'as_needed'
}

// Define MedicationStatus enum
export enum MedicationStatus {
  Current = 'current',
  Due = 'due',
  Overdue = 'overdue',
  Upcoming = 'upcoming',
  Completed = 'completed',
  Active = 'active',
  Expired = 'expired',
  Missed = 'missed'
}

/**
 * Determines the status of a medication based on its schedule
 * @param startDate Start date of medication
 * @param endDate End date of medication (if applicable)
 * @param lastAdministered Date the medication was last administered
 * @param frequency How often the medication should be given
 * @returns Status object with status and color information
 */
export const getMedicationStatus = (
  startDate: string,
  endDate?: string,
  lastAdministered?: string,
  frequency?: string
) => {
  const today = new Date();
  const start = parseISO(startDate);
  const end = endDate ? parseISO(endDate) : null;
  const lastGiven = lastAdministered ? parseISO(lastAdministered) : null;
  
  // Check if medication is completed (past end date)
  if (end && end < today) {
    return { 
      status: MedicationStatus.Completed,
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
  }
  
  // Check if medication hasn't started yet
  if (start > today) {
    return { 
      status: MedicationStatus.Upcoming,
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
  }
  
  // If no last administered date, it's due if the start date is today or earlier
  if (!lastGiven) {
    return {
      status: MedicationStatus.Due,
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    };
  }
  
  // Calculate next due date based on frequency
  let nextDueDate = lastGiven;
  
  if (frequency === MedicationFrequency.Daily) {
    nextDueDate = addDays(lastGiven, 1);
  } else if (frequency === MedicationFrequency.Weekly) {
    nextDueDate = addDays(lastGiven, 7);
  } else if (frequency === MedicationFrequency.Monthly) {
    // Add 30 days for monthly
    nextDueDate = addDays(lastGiven, 30);
  } else if (frequency === MedicationFrequency.Quarterly) {
    // Add 90 days for quarterly
    nextDueDate = addDays(lastGiven, 90);
  } else if (frequency === MedicationFrequency.Annual) {
    // Add 365 days for annual
    nextDueDate = addDays(lastGiven, 365);
  } else {
    // Default to as-needed (no next due date)
    return { 
      status: MedicationStatus.Current,
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
  }
  
  // If next due date is in the past, it's overdue
  if (nextDueDate < today) {
    // Calculate how overdue
    const daysOverdue = differenceInDays(today, nextDueDate);
    
    return {
      status: MedicationStatus.Overdue,
      daysOverdue,
      nextDueDate: format(nextDueDate, 'MMM d, yyyy'),
      statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
  }
  
  // Otherwise, it's current and will be due on the next due date
  return {
    status: MedicationStatus.Current,
    nextDueDate: format(nextDueDate, 'MMM d, yyyy'),
    daysUntilDue: differenceInDays(nextDueDate, today),
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };
};

/**
 * Checks if a status object contains complex status info (vs. just a string)
 */
export const isComplexStatus = (
  status: any
): status is { status: string; statusColor: string } => {
  return typeof status === 'object' && 'status' in status && 'statusColor' in status;
};

/**
 * Gets the appropriate status color for a given status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case MedicationStatus.Current:
    case MedicationStatus.Active:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case MedicationStatus.Completed:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    case MedicationStatus.Upcoming:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case MedicationStatus.Due:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case MedicationStatus.Overdue:
    case MedicationStatus.Missed:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case MedicationStatus.Expired:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

/**
 * Extracts the status value from either a string or complex status object
 */
export const getStatusValue = (status: string | { status: string }): string => {
  if (typeof status === 'string') {
    return status;
  }
  return status.status;
};

/**
 * Gets time slots for a medication frequency
 * Used by time managers for scheduled medications
 */
export const getTimeSlotsForFrequency = (frequency: MedicationFrequency): string[] => {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return ['7:00 AM', '8:00 AM', '12:00 PM', '6:00 PM', '9:00 PM'];
    case MedicationFrequency.Weekly:
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    case MedicationFrequency.Monthly:
      return ['1st of month', '15th of month', 'Last day of month'];
    case MedicationFrequency.Quarterly:
      return ['January', 'April', 'July', 'October'];
    case MedicationFrequency.Annual:
      return ['January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December'];
    case MedicationFrequency.AsNeeded:
      return ['As needed'];
    default:
      return ['Morning', 'Afternoon', 'Evening'];
  }
};

/**
 * Calculate the next due date based on frequency and last administered date
 */
export const calculateNextDueDate = (
  lastAdministered: Date,
  frequency: MedicationFrequency
): Date => {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return addDays(lastAdministered, 1);
    case MedicationFrequency.Weekly:
      return addDays(lastAdministered, 7);
    case MedicationFrequency.Monthly:
      return addDays(lastAdministered, 30);
    case MedicationFrequency.Quarterly:
      return addDays(lastAdministered, 90);
    case MedicationFrequency.Annual:
      return addDays(lastAdministered, 365);
    default:
      return addDays(lastAdministered, 30); // Default to monthly
  }
};

// Export types for status results
export interface MedicationStatusResult {
  status: string;
  statusColor: string;
  daysOverdue?: number;
  nextDueDate?: string;
  daysUntilDue?: number;
}

export type StatusWithColor = {
  status: string;
  statusColor: string;
};
