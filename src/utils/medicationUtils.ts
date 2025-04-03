
import { format, addDays, addWeeks, addMonths, addQuarters, addYears } from 'date-fns';

// Medication status enum
export enum MedicationStatus {
  Active = 'active',
  Upcoming = 'upcoming',
  Completed = 'completed',
  Missed = 'missed',
  Expired = 'expired'
}

// Medication frequency enum
export enum MedicationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
  AsNeeded = 'as_needed',
  Custom = 'custom'
}

/**
 * Get the status of a medication based on its attributes
 */
export const getMedicationStatus = (
  startDate: string | Date,
  endDate: string | Date | undefined | null,
  lastAdministered: string | Date | undefined | null,
  frequency: string,
  currentDate = new Date()
): MedicationStatus | { status: 'incomplete' | MedicationStatus; statusColor: string } => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const lastGiven = lastAdministered ? new Date(lastAdministered) : null;
  
  // If medication is expired
  if (end && end < currentDate) {
    return MedicationStatus.Completed;
  }
  
  // If not started yet
  if (start > currentDate) {
    return MedicationStatus.Upcoming;
  }
  
  // If actively being administered
  if (!lastGiven) {
    return { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
  
  // Calculate next due date based on frequency and last administered
  const nextDue = calculateNextDueDate(lastGiven, frequency);
  
  // Check if medication is overdue
  if (nextDue < currentDate) {
    return MedicationStatus.Missed;
  }
  
  return MedicationStatus.Active;
};

/**
 * Get time slots for the given frequency
 */
export const getTimeSlotsForFrequency = (frequency: string): string[] => {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return ['Morning', 'Afternoon', 'Evening'];
    case MedicationFrequency.Weekly:
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    case MedicationFrequency.Monthly:
      return Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);
    case MedicationFrequency.Quarterly:
      return ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
    case MedicationFrequency.Annual:
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    case MedicationFrequency.AsNeeded:
      return ['As Needed'];
    default:
      return ['Custom'];
  }
};

/**
 * Calculate the next due date based on the frequency
 */
export const calculateNextDueDate = (
  lastAdministered: Date,
  frequency: string
): Date => {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return addDays(lastAdministered, 1);
    case MedicationFrequency.Weekly:
      return addWeeks(lastAdministered, 1);
    case MedicationFrequency.Monthly:
      return addMonths(lastAdministered, 1);
    case MedicationFrequency.Quarterly:
      return addQuarters(lastAdministered, 1);
    case MedicationFrequency.Annual:
      return addYears(lastAdministered, 1);
    default:
      // Default to daily for unrecognized frequencies
      return addDays(lastAdministered, 1);
  }
};
