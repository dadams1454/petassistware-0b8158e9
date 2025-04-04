
import { compareAsc, differenceInDays, differenceInHours, format, parseISO } from 'date-fns';
import { MedicationStatus, MedicationStatusResult } from '@/types/health';

// Define constants for medication frequency to avoid duplicate exports
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUAL: 'annual',
  AS_NEEDED: 'as_needed',
  ONE_TIME: 'one_time'
};

/**
 * Converts a medication frequency to a label for display
 */
export const frequencyToLabel = (frequency: string): string => {
  switch (frequency) {
    case MedicationFrequencyConstants.DAILY:
      return 'Once Daily';
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 'Twice Daily';
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return 'Three Times Daily';
    case MedicationFrequencyConstants.WEEKLY:
      return 'Weekly';
    case MedicationFrequencyConstants.BIWEEKLY:
      return 'Every Two Weeks';
    case MedicationFrequencyConstants.MONTHLY:
      return 'Monthly';
    case MedicationFrequencyConstants.QUARTERLY:
      return 'Every Three Months';
    case MedicationFrequencyConstants.ANNUAL:
      return 'Yearly';
    case MedicationFrequencyConstants.AS_NEEDED:
      return 'As Needed';
    case MedicationFrequencyConstants.ONE_TIME:
      return 'One Time';
    default:
      return frequency;
  }
};

/**
 * Converts a medication frequency to hours until next dose
 */
export const frequencyToHours = (frequency: string): number => {
  switch (frequency) {
    case MedicationFrequencyConstants.DAILY:
      return 24;
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 12;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return 8;
    case MedicationFrequencyConstants.WEEKLY:
      return 24 * 7;
    case MedicationFrequencyConstants.BIWEEKLY:
      return 24 * 14;
    case MedicationFrequencyConstants.MONTHLY:
      return 24 * 30;
    case MedicationFrequencyConstants.QUARTERLY:
      return 24 * 90;
    case MedicationFrequencyConstants.ANNUAL:
      return 24 * 365;
    default:
      return 0; // For as-needed or one-time meds
  }
};

/**
 * Determines if a medication is overdue based on its frequency and last dose
 */
export const isOverdue = (frequency: string, lastDose: string): boolean => {
  const lastDoseDate = parseISO(lastDose);
  const now = new Date();
  const hoursSinceLastDose = differenceInHours(now, lastDoseDate);
  const hoursUntilNextDose = frequencyToHours(frequency);
  
  // If it's a one-time medication or as-needed, it's never overdue
  if (frequency === MedicationFrequencyConstants.ONE_TIME || 
      frequency === MedicationFrequencyConstants.AS_NEEDED) {
    return false;
  }
  
  return hoursSinceLastDose > hoursUntilNextDose;
};

/**
 * Calculates the next due date based on frequency and last dose
 */
export const calculateNextDue = (frequency: string, lastDose: string): Date => {
  const lastDoseDate = parseISO(lastDose);
  const hoursUntilNextDose = frequencyToHours(frequency);
  
  // Add the appropriate hours to the last dose date
  return new Date(lastDoseDate.getTime() + hoursUntilNextDose * 60 * 60 * 1000);
};

/**
 * Determines the medication status based on various factors
 */
export const getMedicationStatus = (
  lastDosed: string | null, 
  frequency: string,
  startDate?: string | null,
  endDate?: string | null
): MedicationStatusResult => {
  const now = new Date();
  
  // Check if the medication has ended
  if (endDate && compareAsc(now, parseISO(endDate)) > 0) {
    return {
      status: MedicationStatus.completed,
      statusLabel: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      lastDosed: lastDosed ? parseISO(lastDosed) : undefined
    };
  }
  
  // If medication hasn't started yet
  if (startDate && compareAsc(now, parseISO(startDate)) < 0) {
    return {
      status: MedicationStatus.upcoming,
      statusLabel: 'Not Started',
      statusColor: 'bg-blue-100 text-blue-800',
      nextDue: parseISO(startDate)
    };
  }
  
  // If it's a one-time medication
  if (frequency === MedicationFrequencyConstants.ONE_TIME) {
    if (!lastDosed) {
      return {
        status: MedicationStatus.upcoming,
        statusLabel: 'Not Given',
        statusColor: 'bg-blue-100 text-blue-800'
      };
    } else {
      return {
        status: MedicationStatus.completed,
        statusLabel: 'Completed',
        statusColor: 'bg-green-100 text-green-800',
        lastDosed: parseISO(lastDosed)
      };
    }
  }
  
  // If it's an as-needed medication
  if (frequency === MedicationFrequencyConstants.AS_NEEDED) {
    return {
      status: MedicationStatus.active,
      statusLabel: 'As Needed',
      statusColor: 'bg-yellow-100 text-yellow-800',
      lastDosed: lastDosed ? parseISO(lastDosed) : undefined
    };
  }
  
  // For regular medications that have been dosed at least once
  if (lastDosed) {
    const nextDue = calculateNextDue(frequency, lastDosed);
    const daysUntilDue = differenceInDays(nextDue, now);
    
    if (daysUntilDue < 0) {
      return {
        status: MedicationStatus.overdue,
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800',
        nextDue,
        lastDosed: parseISO(lastDosed),
        daysOverdue: Math.abs(daysUntilDue)
      };
    } else if (daysUntilDue === 0) {
      return {
        status: MedicationStatus.active,
        statusLabel: 'Due Today',
        statusColor: 'bg-amber-100 text-amber-800',
        nextDue,
        lastDosed: parseISO(lastDosed)
      };
    } else {
      return {
        status: MedicationStatus.active,
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800',
        nextDue,
        lastDosed: parseISO(lastDosed),
        daysUntilDue
      };
    }
  }
  
  // If the medication has never been dosed
  return {
    status: MedicationStatus.overdue,
    statusLabel: 'Never Dosed',
    statusColor: 'bg-red-100 text-red-800'
  };
};

/**
 * Get the status label and color 
 */
export const getStatusLabel = (status: MedicationStatus): { statusLabel: string, statusColor: string, emoji?: string } => {
  switch (status) {
    case MedicationStatus.active:
      return { 
        statusLabel: 'Active', 
        statusColor: 'bg-green-100 text-green-800',
        emoji: '✅'
      };
    case MedicationStatus.overdue:
      return { 
        statusLabel: 'Overdue', 
        statusColor: 'bg-red-100 text-red-800',
        emoji: '⚠️'
      };
    case MedicationStatus.upcoming:
      return { 
        statusLabel: 'Upcoming', 
        statusColor: 'bg-blue-100 text-blue-800',
        emoji: '📅'
      };
    case MedicationStatus.completed:
      return { 
        statusLabel: 'Completed', 
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '✓'
      };
    case MedicationStatus.inactive:
      return { 
        statusLabel: 'Inactive', 
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '⏸️'
      };
    default:
      return { 
        statusLabel: 'Unknown', 
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '❓'
      };
  }
};

/**
 * Process medication logs to group them by preventative and other types
 */
export const processMedicationLogs = (logs: any[]) => {
  const preventative: any[] = [];
  const other: any[] = [];
  
  // Process each log entry
  logs.forEach(log => {
    if (log.medication_metadata?.preventative) {
      preventative.push({
        id: log.id,
        name: log.task_name,
        dosage: log.medication_metadata.dosage,
        frequency: log.medication_metadata.frequency,
        lastAdministered: log.timestamp,
        notes: log.notes,
        isPreventative: true,
        startDate: log.medication_metadata.start_date,
        endDate: log.medication_metadata.end_date,
      });
    } else {
      other.push({
        id: log.id,
        name: log.task_name,
        dosage: log.medication_metadata?.dosage,
        frequency: log.medication_metadata?.frequency || 'as_needed',
        lastAdministered: log.timestamp,
        notes: log.notes,
        isPreventative: false,
        startDate: log.medication_metadata?.start_date,
        endDate: log.medication_metadata?.end_date,
      });
    }
  });
  
  return { preventative, other };
};
