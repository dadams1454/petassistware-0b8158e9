import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';
import { MedicationStatus, MedicationFrequency } from '@/types/health';

export const MedicationFrequencyOptions = [
  { value: MedicationFrequency.DAILY, label: 'Daily' },
  { value: MedicationFrequency.TWICE_DAILY, label: 'Twice Daily' },
  { value: MedicationFrequency.THREE_TIMES_DAILY, label: 'Three Times Daily' },
  { value: MedicationFrequency.WEEKLY, label: 'Weekly' },
  { value: MedicationFrequency.BIWEEKLY, label: 'Biweekly' },
  { value: MedicationFrequency.MONTHLY, label: 'Monthly' },
  { value: MedicationFrequency.QUARTERLY, label: 'Quarterly' },
  { value: MedicationFrequency.ANNUALLY, label: 'Annually' },
  { value: MedicationFrequency.AS_NEEDED, label: 'As Needed' },
  { value: MedicationFrequency.ONE_TIME, label: 'One-Time' }
];

export const AdministrationRouteOptions = [
  { value: 'oral', label: 'Oral' },
  { value: 'topical', label: 'Topical' },
  { value: 'injection', label: 'Injection' },
  { value: 'subcutaneous', label: 'Subcutaneous' },
  { value: 'intramuscular', label: 'Intramuscular' },
  { value: 'intravenous', label: 'Intravenous' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'ocular', label: 'Ocular' },
  { value: 'otic', label: 'Otic' },
  { value: 'nasal', label: 'Nasal' },
  { value: 'other', label: 'Other' }
];

export const DosageUnitOptions = [
  { value: 'mg', label: 'mg' },
  { value: 'ml', label: 'ml' },
  { value: 'tablet', label: 'tablet(s)' },
  { value: 'capsule', label: 'capsule(s)' },
  { value: 'drop', label: 'drop(s)' },
  { value: 'application', label: 'application(s)' },
  { value: 'unit', label: 'unit(s)' },
  { value: 'gram', label: 'g' },
  { value: 'cc', label: 'cc' },
  { value: 'mcg', label: 'mcg' },
  { value: 'puff', label: 'puff(s)' },
  { value: 'spray', label: 'spray(s)' },
  { value: 'piece', label: 'piece(s)' },
  { value: 'other', label: 'other' }
];

export const DurationUnitOptions = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
];

/**
 * Gets the next due date based on the frequency and last administered date
 */
export const getNextDueDate = (lastAdministered: string, frequency: string): Date => {
  const date = typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered;
  
  switch (frequency) {
    case MedicationFrequency.DAILY:
      return addDays(date, 1);
    case MedicationFrequency.TWICE_DAILY:
      return addDays(date, 0.5);
    case MedicationFrequency.THREE_TIMES_DAILY:
      return addDays(date, 0.33);
    case MedicationFrequency.WEEKLY:
      return addDays(date, 7);
    case MedicationFrequency.BIWEEKLY:
      return addDays(date, 14);
    case MedicationFrequency.MONTHLY:
      return addDays(date, 30);
    case MedicationFrequency.QUARTERLY:
      return addDays(date, 90);
    case MedicationFrequency.ANNUALLY:
      return addDays(date, 365);
    default:
      return addDays(date, 1);
  }
};

/**
 * Determines the status of a medication based on the last administered date and frequency
 */
export const getMedicationStatus = (lastAdministered?: string, frequency?: string, endDate?: string): { status: MedicationStatus, nextDue?: Date } => {
  if (!lastAdministered || !frequency) {
    return { status: MedicationStatus.upcoming };
  }
  
  const now = new Date();
  const lastAdminDate = typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered;
  const nextDueDate = getNextDueDate(lastAdministered, frequency);
  
  // If there's an end date and it's in the past, medication is completed
  if (endDate) {
    const endDateParsed = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    if (isBefore(endDateParsed, now)) {
      return { status: MedicationStatus.completed };
    }
  }
  
  // Check if the medication is overdue
  if (isBefore(nextDueDate, now)) {
    return { status: MedicationStatus.overdue, nextDue: nextDueDate };
  }
  
  // Check if the medication is upcoming (due within 24 hours)
  const tomorrowDate = addDays(now, 1);
  if (isBefore(nextDueDate, tomorrowDate)) {
    return { status: MedicationStatus.upcoming, nextDue: nextDueDate };
  }
  
  // Otherwise the medication is active
  return { status: MedicationStatus.active, nextDue: nextDueDate };
};

/**
 * Returns display information for a medication status
 */
export const getStatusLabel = (status: MedicationStatus | any) => {
  let statusValue = typeof status === 'object' ? status.status : status;
  
  switch (statusValue) {
    case MedicationStatus.active:
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800',
        emoji: '✓'
      };
    case MedicationStatus.upcoming:
      return {
        statusLabel: 'Upcoming',
        statusColor: 'bg-blue-100 text-blue-800',
        emoji: '⏰'
      };
    case MedicationStatus.overdue:
      return {
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800',
        emoji: '⚠️'
      };
    case MedicationStatus.completed:
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '✓'
      };
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '❓'
      };
  }
};
