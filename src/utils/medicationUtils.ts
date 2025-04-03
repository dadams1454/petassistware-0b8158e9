
import { addDays, isBefore, isAfter, parseISO, format } from 'date-fns';

export enum MedicationFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual'
}

// For backward compatibility
export type MedicationFrequencyLegacy = 
  | 'daily'
  | 'twice_daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'as_needed'
  | 'quarterly'
  | 'annual';

export type MedicationStatusResult = 'active' | 'expired' | 'upcoming' | 'due' | 'overdue';

export enum MedicationStatus {
  Active = 'active',
  Expired = 'expired',
  Upcoming = 'upcoming',
  Due = 'due',
  Overdue = 'overdue'
}

/**
 * Get days to add based on frequency
 */
export function getDaysToAdd(frequency: MedicationFrequency | string): number {
  switch (frequency) {
    case MedicationFrequency.DAILY:
    case 'daily':
      return 1;
    case MedicationFrequency.TWICE_DAILY:
    case 'twice_daily':
      return 0.5;
    case MedicationFrequency.WEEKLY:
    case 'weekly':
      return 7;
    case MedicationFrequency.BIWEEKLY:
    case 'biweekly':
      return 14;
    case MedicationFrequency.MONTHLY:
    case 'monthly':
      return 30;
    case MedicationFrequency.QUARTERLY:
    case 'quarterly':
      return 90;
    case MedicationFrequency.ANNUAL:
    case 'annual':
      return 365;
    case MedicationFrequency.AS_NEEDED:
    case 'as_needed':
      return 0;
    default:
      return 0;
  }
}

/**
 * Get next due date based on last administered date and frequency
 */
export function getNextDueDate(lastAdministered: string, frequency: MedicationFrequency | string): Date {
  const date = parseISO(lastAdministered);
  const daysToAdd = getDaysToAdd(frequency);
  return addDays(date, daysToAdd);
}

/**
 * Get medication status based on next due date
 */
export function getMedicationStatus(
  nextDueDate: Date,
  endDate?: string | null
): MedicationStatusResult {
  const now = new Date();
  
  // If medication has an end date and it's in the past
  if (endDate && isBefore(parseISO(endDate), now)) {
    return 'expired';
  }
  
  // If next due date is in the future, but within 3 days
  if (isAfter(nextDueDate, now)) {
    const threeDaysFromNow = addDays(now, 3);
    if (isBefore(nextDueDate, threeDaysFromNow)) {
      return 'upcoming';
    }
    return 'active';
  }
  
  // If next due date is today or within the last 3 days
  const threeDaysAgo = addDays(now, -3);
  if (isBefore(nextDueDate, now) && isAfter(nextDueDate, threeDaysAgo)) {
    return 'due';
  }
  
  // If next due date is more than 3 days ago
  return 'overdue';
}

/**
 * Get time slots based on medication frequency for daily medication schedules
 */
export function getTimeSlotsForFrequency(frequency: MedicationFrequency | string): string[] {
  switch (frequency) {
    case MedicationFrequency.DAILY:
    case 'daily':
      return ['08:00 AM'];
    case MedicationFrequency.TWICE_DAILY:
    case 'twice_daily':
      return ['08:00 AM', '08:00 PM'];
    case MedicationFrequency.WEEKLY:
    case 'weekly':
      return ['08:00 AM Monday'];
    case MedicationFrequency.BIWEEKLY:
    case 'biweekly':
      return ['08:00 AM Monday (every 2 weeks)'];
    case MedicationFrequency.MONTHLY:
    case 'monthly':
      return ['08:00 AM 1st of Month'];
    case MedicationFrequency.QUARTERLY:
    case 'quarterly':
      return ['08:00 AM (Jan 1, Apr 1, Jul 1, Oct 1)'];
    case MedicationFrequency.ANNUAL:
    case 'annual':
      return ['08:00 AM (Annually)'];
    case MedicationFrequency.AS_NEEDED:
    case 'as_needed':
      return ['As needed'];
    default:
      return ['Schedule not defined'];
  }
}

/**
 * Format frequency for display
 */
export function formatFrequency(frequency: MedicationFrequency | string): string {
  switch (frequency) {
    case MedicationFrequency.DAILY:
    case 'daily':
      return 'Once daily';
    case MedicationFrequency.TWICE_DAILY:
    case 'twice_daily':
      return 'Twice daily';
    case MedicationFrequency.WEEKLY:
    case 'weekly':
      return 'Once weekly';
    case MedicationFrequency.BIWEEKLY:
    case 'biweekly':
      return 'Every two weeks';
    case MedicationFrequency.MONTHLY:
    case 'monthly':
      return 'Once monthly';
    case MedicationFrequency.QUARTERLY:
    case 'quarterly':
      return 'Every three months';
    case MedicationFrequency.ANNUAL:
    case 'annual':
      return 'Once yearly';
    case MedicationFrequency.AS_NEEDED:
    case 'as_needed':
      return 'As needed';
    default:
      return frequency.toString();
  }
}
