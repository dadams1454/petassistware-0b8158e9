
// Medication utility functions and constants

export enum MedicationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Biweekly = 'biweekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annually',
  AsNeeded = 'as_needed',
  Other = 'other'
}

export enum MedicationStatus {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  Pending = 'pending',
  Expired = 'expired',
  Upcoming = 'upcoming',
  Missed = 'missed'
}

// Define additional types for status results
export type MedicationStatusResult = 
  | MedicationStatus 
  | 'current' 
  | 'due_soon' 
  | 'overdue' 
  | 'incomplete';

/**
 * Get human-readable form of medication frequency
 */
export const getFrequencyLabel = (frequency: string): string => {
  switch (frequency?.toLowerCase()) {
    case MedicationFrequency.Daily:
      return 'Daily';
    case MedicationFrequency.Weekly:
      return 'Weekly';
    case MedicationFrequency.Biweekly:
      return 'Every 2 weeks';
    case MedicationFrequency.Monthly:
      return 'Monthly';
    case MedicationFrequency.Quarterly:
      return 'Every 3 months';
    case MedicationFrequency.Annual:
      return 'Yearly';
    case MedicationFrequency.AsNeeded:
      return 'As needed';
    case MedicationFrequency.Other:
      return 'Other';
    default:
      return frequency || 'Unknown';
  }
};

/**
 * Calculate the next due date based on frequency
 */
export const calculateNextDueDate = (
  lastDate: Date, 
  frequency: string
): Date => {
  const nextDate = new Date(lastDate);
  
  switch (frequency?.toLowerCase()) {
    case MedicationFrequency.Daily:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case MedicationFrequency.Weekly:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case MedicationFrequency.Biweekly:
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case MedicationFrequency.Monthly:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case MedicationFrequency.Quarterly:
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case MedicationFrequency.Annual:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      // Default to monthly if frequency is unknown
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
};

/**
 * Determine medication status based on dates and frequency
 */
export const getMedicationStatus = (
  startDate?: string | null,
  endDate?: string | null,
  lastAdministered?: string | null,
  frequency?: string | null
): MedicationStatusResult => {
  if (!lastAdministered) {
    return MedicationStatus.Pending;
  }

  const today = new Date();
  const lastAdminDate = new Date(lastAdministered);
  
  // Handle expiration
  if (endDate && new Date(endDate) < today) {
    return MedicationStatus.Expired;
  }
  
  // Calculate next due date based on frequency
  if (!frequency) {
    return MedicationStatus.Active;
  }
  
  const nextDue = calculateNextDueDate(lastAdminDate, frequency);
  
  // Determine if medication is due or overdue
  if (nextDue < today) {
    // Overdue by more than 7 days
    if ((today.getTime() - nextDue.getTime()) > 7 * 24 * 60 * 60 * 1000) {
      return 'overdue';
    }
    return 'due_soon';
  }
  
  // Due within next 3 days
  if ((nextDue.getTime() - today.getTime()) < 3 * 24 * 60 * 60 * 1000) {
    return 'due_soon';
  }
  
  return 'current';
};

// Extended status type to include color information
export interface StatusWithColor {
  status: MedicationStatusResult;
  statusColor: string;
}

/**
 * Type guard to check if status is complex (object with additional properties)
 */
export const isComplexStatus = (
  status: MedicationStatusResult | StatusWithColor
): status is StatusWithColor => {
  return typeof status === 'object' && status !== null && 'status' in status;
};

/**
 * Get status value safely from status object or string
 */
export const getStatusValue = (
  status: MedicationStatusResult | StatusWithColor
): MedicationStatusResult => {
  if (isComplexStatus(status)) {
    return status.status;
  }
  return status;
};

/**
 * Get display color for medication status
 */
export const getStatusColor = (status: MedicationStatusResult): string => {
  const statusValue = getStatusValue(status);
  
  switch (statusValue) {
    case MedicationStatus.Active:
    case 'current':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case MedicationStatus.Pending:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'due_soon':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'overdue':
    case MedicationStatus.Missed:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case MedicationStatus.Expired:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case MedicationStatus.Completed:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case MedicationStatus.Discontinued:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    case MedicationStatus.Upcoming:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'incomplete':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

/**
 * Get time slots for medication frequency
 */
export const getTimeSlotsForFrequency = (frequency: string): string[] => {
  switch (frequency?.toLowerCase()) {
    case MedicationFrequency.Daily:
      return ['Morning', 'Afternoon', 'Evening'];
    case MedicationFrequency.Weekly:
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    case MedicationFrequency.Monthly:
      return ['Beginning of month', 'Middle of month', 'End of month'];
    default:
      return ['As scheduled'];
  }
};
