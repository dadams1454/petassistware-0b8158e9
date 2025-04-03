import { format, isBefore, isAfter, addDays } from 'date-fns';

// Enum for medication status
export enum MedicationStatus {
  Active = 'active',
  Upcoming = 'upcoming',
  Completed = 'completed',
  Missed = 'missed',
  Expired = 'expired'
}

// Enum for medication frequency
export enum MedicationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
  AsNeeded = 'as_needed',
  Custom = 'custom'
}

// Result type for medication status checks
export type MedicationStatusResult = 
  | MedicationStatus 
  | 'current' 
  | 'due_soon' 
  | 'overdue' 
  | 'incomplete';

// Determine if the status value is a complex status (different from the base enum)
export const isComplexStatus = (status: MedicationStatusResult): boolean => {
  return (
    status === 'current' ||
    status === 'due_soon' ||
    status === 'overdue' ||
    status === 'incomplete'
  );
};

// Get the status value, safely handling both simple and complex status types
export const getStatusValue = (status: MedicationStatusResult): MedicationStatus | 'current' | 'due_soon' | 'overdue' | 'incomplete' => {
  // If it's a complex status, just return it
  if (isComplexStatus(status)) {
    return status;
  }
  // Otherwise it's a simple MedicationStatus enum value
  return status;
};

// Get the color for a medication status
export const getStatusColor = (status: MedicationStatusResult): string => {
  const statusValue = getStatusValue(status);
  
  switch (statusValue) {
    case MedicationStatus.Active:
    case 'current':
      return 'text-green-700 border-green-300 bg-green-50';
    case 'due_soon':
      return 'text-amber-700 border-amber-300 bg-amber-50';
    case 'overdue':
    case MedicationStatus.Missed:
      return 'text-red-700 border-red-300 bg-red-50';
    case MedicationStatus.Upcoming:
      return 'text-blue-700 border-blue-300 bg-blue-50';
    case MedicationStatus.Completed:
      return 'text-gray-700 border-gray-300 bg-gray-50';
    case MedicationStatus.Expired:
      return 'text-purple-700 border-purple-300 bg-purple-50';
    case 'incomplete':
      return 'text-gray-400 border-gray-200 bg-gray-50';
    default:
      return 'text-gray-700 border-gray-300 bg-gray-50';
  }
};

// Get time slots based on medication frequency
export const getTimeSlotsForFrequency = (frequency: string): string[] => {
  switch (frequency) {
    case MedicationFrequency.Daily:
      return ['8:00 AM', '8:00 PM'];
    case MedicationFrequency.Weekly:
      return ['Monday 8:00 AM'];
    case MedicationFrequency.Monthly:
      return ['1st of month'];
    case MedicationFrequency.Quarterly:
      return ['Jan 1', 'Apr 1', 'Jul 1', 'Oct 1'];
    case MedicationFrequency.Annual:
      return ['Jan 1'];
    case MedicationFrequency.AsNeeded:
      return ['As needed'];
    case MedicationFrequency.Custom:
    default:
      return ['Custom schedule'];
  }
};

// Calculate the next due date based on frequency and last administration
export const calculateNextDueDate = (
  frequency: string,
  lastAdministered: string | Date | null
): Date => {
  // If no last administration, return today
  if (!lastAdministered) {
    return new Date();
  }
  
  const lastDate = typeof lastAdministered === 'string' 
    ? new Date(lastAdministered) 
    : lastAdministered;
    
  switch (frequency) {
    case MedicationFrequency.Daily:
      return addDays(lastDate, 1);
    case MedicationFrequency.Weekly:
      return addDays(lastDate, 7);
    case MedicationFrequency.Monthly:
      const nextMonth = new Date(lastDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    case MedicationFrequency.Quarterly:
      const nextQuarter = new Date(lastDate);
      nextQuarter.setMonth(nextQuarter.getMonth() + 3);
      return nextQuarter;
    case MedicationFrequency.Annual:
      const nextYear = new Date(lastDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return nextYear;
    case MedicationFrequency.AsNeeded:
    case MedicationFrequency.Custom:
    default:
      return new Date();
  }
};
