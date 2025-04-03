import { addDays, addWeeks, addMonths, addYears, isBefore, isAfter, subDays } from 'date-fns';

/**
 * Enumeration of medication status values
 */
export enum MedicationStatus {
  Active = 'active',
  Completed = 'completed',
  Upcoming = 'upcoming',
  Expired = 'expired',
  Missed = 'missed'
}

/**
 * Enumeration of medication frequency values
 */
export enum MedicationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual'
}

/**
 * Type for complex medication status result
 * Can be a simple string status or an object with status and color
 */
export type MedicationStatusResult = 
  | MedicationStatus 
  | 'current' 
  | 'due_soon' 
  | 'overdue' 
  | 'incomplete'
  | { status: string; statusColor: string };

/**
 * Type for status with color information
 */
export type StatusWithColor = {
  status: string;
  statusColor: string;
};

/**
 * Type guard to check if status is a complex object with status and color
 */
export function isComplexStatus(status: any): status is StatusWithColor {
  return typeof status === 'object' && 'status' in status && 'statusColor' in status;
}

/**
 * Get the status value from a potentially complex status
 */
export function getStatusValue(status: MedicationStatusResult): string {
  if (isComplexStatus(status)) {
    return status.status;
  }
  return status;
}

/**
 * Get appropriate CSS color class for a medication status
 */
export function getStatusColor(status: MedicationStatusResult): string {
  const statusValue = getStatusValue(status);
  
  switch (statusValue) {
    case MedicationStatus.Active:
    case 'current':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'due_soon':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case MedicationStatus.Upcoming:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case MedicationStatus.Completed:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case MedicationStatus.Expired:
    case MedicationStatus.Missed:
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'incomplete':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Calculate the next due date based on frequency
 */
export function calculateNextDueDate(lastDate: Date, frequency: MedicationFrequency): Date {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return addDays(lastDate, 1);
    case MedicationFrequency.Weekly:
      return addWeeks(lastDate, 1);
    case MedicationFrequency.Monthly:
      return addMonths(lastDate, 1);
    case MedicationFrequency.Quarterly:
      return addMonths(lastDate, 3);
    case MedicationFrequency.Annual:
      return addYears(lastDate, 1);
    default:
      return addDays(lastDate, 1);
  }
}

/**
 * Get medication status based on administration dates and frequency
 */
export function getMedicationStatus(
  lastAdministered: Date | null | undefined,
  frequency: MedicationFrequency | string,
  endDate?: Date | null
): MedicationStatusResult {
  const today = new Date();
  
  // Handle null/undefined last administration date
  if (!lastAdministered) {
    return 'incomplete';
  }
  
  // If medication has an end date and we're past it
  if (endDate && isAfter(today, endDate)) {
    return MedicationStatus.Completed;
  }
  
  // Calculate next due date
  const nextDue = calculateNextDueDate(lastAdministered, frequency as MedicationFrequency);
  
  // Check if overdue (more than 1 day)
  if (isBefore(nextDue, subDays(today, 1))) {
    return 'overdue';
  }
  
  // Check if due soon (within 1 day)
  if (isBefore(nextDue, addDays(today, 1))) {
    return 'due_soon';
  }
  
  // Otherwise medication is current/active
  return 'current';
}

/**
 * Get time slots for a given medication frequency
 */
export function getTimeSlotsForFrequency(frequency: MedicationFrequency): string[] {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return ['morning', 'afternoon', 'evening'];
    case MedicationFrequency.Weekly:
      return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    default:
      return ['anytime'];
  }
}
