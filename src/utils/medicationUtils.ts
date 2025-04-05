
import { MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { addDays, isAfter, isBefore, parseISO } from 'date-fns';

// Export constants for medication frequencies
export const MedicationFrequencyConstants = {
  DAILY: 'Daily',
  ONCE_DAILY: 'Once daily',
  TWICE_DAILY: 'Twice daily',
  THREE_TIMES_DAILY: 'Three times daily',
  WEEKLY: 'Weekly',
  BIWEEKLY: 'Biweekly', 
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUALLY: 'Annually',
  AS_NEEDED: 'As needed'
};

// For backwards compatibility with code using MEDICATION_FREQUENCY
export const MEDICATION_FREQUENCY = MedicationFrequencyConstants;

// Calculate medication status based on dates and frequency
export const getMedicationStatus = (
  startDate?: string | null,
  endDate?: string | null,
  lastAdministered?: string | null,
  frequency?: string | null,
  isDiscontinued = false
): MedicationStatusResult => {
  const today = new Date();
  
  // Handle inactive or discontinued medications
  if (isDiscontinued) {
    return {
      status: MedicationStatusEnum.DISCONTINUED,
      daysUntilDue: null,
      daysOverdue: null,
      nextDue: null
    };
  }
  
  // Handle not started medications
  if (startDate && isBefore(today, parseISO(startDate))) {
    return {
      status: MedicationStatusEnum.NOT_STARTED,
      daysUntilDue: null,
      daysOverdue: null,
      nextDue: startDate
    };
  }
  
  // Handle completed medications
  if (endDate && isBefore(parseISO(endDate), today)) {
    return {
      status: MedicationStatusEnum.COMPLETED,
      daysUntilDue: null,
      daysOverdue: null,
      nextDue: null
    };
  }
  
  // If no last administration or frequency, consider it scheduled
  if (!lastAdministered || !frequency) {
    return {
      status: MedicationStatusEnum.SCHEDULED,
      daysUntilDue: null,
      daysOverdue: null,
      nextDue: null
    };
  }
  
  // Calculate next due date based on frequency
  const lastDate = parseISO(lastAdministered);
  let nextDueDate: Date | null = null;
  
  const frequencyLower = frequency.toLowerCase();
  
  switch (frequencyLower) {
    case MedicationFrequencyConstants.DAILY.toLowerCase():
    case MedicationFrequencyConstants.ONCE_DAILY.toLowerCase():
      nextDueDate = addDays(lastDate, 1);
      break;
    case MedicationFrequencyConstants.TWICE_DAILY.toLowerCase():
      // For twice daily, next due is 12 hours = 0.5 days
      nextDueDate = addDays(lastDate, 0.5);
      break;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY.toLowerCase():
      // For 3x daily, next due is 8 hours = 0.33 days
      nextDueDate = addDays(lastDate, 0.33);
      break;
    case MedicationFrequencyConstants.WEEKLY.toLowerCase():
      nextDueDate = addDays(lastDate, 7);
      break;
    case MedicationFrequencyConstants.BIWEEKLY.toLowerCase():
      nextDueDate = addDays(lastDate, 14);
      break;
    case MedicationFrequencyConstants.MONTHLY.toLowerCase():
      nextDueDate = addDays(lastDate, 30);
      break;
    case MedicationFrequencyConstants.QUARTERLY.toLowerCase():
      nextDueDate = addDays(lastDate, 90);
      break;
    case MedicationFrequencyConstants.ANNUALLY.toLowerCase():
      nextDueDate = addDays(lastDate, 365);
      break;
    default:
      // For as needed or unknown frequencies
      return {
        status: MedicationStatusEnum.ACTIVE,
        daysUntilDue: null,
        daysOverdue: null,
        nextDue: null
      };
  }
  
  // Check if overdue or upcoming
  const daysUntilDue = Math.ceil((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) {
    // Overdue
    return {
      status: MedicationStatusEnum.OVERDUE,
      daysUntilDue: null,
      daysOverdue: Math.abs(daysUntilDue),
      nextDue: nextDueDate.toISOString()
    };
  } else {
    // Active and on schedule
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysUntilDue,
      daysOverdue: null,
      nextDue: nextDueDate.toISOString()
    };
  }
};

// Helper function to get status label and color for display
export const getStatusLabel = (status: MedicationStatusEnum) => {
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      return { statusLabel: 'Active', statusColor: 'text-green-500 bg-green-100' };
    case MedicationStatusEnum.SCHEDULED:
      return { statusLabel: 'Scheduled', statusColor: 'text-blue-500 bg-blue-100' };
    case MedicationStatusEnum.OVERDUE:
      return { statusLabel: 'Overdue', statusColor: 'text-red-500 bg-red-100' };
    case MedicationStatusEnum.COMPLETED:
      return { statusLabel: 'Completed', statusColor: 'text-gray-500 bg-gray-100' };
    case MedicationStatusEnum.DISCONTINUED:
      return { statusLabel: 'Discontinued', statusColor: 'text-orange-500 bg-orange-100' };
    case MedicationStatusEnum.NOT_STARTED:
      return { statusLabel: 'Not Started', statusColor: 'text-purple-500 bg-purple-100' };
    default:
      return { statusLabel: 'Unknown', statusColor: 'text-gray-500 bg-gray-100' };
  }
};
