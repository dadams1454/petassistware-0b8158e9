
import { MedicationStatusEnum } from '@/types/health';
import { differenceInDays, parseISO, addDays } from 'date-fns';

// Frequency constants
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as_needed',
  EVERY_12_HOURS: 'every_12_hours',
  EVERY_8_HOURS: 'every_8_hours',
  EVERY_6_HOURS: 'every_6_hours',
  SINGLE_DOSE: 'single_dose'
};

// Get next due date based on frequency and last administered date
export function getNextDueDate(frequency: string, lastAdministered: string): Date {
  const lastDate = parseISO(lastAdministered);
  
  switch (frequency) {
    case MedicationFrequencyConstants.DAILY:
    case MedicationFrequencyConstants.ONCE_DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequencyConstants.TWICE_DAILY:
      return addDays(lastDate, 0.5);
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return addDays(lastDate, 0.33);
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return addDays(lastDate, 2);
    case MedicationFrequencyConstants.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequencyConstants.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequencyConstants.MONTHLY:
      return addDays(lastDate, 30);
    case MedicationFrequencyConstants.QUARTERLY:
      return addDays(lastDate, 90);
    case MedicationFrequencyConstants.ANNUALLY:
      return addDays(lastDate, 365);
    default:
      return addDays(lastDate, 1);
  }
}

// Get medication status based on next due date
export function getMedicationStatus(nextDue: string | Date | null, startDate: string | null, endDate: string | null) {
  // If no next due date and no start date, it's not started
  if (!nextDue && !startDate) {
    return { 
      status: MedicationStatusEnum.NOT_STARTED
    };
  }
  
  // If has end date and it's in the past, medication is completed
  if (endDate) {
    const endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    if (endDateObj < new Date()) {
      return { 
        status: MedicationStatusEnum.COMPLETED
      };
    }
  }
  
  // If has start date but it's in the future, medication is scheduled
  if (startDate) {
    const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    if (startDateObj > new Date()) {
      const daysUntilStart = differenceInDays(startDateObj, new Date());
      return { 
        status: MedicationStatusEnum.SCHEDULED,
        daysUntilDue: daysUntilStart
      };
    }
  }
  
  // If no next due date but has start date in the past, it's active
  if (!nextDue && startDate) {
    const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    if (startDateObj <= new Date()) {
      return { 
        status: MedicationStatusEnum.ACTIVE
      };
    }
  }
  
  // Check if medication is overdue
  if (nextDue) {
    const nextDueDate = typeof nextDue === 'string' ? parseISO(nextDue) : nextDue;
    if (nextDueDate < new Date()) {
      const daysOverdue = differenceInDays(new Date(), nextDueDate);
      return { 
        status: MedicationStatusEnum.OVERDUE,
        daysOverdue 
      };
    } else {
      const daysUntilDue = differenceInDays(nextDueDate, new Date());
      return { 
        status: MedicationStatusEnum.ACTIVE,
        daysUntilDue
      };
    }
  }
  
  // Default fallback
  return { 
    status: MedicationStatusEnum.ACTIVE
  };
}

// Get status label for UI display
export function getStatusLabel(status: MedicationStatusEnum) {
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800',
        emoji: '✅'
      };
    case MedicationStatusEnum.OVERDUE:
      return {
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800',
        emoji: '❗'
      };
    case MedicationStatusEnum.SCHEDULED:
      return {
        statusLabel: 'Scheduled',
        statusColor: 'bg-blue-100 text-blue-800',
        emoji: '📅'
      };
    case MedicationStatusEnum.COMPLETED:
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '✓'
      };
    case MedicationStatusEnum.PAUSED:
      return {
        statusLabel: 'Paused',
        statusColor: 'bg-yellow-100 text-yellow-800',
        emoji: '⏸️'
      };
    case MedicationStatusEnum.NOT_STARTED:
      return {
        statusLabel: 'Not Started',
        statusColor: 'bg-gray-100 text-gray-500',
        emoji: '⏱️'
      };
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-500',
        emoji: '❓'
      };
  }
}

// Helper function to calculate dose based on weight
export function calculateDose(weight: number, dosePerWeight: number, maxDose?: number): number {
  const calculatedDose = weight * dosePerWeight;
  if (maxDose && calculatedDose > maxDose) {
    return maxDose;
  }
  return calculatedDose;
}
