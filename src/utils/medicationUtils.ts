
/**
 * Utility functions and constants for medication management
 */

/**
 * Enum for medication frequency options
 */
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

/**
 * Enum for medication status
 */
export enum MedicationStatus {
  Active = 'active',
  Completed = 'completed',
  Discontinued = 'discontinued',
  Pending = 'pending',
  Expired = 'expired'
}

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
