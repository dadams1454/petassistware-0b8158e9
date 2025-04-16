
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

export { ExtendedMedicationStatusEnum };
