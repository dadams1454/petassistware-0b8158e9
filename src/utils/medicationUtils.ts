
import { Medication, MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { differenceInDays, addDays, parseISO } from 'date-fns';

// Constants for medication frequencies
export const MedicationFrequencyConstants = {
  AS_NEEDED: 'as needed',
  ONCE_DAILY: 'once daily',
  TWICE_DAILY: 'twice daily',
  THREE_TIMES_DAILY: 'three times daily',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually'
};

// Function to get medication status based on medication data
export const getMedicationStatus = (medication: Medication): MedicationStatusResult => {
  // If medication is explicitly marked as inactive
  if (!medication.active) {
    return {
      status: MedicationStatusEnum.Discontinued,
      overdue: false,
      nextDue: undefined
    };
  }

  const now = new Date();
  const startDate = medication.start_date ? new Date(medication.start_date) : undefined;
  const endDate = medication.end_date ? new Date(medication.end_date) : undefined;
  const lastAdministeredDate = medication.last_administered ? new Date(medication.last_administered) : undefined;

  // Check if medication hasn't started yet
  if (startDate && startDate > now) {
    return {
      status: MedicationStatusEnum.Scheduled,
      overdue: false,
      daysUntilNext: differenceInDays(startDate, now),
      nextDue: startDate
    };
  }

  // Check if medication has ended
  if (endDate && endDate < now) {
    return {
      status: MedicationStatusEnum.Completed,
      overdue: false,
      nextDue: undefined
    };
  }

  // Calculate next due date based on frequency and last administration
  if (!lastAdministeredDate) {
    // Never administered, but should have started
    if (startDate && startDate <= now) {
      return {
        status: MedicationStatusEnum.Overdue,
        overdue: true,
        daysUntilNext: -differenceInDays(now, startDate),
        nextDue: startDate
      };
    }
    
    return {
      status: MedicationStatusEnum.NotStarted,
      overdue: false,
      nextDue: startDate
    };
  }

  // Calculate next due date based on frequency
  const frequency = medication.frequency ? medication.frequency.toLowerCase() : 'daily';
  let nextDueDate = new Date(lastAdministeredDate);
  let daysToAdd = 1; // Default to daily

  switch (frequency) {
    case MedicationFrequencyConstants.ONCE_DAILY.toLowerCase():
    case MedicationFrequencyConstants.DAILY.toLowerCase():
      daysToAdd = 1;
      break;
    case MedicationFrequencyConstants.TWICE_DAILY.toLowerCase():
      daysToAdd = 0.5; // Half a day
      break;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY.toLowerCase():
      daysToAdd = 1/3; // A third of a day
      break;
    case MedicationFrequencyConstants.WEEKLY.toLowerCase():
      daysToAdd = 7;
      break;
    case MedicationFrequencyConstants.BIWEEKLY.toLowerCase():
      daysToAdd = 14;
      break;
    case MedicationFrequencyConstants.MONTHLY.toLowerCase():
      daysToAdd = 30; // Approximation
      break;
    case MedicationFrequencyConstants.QUARTERLY.toLowerCase():
      daysToAdd = 90; // Approximation
      break;
    case MedicationFrequencyConstants.ANNUALLY.toLowerCase():
      daysToAdd = 365; // Approximation
      break;
    case MedicationFrequencyConstants.AS_NEEDED.toLowerCase():
      return {
        status: MedicationStatusEnum.Active,
        overdue: false,
        nextDue: undefined
      };
    default:
      daysToAdd = 1; // Default to daily
  }

  nextDueDate = addDays(lastAdministeredDate, daysToAdd);
  const daysUntilNext = differenceInDays(nextDueDate, now);
  const isOverdue = nextDueDate < now;

  if (isOverdue) {
    return {
      status: MedicationStatusEnum.Overdue,
      overdue: true,
      daysUntilNext: daysUntilNext,
      daysSinceLastDose: differenceInDays(now, lastAdministeredDate),
      nextDue: nextDueDate
    };
  }

  return {
    status: MedicationStatusEnum.Active,
    overdue: false,
    daysUntilNext: daysUntilNext,
    daysSinceLastDose: differenceInDays(now, lastAdministeredDate),
    nextDue: nextDueDate
  };
};

// Function to get status label and color for display
export const getStatusLabel = (status: MedicationStatusEnum): { statusLabel: string; statusColor: string; emoji: string } => {
  switch (status) {
    case MedicationStatusEnum.Active:
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800',
        emoji: '✅'
      };
    case MedicationStatusEnum.Scheduled:
      return {
        statusLabel: 'Scheduled',
        statusColor: 'bg-blue-100 text-blue-800',
        emoji: '📅'
      };
    case MedicationStatusEnum.Overdue:
      return {
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800',
        emoji: '⚠️'
      };
    case MedicationStatusEnum.Completed:
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '✓'
      };
    case MedicationStatusEnum.Discontinued:
      return {
        statusLabel: 'Discontinued',
        statusColor: 'bg-amber-100 text-amber-800',
        emoji: '⛔'
      };
    case MedicationStatusEnum.NotStarted:
      return {
        statusLabel: 'Not Started',
        statusColor: 'bg-purple-100 text-purple-800',
        emoji: '⏳'
      };
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-500',
        emoji: '❓'
      };
  }
};

// Function to process medication logs for display
export const processMedicationLogs = (logs: any[]): { preventative: any[]; other: any[] } => {
  if (!logs || !Array.isArray(logs)) {
    return { preventative: [], other: [] };
  }
  
  const preventativeMeds = logs.filter(log => 
    log.medication_metadata?.is_preventative === true);
  
  const otherMeds = logs.filter(log => 
    !log.medication_metadata?.is_preventative);
  
  return {
    preventative: preventativeMeds,
    other: otherMeds
  };
};
