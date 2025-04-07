
import { format, addDays, parseISO, isPast, isToday, differenceInDays } from 'date-fns';
import { MedicationStatusEnum, type MedicationStatusResult } from '@/types/health';

// Define medication frequency constants
export const MedicationFrequencyConstants = {
  ONCE: 'once',
  DAILY: 'daily',
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as_needed'
};

/**
 * Get a human-readable label and color for a medication status
 */
export function getStatusLabel(status: MedicationStatusEnum | string): { statusLabel: string; statusColor: string; emoji: string } {
  // Convert string status to enum if needed
  let statusEnum = status as MedicationStatusEnum;
  
  if (typeof status === 'string' && !(status in MedicationStatusEnum)) {
    switch (status.toLowerCase()) {
      case 'active': statusEnum = MedicationStatusEnum.ACTIVE; break;
      case 'completed': statusEnum = MedicationStatusEnum.COMPLETED; break;
      case 'discontinued': statusEnum = MedicationStatusEnum.DISCONTINUED; break;
      case 'paused': statusEnum = MedicationStatusEnum.PAUSED; break;
      case 'scheduled': statusEnum = MedicationStatusEnum.SCHEDULED; break;
      case 'overdue': statusEnum = MedicationStatusEnum.OVERDUE; break;
      case 'missed': statusEnum = MedicationStatusEnum.MISSED; break;
      case 'not_started': statusEnum = MedicationStatusEnum.NOT_STARTED; break;
      case 'upcoming': statusEnum = MedicationStatusEnum.UPCOMING; break;
      default: statusEnum = MedicationStatusEnum.UNKNOWN;
    }
  }
  
  // Get status label and color based on enum
  switch (statusEnum) {
    case MedicationStatusEnum.ACTIVE:
      return { statusLabel: 'Active', statusColor: 'bg-green-100 text-green-800', emoji: '✅' };
    case MedicationStatusEnum.COMPLETED:
      return { statusLabel: 'Completed', statusColor: 'bg-blue-100 text-blue-800', emoji: '✓' };
    case MedicationStatusEnum.DISCONTINUED:
      return { statusLabel: 'Discontinued', statusColor: 'bg-red-100 text-red-800', emoji: '⛔' };
    case MedicationStatusEnum.PAUSED:
      return { statusLabel: 'Paused', statusColor: 'bg-yellow-100 text-yellow-800', emoji: '⏸️' };
    case MedicationStatusEnum.SCHEDULED:
      return { statusLabel: 'Scheduled', statusColor: 'bg-blue-100 text-blue-800', emoji: '🗓️' };
    case MedicationStatusEnum.OVERDUE:
      return { statusLabel: 'Overdue', statusColor: 'bg-red-100 text-red-800', emoji: '⚠️' };
    case MedicationStatusEnum.MISSED:
      return { statusLabel: 'Missed', statusColor: 'bg-orange-100 text-orange-800', emoji: '❌' };
    case MedicationStatusEnum.NOT_STARTED:
      return { statusLabel: 'Not Started', statusColor: 'bg-gray-100 text-gray-800', emoji: '🔄' };
    case MedicationStatusEnum.UPCOMING:
      return { statusLabel: 'Upcoming', statusColor: 'bg-purple-100 text-purple-800', emoji: '🔜' };
    default:
      return { statusLabel: 'Unknown', statusColor: 'bg-gray-100 text-gray-800', emoji: '❓' };
  }
}

/**
 * Calculate the status of a medication based on start/end dates and last administration
 */
export function calculateMedicationStatus(
  startDate: string | Date,
  endDate: string | Date | null | undefined,
  lastAdministered: string | Date | null | undefined,
  frequency: string
): MedicationStatusResult {
  const today = new Date();
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = endDate 
    ? (typeof endDate === 'string' ? parseISO(endDate) : endDate)
    : null;
  const lastDose = lastAdministered
    ? (typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered)
    : null;
  
  // Not started yet
  if (start > today) {
    return {
      status: MedicationStatusEnum.NOT_STARTED,
      daysRemaining: differenceInDays(start, today),
      started: false,
      completed: false,
      isActive: false,
      nextDue: start.toISOString(),
      message: `Starting in ${differenceInDays(start, today)} days`
    };
  }
  
  // Already completed
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
  
  // Active but no doses recorded yet
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
  
  // Check if overdue based on frequency
  const nextDueDate = getNextDueDate(lastDose, frequency);
  const daysOverdue = nextDueDate ? differenceInDays(today, nextDueDate) : 0;
  const daysUntilDue = nextDueDate ? differenceInDays(nextDueDate, today) : 0;
  
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
  
  if (nextDueDate && isPast(nextDueDate)) {
    return {
      status: MedicationStatusEnum.OVERDUE,
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
  
  // Due soon (within 2 days)
  if (nextDueDate && differenceInDays(nextDueDate, today) <= 2) {
    return {
      status: MedicationStatusEnum.UPCOMING,
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
 * Get color class for a medication status
 */
export function getMedicationStatusColor(status: MedicationStatusEnum | string): string {
  if (status === MedicationStatusEnum.NOT_STARTED) {
    return 'text-gray-500';
  } else if (status === MedicationStatusEnum.ACTIVE) {
    return 'text-green-500';
  } else if (status === MedicationStatusEnum.OVERDUE) {
    return 'text-red-500';
  } else if (status === MedicationStatusEnum.MISSED) {
    return 'text-orange-500';
  } else if (status === MedicationStatusEnum.COMPLETED) {
    return 'text-blue-500';
  } else {
    return 'text-gray-500';
  }
}

/**
 * Calculate the next due date based on frequency and last dose
 */
function getNextDueDate(lastDose: Date, frequency: string): Date | null {
  switch (frequency) {
    case MedicationFrequencyConstants.ONCE:
      return null; // One-time dose, no next due date
    case MedicationFrequencyConstants.ONCE_DAILY:
    case MedicationFrequencyConstants.DAILY:
      return addDays(lastDose, 1);
    case MedicationFrequencyConstants.TWICE_DAILY:
      // Add 12 hours
      return new Date(lastDose.getTime() + 12 * 60 * 60 * 1000);
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      // Add 8 hours
      return new Date(lastDose.getTime() + 8 * 60 * 60 * 1000);
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      // Add 6 hours
      return new Date(lastDose.getTime() + 6 * 60 * 60 * 1000);
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return addDays(lastDose, 2);
    case MedicationFrequencyConstants.WEEKLY:
      return addDays(lastDose, 7);
    case MedicationFrequencyConstants.BIWEEKLY:
      return addDays(lastDose, 14);
    case MedicationFrequencyConstants.MONTHLY:
      // Add 30 days as an approximation
      return addDays(lastDose, 30);
    case MedicationFrequencyConstants.QUARTERLY:
      // Add 90 days as an approximation
      return addDays(lastDose, 90);
    case MedicationFrequencyConstants.ANNUALLY:
      // Add 365 days as an approximation
      return addDays(lastDose, 365);
    case MedicationFrequencyConstants.AS_NEEDED:
      return null; // As needed, no next due date
    default:
      return addDays(lastDose, 1); // Default to daily
  }
}

/**
 * Format medication frequency for display
 */
export function formatFrequency(frequency: string): string {
  switch (frequency) {
    case MedicationFrequencyConstants.ONCE:
      return 'Once only';
    case MedicationFrequencyConstants.DAILY:
    case MedicationFrequencyConstants.ONCE_DAILY:
      return 'Once daily';
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 'Twice daily';
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return '3 times daily';
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      return '4 times daily';
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return 'Every other day';
    case MedicationFrequencyConstants.WEEKLY:
      return 'Weekly';
    case MedicationFrequencyConstants.BIWEEKLY:
      return 'Every 2 weeks';
    case MedicationFrequencyConstants.MONTHLY:
      return 'Monthly';
    case MedicationFrequencyConstants.QUARTERLY:
      return 'Every 3 months';
    case MedicationFrequencyConstants.ANNUALLY:
      return 'Yearly';
    case MedicationFrequencyConstants.AS_NEEDED:
      return 'As needed';
    default:
      return frequency;
  }
}
