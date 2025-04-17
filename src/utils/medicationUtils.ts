
/**
 * Utility functions for medication management
 */

import { 
  MedicationStatusEnum, 
  ExtendedMedicationStatusEnum,
  MedicationStatusResult,
  isDetailedStatus,
  getStatusString
} from '@/types/medication-status';

/**
 * Constants for medication frequencies
 */
export const MedicationFrequencyConstants = {
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as_needed',
  CUSTOM: 'custom'
};

/**
 * Get a user-friendly label for a medication status
 */
export function getStatusLabel(status: MedicationStatusResult): string {
  const statusStr = getStatusString(status);
  
  switch (statusStr) {
    case MedicationStatusEnum.DUE:
      return 'Due Now';
    case MedicationStatusEnum.OVERDUE:
      return 'Overdue';
    case MedicationStatusEnum.ADMINISTERED:
      return 'Administered';
    case MedicationStatusEnum.PAUSED:
      return 'Paused';
    case MedicationStatusEnum.COMPLETED:
      return 'Completed';
    case MedicationStatusEnum.PENDING:
      return 'Pending';
    case MedicationStatusEnum.UPCOMING:
      return 'Upcoming';
    case ExtendedMedicationStatusEnum.SKIPPED:
      return 'Skipped';
    case ExtendedMedicationStatusEnum.UNKNOWN:
    default:
      return 'Unknown';
  }
}

/**
 * Calculate the status of a medication based on its schedule and administration history
 */
export function calculateMedicationStatus(
  lastAdministered: Date | null,
  nextDue: Date | null,
  frequency: string,
  isPaused: boolean = false
): MedicationStatusResult {
  if (isPaused) {
    return {
      status: MedicationStatusEnum.PAUSED,
      message: 'Treatment is temporarily paused'
    };
  }
  
  const now = new Date();
  
  if (!nextDue) {
    return {
      status: ExtendedMedicationStatusEnum.UNKNOWN,
      message: 'No schedule information'
    };
  }
  
  // If next due is in the future
  if (nextDue > now) {
    // If due within the next 24 hours
    const timeDiff = nextDue.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff <= 24) {
      return {
        status: MedicationStatusEnum.UPCOMING,
        message: `Due in ${Math.round(hoursDiff)} hours`,
        nextDue
      };
    }
    
    return {
      status: MedicationStatusEnum.PENDING,
      nextDue
    };
  }
  
  // If next due is in the past
  const timeDiff = now.getTime() - nextDue.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  if (hoursDiff <= 1) {
    return {
      status: MedicationStatusEnum.DUE,
      message: 'Due now',
      nextDue
    };
  }
  
  return {
    status: MedicationStatusEnum.OVERDUE,
    message: `Overdue by ${Math.round(hoursDiff)} hours`,
    nextDue
  };
}

/**
 * Process medication logs to determine next doses and history
 */
export function processMedicationLogs(medication: any, logs: any[]) {
  // This is a placeholder implementation
  // In a real implementation, this would analyze logs and determine 
  // patterns, next administration times, etc.
  
  return {
    lastAdministered: logs.length > 0 ? new Date(logs[0].administered_date) : null,
    nextDue: calculateNextDose(medication, logs),
    complianceRate: calculateComplianceRate(medication, logs),
    missedDoses: calculateMissedDoses(medication, logs)
  };
}

// Helper utility functions
function calculateNextDose(medication: any, logs: any[]): Date | null {
  // Simplified implementation
  if (!medication.frequency) return null;
  
  const lastLog = logs.length > 0 ? logs[0] : null;
  if (!lastLog) return new Date();
  
  const lastAdministered = new Date(lastLog.administered_date);
  const nextDose = new Date(lastAdministered);
  
  // Add time based on frequency
  switch (medication.frequency) {
    case MedicationFrequencyConstants.ONCE_DAILY:
      nextDose.setDate(nextDose.getDate() + 1);
      break;
    case MedicationFrequencyConstants.TWICE_DAILY:
      nextDose.setHours(nextDose.getHours() + 12);
      break;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      nextDose.setHours(nextDose.getHours() + 8);
      break;
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      nextDose.setHours(nextDose.getHours() + 6);
      break;
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      nextDose.setDate(nextDose.getDate() + 2);
      break;
    case MedicationFrequencyConstants.WEEKLY:
      nextDose.setDate(nextDose.getDate() + 7);
      break;
    default:
      return null;
  }
  
  return nextDose;
}

function calculateComplianceRate(medication: any, logs: any[]): number {
  // Placeholder implementation
  return logs.length > 0 ? 100 : 0;
}

function calculateMissedDoses(medication: any, logs: any[]): number {
  // Placeholder implementation
  return 0;
}

export { ExtendedMedicationStatusEnum };
