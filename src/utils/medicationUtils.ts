
import { format, addDays, parseISO, isPast, isToday, differenceInDays } from 'date-fns';
import { MedicationStatusEnum, type MedicationStatusResult } from '@/types/health';

export const MedicationFrequencyConstants = {
  DAILY: 'Daily',
  ONCE_DAILY: 'Once Daily',
  TWICE_DAILY: 'Twice Daily',
  WEEKLY: 'Weekly',
  BIWEEKLY: 'Biweekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUALLY: 'Annually',
  AS_NEEDED: 'As Needed',
};

/**
 * Gets a human-readable status label and color
 */
export function getStatusLabel(status: MedicationStatusEnum | string): { 
  statusLabel: string; 
  statusColor: string;
  emoji: string;
} {
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      return { 
        statusLabel: 'Active', 
        statusColor: 'text-green-500 bg-green-100 dark:bg-green-900/30',
        emoji: '✅' 
      };
    case MedicationStatusEnum.OVERDUE:
      return { 
        statusLabel: 'Overdue', 
        statusColor: 'text-red-500 bg-red-100 dark:bg-red-900/30',
        emoji: '⚠️' 
      };
    case MedicationStatusEnum.DISCONTINUED:
      return { 
        statusLabel: 'Discontinued', 
        statusColor: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
        emoji: '🛑' 
      };
    case MedicationStatusEnum.SCHEDULED:
      return { 
        statusLabel: 'Scheduled', 
        statusColor: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
        emoji: '📅' 
      };
    case MedicationStatusEnum.NOT_STARTED:
      return { 
        statusLabel: 'Not Started', 
        statusColor: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
        emoji: '⏳' 
      };
    case MedicationStatusEnum.COMPLETED:
      return { 
        statusLabel: 'Completed', 
        statusColor: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
        emoji: '🏁'
      };
    default:
      return { 
        statusLabel: 'Unknown', 
        statusColor: 'text-gray-500 bg-gray-100 dark:bg-gray-900/30',
        emoji: '❓' 
      };
  }
}

/**
 * Determine the medication status based on start, end, last administered date
 */
export function determineMedicationStatus(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  lastAdministered: string | Date | null | undefined,
  frequency: string = 'daily',
  isActive: boolean = true
): MedicationStatusResult {
  const today = new Date();
  const start = startDate 
    ? (typeof startDate === 'string' ? parseISO(startDate) : startDate) 
    : null;
  const end = endDate 
    ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) 
    : null;
  const lastDose = lastAdministered
    ? (typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered)
    : null;
  
  // If medication is not active, return discontinued status
  if (!isActive) {
    return {
      status: end && end < today ? MedicationStatusEnum.COMPLETED : MedicationStatusEnum.DISCONTINUED,
      daysRemaining: 0,
      started: lastDose !== null,
      completed: true,
      isActive: false,
      nextDue: null,
      message: end && end < today ? 'Medication course completed' : 'Medication discontinued'
    };
  }
  
  // If medication has ended, return completed status
  if (end && end < today) {
    return {
      status: MedicationStatusEnum.COMPLETED,
      daysRemaining: 0,
      started: lastDose !== null,
      completed: true,
      isActive: false,
      nextDue: null,
      message: `Completed ${differenceInDays(today, end)} days ago`
    };
  }
  
  // Not started yet
  if (start && start > today) {
    return {
      status: MedicationStatusEnum.SCHEDULED,
      daysRemaining: end ? differenceInDays(end, today) : null,
      started: false,
      completed: false,
      isActive: false,
      nextDue: start.toISOString(),
      message: `Scheduled to start in ${differenceInDays(start, today)} days`
    };
  }
  
  // No doses recorded yet
  if (!lastDose) {
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysRemaining: end ? differenceInDays(end, today) : null,
      started: start !== null && start <= today,
      completed: false,
      isActive: true,
      nextDue: new Date().toISOString(),
      message: 'No doses recorded yet'
    };
  }
  
  // Calculate next due date based on frequency
  const nextDueDate = getNextDueDate(lastDose, frequency);
  
  // Overdue
  if (nextDueDate && isPast(nextDueDate) && !isToday(nextDueDate)) {
    return {
      status: MedicationStatusEnum.OVERDUE,
      daysRemaining: end ? differenceInDays(end, today) : null,
      lastDose: lastDose.toISOString(),
      nextDue: nextDueDate.toISOString(),
      started: true,
      completed: false,
      isActive: true,
      daysOverdue: differenceInDays(today, nextDueDate),
      daysUntilDue: -differenceInDays(today, nextDueDate),
      message: `Overdue by ${differenceInDays(today, nextDueDate)} days`
    };
  }
  
  // Due today
  if (nextDueDate && isToday(nextDueDate)) {
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysRemaining: end ? differenceInDays(end, today) : null,
      lastDose: lastDose.toISOString(),
      nextDue: nextDueDate.toISOString(),
      started: true,
      completed: false,
      isActive: true,
      daysOverdue: 0,
      daysUntilDue: differenceInDays(nextDueDate, today),
      message: isToday(nextDueDate) ? 'Due today' : `Due in ${differenceInDays(nextDueDate, today)} days`
    };
  }
  
  // Active and on schedule
  return {
    status: MedicationStatusEnum.ACTIVE,
    daysRemaining: end ? differenceInDays(end, today) : null,
    lastDose: lastDose.toISOString(),
    nextDue: nextDueDate?.toISOString(),
    started: true,
    completed: false,
    isActive: true,
    daysOverdue: 0,
    daysUntilDue: nextDueDate ? differenceInDays(nextDueDate, today) : null,
    message: nextDueDate ? `Next dose in ${differenceInDays(nextDueDate, today)} days` : 'On schedule'
  };
}

/**
 * Determine the medication status based on last_administered and end_date
 * This function is used by MedicationTracker component
 */
export function getMedicationStatus(
  lastAdministered: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  isActive: boolean = true
): MedicationStatusResult {
  const today = new Date();
  const end = endDate ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) : null;
  const lastDose = lastAdministered
    ? (typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered)
    : null;
  
  // If medication is not active, return completed or discontinued status
  if (!isActive) {
    return {
      status: end && end < today ? MedicationStatusEnum.COMPLETED : MedicationStatusEnum.DISCONTINUED,
      daysRemaining: 0,
      started: true,
      completed: true,
      isActive: false,
      nextDue: null,
      message: end && end < today ? 'Medication course completed' : 'Medication discontinued'
    };
  }
  
  // If medication has ended, return completed status
  if (end && end < today) {
    return {
      status: MedicationStatusEnum.COMPLETED,
      daysRemaining: 0,
      started: true,
      completed: true,
      isActive: false,
      nextDue: null,
      message: `Completed ${differenceInDays(today, end)} days ago`
    };
  }
  
  // If no doses recorded yet
  if (!lastDose) {
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysRemaining: end ? differenceInDays(end, today) : null,
      started: true,
      completed: false,
      isActive: true,
      nextDue: new Date().toISOString(),
      message: 'No doses recorded yet'
    };
  }
  
  // Calculate next due date (assuming daily for simplicity)
  const nextDueDate = addDays(lastDose, 1);
  const daysOverdue = nextDueDate ? differenceInDays(today, nextDueDate) : 0;
  const daysUntilDue = nextDueDate ? differenceInDays(nextDueDate, today) : 0;
  
  // Overdue
  if (daysOverdue > 0) {
    return {
      status: MedicationStatusEnum.OVERDUE,
      daysRemaining: end ? differenceInDays(end, today) : null,
      lastDose: lastDose.toISOString(),
      nextDue: nextDueDate?.toISOString(),
      started: true,
      completed: false,
      isActive: true,
      daysOverdue,
      daysUntilDue: -daysOverdue,
      message: `Overdue by ${daysOverdue} days`
    };
  }
  
  // Due today
  if (isToday(nextDueDate)) {
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysRemaining: end ? differenceInDays(end, today) : null,
      lastDose: lastDose.toISOString(),
      nextDue: nextDueDate.toISOString(),
      started: true,
      completed: false,
      isActive: true,
      daysOverdue: 0,
      daysUntilDue: 0,
      message: 'Due today'
    };
  }
  
  // Active and on schedule
  return {
    status: MedicationStatusEnum.ACTIVE,
    daysRemaining: end ? differenceInDays(end, today) : null,
    lastDose: lastDose.toISOString(),
    nextDue: nextDueDate?.toISOString(),
    started: true,
    completed: false,
    isActive: true,
    daysOverdue: 0,
    daysUntilDue: daysUntilDue,
    message: `Next dose in ${daysUntilDue} days`
  };
}

/**
 * Calculate the next due date based on last dose and frequency
 */
function getNextDueDate(lastDose: Date, frequency: string): Date | null {
  const lowerFrequency = frequency.toLowerCase();
  const today = new Date();
  
  const nextDueDate = new Date(lastDose);
  
  // Simple frequency handling
  if (lowerFrequency.includes('daily') || lowerFrequency.includes('once')) {
    nextDueDate.setDate(lastDose.getDate() + 1);
  } else if (lowerFrequency.includes('twice')) {
    // For twice daily, add 12 hours
    nextDueDate.setTime(lastDose.getTime() + 12 * 60 * 60 * 1000);
  } else if (lowerFrequency.includes('weekly')) {
    nextDueDate.setDate(lastDose.getDate() + 7);
  } else if (lowerFrequency.includes('biweekly')) {
    nextDueDate.setDate(lastDose.getDate() + 14);
  } else if (lowerFrequency.includes('month')) {
    nextDueDate.setMonth(lastDose.getMonth() + 1);
  } else if (lowerFrequency.includes('quarter')) {
    nextDueDate.setMonth(lastDose.getMonth() + 3);
  } else if (lowerFrequency.includes('annual')) {
    nextDueDate.setFullYear(lastDose.getFullYear() + 1);
  } else if (lowerFrequency.includes('needed') || lowerFrequency.includes('prn')) {
    // As needed medications don't have a set next date
    return null;
  } else {
    // Default to daily if frequency is not recognized
    nextDueDate.setDate(lastDose.getDate() + 1);
  }
  
  return nextDueDate;
}

/**
 * Process medication logs and organize them by type
 */
export function processMedicationLogs(logs: any[]): Record<string, any[]> {
  const result: Record<string, any[]> = {
    preventative: [],
    other: []
  };
  
  logs.forEach(log => {
    if (log.medication_type === 'preventative') {
      result.preventative.push(log);
    } else {
      result.other.push(log);
    }
  });
  
  return result;
}
