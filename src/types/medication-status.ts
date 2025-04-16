
/**
 * Medication status type definitions
 */

// Main medication status enum
export enum MedicationStatusEnum {
  DUE = 'due',
  OVERDUE = 'overdue',
  ADMINISTERED = 'administered',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  PENDING = 'pending',
  UPCOMING = 'upcoming'
}

// Extended medication status enum with additional statuses
export enum ExtendedMedicationStatusEnum {
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown'
}

// Detailed status object with message
export interface MedicationStatusDetail {
  status: MedicationStatusEnum | ExtendedMedicationStatusEnum | string;
  message?: string;
  nextDue?: string | Date; // Future due date for medications
}

// Union type for medication status result
export type MedicationStatusResult = MedicationStatusEnum | ExtendedMedicationStatusEnum | MedicationStatusDetail | string;

// Type guard to check if a status has detailed information
export function isDetailedStatus(status: MedicationStatusResult): status is MedicationStatusDetail {
  return typeof status === 'object' && status !== null && 'status' in status;
}

// Get the string value of a status
export function getStatusString(status: MedicationStatusResult): string {
  if (isDetailedStatus(status)) {
    return status.status.toString();
  }
  return status.toString();
}

// Get a user-friendly message for a status
export function getStatusMessage(status: MedicationStatusResult): string {
  if (isDetailedStatus(status) && status.message) {
    return status.message;
  }
  
  // Default messages based on status
  const statusStr = getStatusString(status);
  switch (statusStr) {
    case MedicationStatusEnum.DUE:
      return 'Medication needs to be administered now';
    case MedicationStatusEnum.OVERDUE:
      return 'Medication is overdue';
    case MedicationStatusEnum.ADMINISTERED:
      return 'Medication has been administered';
    case MedicationStatusEnum.PAUSED:
      return 'Medication is temporarily paused';
    case MedicationStatusEnum.COMPLETED:
      return 'Medication course is completed';
    case MedicationStatusEnum.PENDING:
      return 'Medication is scheduled';
    case MedicationStatusEnum.UPCOMING:
      return 'Medication is coming up soon';
    case ExtendedMedicationStatusEnum.SKIPPED:
      return 'Medication dose was skipped';
    default:
      return '';
  }
}
