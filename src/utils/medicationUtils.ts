import { MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { addDays, format, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';

// MedicationFrequencyConstants
export const MedicationFrequencyConstants = {
  ONCE: 'once',
  DAILY: 'daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as_needed',
};

// Calculate days until next dose based on frequency
export const calculateDaysUntilNextDose = (frequency: string, lastAdministered: string | Date): number => {
  if (!lastAdministered) return 0;

  const lastDate = typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered;
  const today = new Date();
  let nextDueDate = new Date(lastDate);

  switch (frequency.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
      nextDueDate.setDate(lastDate.getDate() + 1);
      break;
    case MedicationFrequencyConstants.TWICE_DAILY:
      nextDueDate.setHours(lastDate.getHours() + 12);
      break;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      nextDueDate.setHours(lastDate.getHours() + 8);
      break;
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      nextDueDate.setHours(lastDate.getHours() + 6);
      break;
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      nextDueDate.setDate(lastDate.getDate() + 2);
      break;
    case MedicationFrequencyConstants.WEEKLY:
      nextDueDate.setDate(lastDate.getDate() + 7);
      break;
    case MedicationFrequencyConstants.BIWEEKLY:
      nextDueDate.setDate(lastDate.getDate() + 14);
      break;
    case MedicationFrequencyConstants.MONTHLY:
      nextDueDate.setMonth(lastDate.getMonth() + 1);
      break;
    default:
      nextDueDate.setDate(lastDate.getDate() + 1); // Default to daily
  }

  // If next dose is due today but not administered yet, return 0
  if (isSameDay(nextDueDate, today)) {
    return 0;
  }

  // If next dose is before today, it's overdue, return negative number of days
  if (isBefore(nextDueDate, today)) {
    return Math.floor((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Otherwise, return positive number of days until next dose
  return Math.ceil((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Process medication to determine status
export const getMedicationStatus = (
  frequency: string,
  lastAdministered?: string | null,
  endDate?: string | null,
  startDate?: string | null
): MedicationStatusResult => {
  const today = new Date();
  
  // Check if medication has not started yet
  if (startDate && isBefore(today, parseISO(startDate))) {
    return {
      status: MedicationStatusEnum.NOT_STARTED,
      daysTillDue: Math.ceil((parseISO(startDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      nextDue: parseISO(startDate),
      isActive: false,
    };
  }
  
  // Check if medication has been discontinued or completed
  if (endDate) {
    const endDateObj = parseISO(endDate);
    
    // If end date is in the past, medication is completed
    if (isBefore(endDateObj, today)) {
      return {
        status: MedicationStatusEnum.COMPLETED,
        daysTillDue: null,
        nextDue: null,
        isActive: false,
      };
    }
  }
  
  // Check if medication is active but not yet administered
  if (!lastAdministered) {
    return {
      status: MedicationStatusEnum.SCHEDULED,
      daysTillDue: 0, // Due today since never administered
      nextDue: startDate ? parseISO(startDate) : today,
      isActive: true,
    };
  }
  
  // Handle regular medication with last administration date
  const lastAdminDate = parseISO(lastAdministered);
  const daysUntilDue = calculateDaysUntilNextDose(frequency, lastAdminDate);
  
  // Calculate next due date
  let nextDue = new Date(lastAdminDate);
  switch (frequency.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
      nextDue = addDays(lastAdminDate, 1);
      break;
    case MedicationFrequencyConstants.TWICE_DAILY:
      nextDue.setHours(lastAdminDate.getHours() + 12);
      break;
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      nextDue = addDays(lastAdminDate, 2);
      break;
    case MedicationFrequencyConstants.WEEKLY:
      nextDue = addDays(lastAdminDate, 7);
      break;
    default:
      nextDue = addDays(lastAdminDate, 1);
      break;
  }
  
  // Determine status based on days until due
  if (daysUntilDue < 0) {
    return {
      status: MedicationStatusEnum.OVERDUE,
      daysTillDue: daysUntilDue,
      nextDue,
      isActive: true,
    };
  } else if (daysUntilDue === 0) {
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysTillDue: 0,
      nextDue,
      isActive: true,
    };
  } else {
    return {
      status: MedicationStatusEnum.UPCOMING,
      daysTillDue: daysUntilDue,
      nextDue,
      isActive: true,
    };
  }
};

// Helper function for status label and color
export const getStatusLabel = (status: MedicationStatusEnum | string): { statusLabel: string, statusColor: string } => {
  const statusStr = typeof status === 'string' ? status : status;
  
  switch (statusStr) {
    case MedicationStatusEnum.ACTIVE:
      return { statusLabel: 'Active', statusColor: 'bg-green-100 text-green-700' };
    case MedicationStatusEnum.SCHEDULED:
      return { statusLabel: 'Scheduled', statusColor: 'bg-blue-100 text-blue-700' };
    case MedicationStatusEnum.NOT_STARTED:
      return { statusLabel: 'Not Started', statusColor: 'bg-gray-100 text-gray-700' };
    case MedicationStatusEnum.OVERDUE:
      return { statusLabel: 'Overdue', statusColor: 'bg-red-100 text-red-700' };
    case MedicationStatusEnum.MISSED:
      return { statusLabel: 'Missed', statusColor: 'bg-orange-100 text-orange-700' };
    case MedicationStatusEnum.DISCONTINUED:
      return { statusLabel: 'Discontinued', statusColor: 'bg-red-100 text-red-700' };
    case MedicationStatusEnum.UNKNOWN:
      return { statusLabel: 'Unknown', statusColor: 'bg-gray-100 text-gray-700' };
    default:
      return { statusLabel: 'Active', statusColor: 'bg-green-100 text-green-700' };
  }
};

// Process medication logs to segregate preventative and regular medications
export const processMedicationLogs = (logs: any[]): { preventative: any[], other: any[] } => {
  const preventative: any[] = [];
  const other: any[] = [];

  if (!logs || logs.length === 0) {
    return { preventative, other };
  }

  // Process each log entry
  logs.forEach(log => {
    if (log.is_preventative) {
      preventative.push(log);
    } else {
      other.push(log);
    }
  });

  return { preventative, other };
};

// Calculate medication status based on start/end dates
export const calculateMedicationStatus = (
  startDate?: string | null,
  endDate?: string | null,
  lastAdministered?: string | null,
  frequency: string = 'daily'
): MedicationStatusEnum => {
  const today = new Date();
  
  // If no start date, consider it not started
  if (!startDate) {
    return MedicationStatusEnum.NOT_STARTED;
  }
  
  const start = new Date(startDate);
  
  // If start date is in the future, medication is not started yet
  if (start > today) {
    return MedicationStatusEnum.NOT_STARTED;
  }
  
  // If end date exists and is in the past, medication is completed
  if (endDate && new Date(endDate) < today) {
    return MedicationStatusEnum.COMPLETED;
  }
  
  // If no last administration, but should have started, it's overdue
  if (!lastAdministered && start < today) {
    return MedicationStatusEnum.OVERDUE;
  }
  
  // If has been administered, check if next dose is overdue
  if (lastAdministered) {
    const daysUntilDue = calculateDaysUntilNextDose(frequency, lastAdministered);
    if (daysUntilDue < 0) {
      return MedicationStatusEnum.OVERDUE;
    } else if (daysUntilDue === 0) {
      return MedicationStatusEnum.ACTIVE;
    } else {
      return MedicationStatusEnum.ACTIVE;
    }
  }
  
  // Default to active if medication has started but not ended
  return MedicationStatusEnum.ACTIVE;
};

// Format medication frequency for display
export const formatMedicationFrequency = (frequency: string): string => {
  switch (frequency?.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
      return 'Once daily';
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 'Twice daily';
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return 'Three times daily';
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      return 'Four times daily';
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return 'Every other day';
    case MedicationFrequencyConstants.WEEKLY:
      return 'Weekly';
    case MedicationFrequencyConstants.BIWEEKLY:
      return 'Every two weeks';
    case MedicationFrequencyConstants.MONTHLY:
      return 'Monthly';
    case MedicationFrequencyConstants.AS_NEEDED:
      return 'As needed';
    case MedicationFrequencyConstants.ONCE:
      return 'One time only';
    default:
      return frequency || 'Unknown frequency';
  }
};

// Get next due date based on frequency and last administration
export const getNextDueDate = (
  frequency: string,
  lastAdministered: string | Date
): Date | null => {
  if (!lastAdministered) return null;
  
  const lastDate = typeof lastAdministered === 'string' 
    ? parseISO(lastAdministered) 
    : lastAdministered;
  
  let nextDueDate = new Date(lastDate);
  
  switch (frequency.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
      nextDueDate.setDate(lastDate.getDate() + 1);
      break;
    case MedicationFrequencyConstants.TWICE_DAILY:
      nextDueDate.setHours(lastDate.getHours() + 12);
      break;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      nextDueDate.setHours(lastDate.getHours() + 8);
      break;
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      nextDueDate.setHours(lastDate.getHours() + 6);
      break;
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      nextDueDate.setDate(lastDate.getDate() + 2);
      break;
    case MedicationFrequencyConstants.WEEKLY:
      nextDueDate.setDate(lastDate.getDate() + 7);
      break;
    case MedicationFrequencyConstants.BIWEEKLY:
      nextDueDate.setDate(lastDate.getDate() + 14);
      break;
    case MedicationFrequencyConstants.MONTHLY:
      nextDueDate.setMonth(lastDate.getMonth() + 1);
      break;
    case MedicationFrequencyConstants.ONCE:
      return null; // One-time medications don't have a next due date
    case MedicationFrequencyConstants.AS_NEEDED:
      return null; // As-needed medications don't have a fixed next due date
    default:
      nextDueDate.setDate(lastDate.getDate() + 1); // Default to daily
  }
  
  return nextDueDate;
};
