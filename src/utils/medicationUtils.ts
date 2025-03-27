
import { format, addDays, addMonths, addYears } from 'date-fns';

export enum MedicationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  CUSTOM = 'custom'
}

export type MedicationStatus = 'current' | 'due_soon' | 'overdue' | 'incomplete';

// Generate daily time slots
export const getDailyTimeSlots = (): string[] => {
  return [
    '6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', 
    '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM', '10:00 PM'
  ];
};

// Generate weekly time slots
export const getWeeklyTimeSlots = (): string[] => {
  return [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
};

// Generate monthly time slots
export const getMonthlyTimeSlots = (): string[] => {
  return [
    '1st of month', '5th of month', '10th of month', '15th of month', 
    '20th of month', '25th of month', 'Last day of month'
  ];
};

// Generate quarterly time slots
export const getQuarterlyTimeSlots = (): string[] => {
  return ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
};

// Generate annual time slots
export const getAnnualTimeSlots = (): string[] => {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};

// Get appropriate time slots based on frequency
export const getTimeSlotsForFrequency = (frequency: MedicationFrequency): string[] => {
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return getDailyTimeSlots();
    case MedicationFrequency.WEEKLY:
      return getWeeklyTimeSlots();
    case MedicationFrequency.MONTHLY:
      return getMonthlyTimeSlots();
    case MedicationFrequency.QUARTERLY:
      return getQuarterlyTimeSlots();
    case MedicationFrequency.ANNUAL:
      return getAnnualTimeSlots();
    default:
      return getDailyTimeSlots();
  }
};

// Calculate next due date based on frequency and last administered date
export const calculateNextDueDate = (lastDate: Date, frequency: MedicationFrequency): Date => {
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequency.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequency.MONTHLY:
      return addMonths(lastDate, 1);
    case MedicationFrequency.QUARTERLY:
      return addMonths(lastDate, 3);
    case MedicationFrequency.ANNUAL:
      return addYears(lastDate, 1);
    case MedicationFrequency.CUSTOM:
      // For custom frequencies, you'd need additional logic
      return lastDate;
    default:
      return lastDate;
  }
};

// Check if medication is due based on frequency and last administered date
export const isMedicationDue = (lastDate: string | null, frequency: MedicationFrequency): boolean => {
  if (!lastDate) return true; // If never administered, it's due
  
  const today = new Date();
  const nextDueDate = calculateNextDueDate(new Date(lastDate), frequency);
  
  return today >= nextDueDate;
};

// Get medication status with detailed information
export const getMedicationStatus = (lastDate: string | null, frequency: MedicationFrequency) => {
  if (!lastDate) {
    return {
      status: 'incomplete' as MedicationStatus,
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      lastAdministered: 'Never',
      nextDue: 'Now'
    };
  }
  
  const today = new Date();
  const nextDueDate = calculateNextDueDate(new Date(lastDate), frequency);
  const lastAdministered = format(new Date(lastDate), 'MMM d, yyyy');
  const nextDue = format(nextDueDate, 'MMM d, yyyy');
  
  if (today > nextDueDate) {
    return {
      status: 'overdue' as MedicationStatus,
      statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      lastAdministered,
      nextDue
    };
  } else if (today.getTime() + (7 * 24 * 60 * 60 * 1000) >= nextDueDate.getTime()) {
    return {
      status: 'due_soon' as MedicationStatus,
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      lastAdministered,
      nextDue
    };
  } else {
    return {
      status: 'current' as MedicationStatus,
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      lastAdministered,
      nextDue
    };
  }
};
