
import { format, addDays, addMonths, isAfter, isBefore, isToday } from 'date-fns';

export enum MedicationFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice-daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  AS_NEEDED = 'as-needed'
}

export const getNextDueDate = (lastAdministeredDate: string, frequency: string): Date => {
  const lastDate = new Date(lastAdministeredDate);
  
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequency.TWICE_DAILY:
      // 12 hours later, but we'll simplify to half a day
      return new Date(lastDate.getTime() + 12 * 60 * 60 * 1000);
    case MedicationFrequency.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequency.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequency.MONTHLY:
      return addMonths(lastDate, 1);
    case MedicationFrequency.QUARTERLY:
      return addMonths(lastDate, 3);
    case MedicationFrequency.ANNUAL:
      return addMonths(lastDate, 12);
    case MedicationFrequency.AS_NEEDED:
    default:
      // For as-needed, we don't really have a next due date
      return new Date(lastDate.getTime() + 365 * 24 * 60 * 60 * 1000); // Far in the future
  }
};

export const getMedicationStatus = (
  lastAdministeredDate: string | null, 
  frequency: string
): { status: 'due' | 'overdue' | 'upcoming' | 'completed' | 'active' | 'incomplete', statusColor: string } => {
  
  if (!lastAdministeredDate) {
    return {
      status: 'incomplete',
      statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
  }
  
  const now = new Date();
  const nextDueDate = getNextDueDate(lastAdministeredDate, frequency);
  
  // Due today
  if (isToday(nextDueDate)) {
    return {
      status: 'due',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
  }
  
  // Overdue
  if (isBefore(nextDueDate, now)) {
    return {
      status: 'overdue',
      statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
  }
  
  // Upcoming (due within the next 3 days)
  const threeDaysFromNow = addDays(now, 3);
  if (isBefore(nextDueDate, threeDaysFromNow)) {
    return {
      status: 'upcoming',
      statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
  }
  
  // Active and on schedule
  return {
    status: 'active',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };
};

export const formatDosage = (dosage: number, unit: string): string => {
  return `${dosage} ${unit}`;
};

export const calculateWeightBasedDosage = (
  baselineDosage: number,
  baselineWeight: number,
  currentWeight: number,
  unit: string
): string => {
  if (!baselineDosage || !baselineWeight || !currentWeight) {
    return "N/A";
  }
  
  const calculatedDosage = (baselineDosage / baselineWeight) * currentWeight;
  return `${calculatedDosage.toFixed(2)} ${unit}`;
};
