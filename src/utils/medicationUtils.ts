
import { format, differenceInDays, isAfter, addDays } from 'date-fns';
import { MedicationStatusEnum, MedicationStatusResult } from '@/types/health';

/**
 * Medication Frequency Constants
 */
export const MedicationFrequencyConstants = {
  DAILY: 'Daily',
  ONCE_DAILY: 'Once Daily',
  TWICE_DAILY: 'Twice Daily',
  THREE_TIMES_DAILY: 'Three Times Daily',
  EVERY_OTHER_DAY: 'Every Other Day',
  WEEKLY: 'Weekly',
  BIWEEKLY: 'Biweekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUALLY: 'Annually',
  AS_NEEDED: 'As Needed'
};

/**
 * Process medication logs to organize them by category
 */
export const processMedicationLogs = (logs: any[]) => {
  const result = {
    preventative: [],
    other: []
  };
  
  if (!logs || !logs.length) return result;
  
  logs.forEach(log => {
    if (log.category === 'preventative') {
      result.preventative.push(log);
    } else {
      result.other.push(log);
    }
  });
  
  return result;
};

/**
 * Calculate the status of a medication based on last given and frequency
 */
export const getMedicationStatus = (
  lastAdministered: Date | string | null | undefined,
  nextDue: Date | string | null | undefined,
  isContinuous: boolean = true
): MedicationStatusResult => {
  const now = new Date();
  
  // If there's no data, it's not started
  if (!lastAdministered && !nextDue) {
    return {
      status: MedicationStatusEnum.NOT_STARTED,
      isActive: false,
      isOverdue: false,
      isScheduled: false,
      nextDue: null,
      daysUntilDue: undefined
    };
  }
  
  // If there's just a next due date, it's scheduled
  if (!lastAdministered && nextDue) {
    const nextDueDate = typeof nextDue === 'string' ? new Date(nextDue) : nextDue;
    
    const daysUntil = differenceInDays(nextDueDate, now);
    const isOverdue = daysUntil < 0;
    
    if (isOverdue) {
      return {
        status: MedicationStatusEnum.OVERDUE,
        isActive: false,
        isOverdue: true,
        isScheduled: false,
        nextDue: nextDueDate,
        daysUntilDue: daysUntil,
        daysOverdue: Math.abs(daysUntil)
      };
    } else {
      return {
        status: MedicationStatusEnum.SCHEDULED,
        isActive: false,
        isOverdue: false,
        isScheduled: true,
        nextDue: nextDueDate,
        daysUntilDue: daysUntil
      };
    }
  }
  
  // If we just have a last administered date but no next due
  if (lastAdministered && !nextDue) {
    return {
      status: MedicationStatusEnum.COMPLETED,
      isActive: false,
      isOverdue: false,
      isScheduled: false,
      nextDue: null,
      daysUntilDue: undefined
    };
  }
  
  // At this point, we have both last administered and next due
  const lastDate = typeof lastAdministered === 'string' 
    ? new Date(lastAdministered) 
    : lastAdministered;
    
  const nextDueDate = typeof nextDue === 'string' ? new Date(nextDue) : nextDue;
  const daysUntil = differenceInDays(nextDueDate, now);
  const isOverdue = daysUntil < 0;
  
  if (isOverdue) {
    return {
      status: MedicationStatusEnum.OVERDUE,
      isActive: true,
      isOverdue: true,
      isScheduled: false,
      nextDue: nextDueDate,
      daysUntilDue: daysUntil,
      daysOverdue: Math.abs(daysUntil)
    };
  }
  
  return {
    status: MedicationStatusEnum.ACTIVE,
    isActive: true,
    isOverdue: false,
    isScheduled: false,
    nextDue: nextDueDate,
    daysUntilDue: daysUntil
  };
};

/**
 * Get status label and color for UI display
 */
export const getStatusLabel = (status: MedicationStatusEnum): { statusLabel: string; statusColor: string } => {
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      return { statusLabel: 'Active', statusColor: 'bg-green-100 text-green-800' };
    case MedicationStatusEnum.SCHEDULED:
      return { statusLabel: 'Scheduled', statusColor: 'bg-blue-100 text-blue-800' };
    case MedicationStatusEnum.OVERDUE:
      return { statusLabel: 'Overdue', statusColor: 'bg-red-100 text-red-800' };
    case MedicationStatusEnum.NOT_STARTED:
      return { statusLabel: 'Not Started', statusColor: 'bg-gray-100 text-gray-800' };
    case MedicationStatusEnum.MISSED:
      return { statusLabel: 'Missed', statusColor: 'bg-amber-100 text-amber-800' };
    case MedicationStatusEnum.UNKNOWN:
      return { statusLabel: 'Unknown', statusColor: 'bg-gray-100 text-gray-600' };
    default:
      return { statusLabel: 'Unknown', statusColor: 'bg-gray-100 text-gray-600' };
  }
};
