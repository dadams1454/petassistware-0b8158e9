
/**
 * Medication status types and utility functions
 */

// Base status enum for medications
export enum MedicationStatusEnum {
  DUE = 'due',
  OVERDUE = 'overdue',
  UPCOMING = 'upcoming',
  ADMINISTERED = 'administered',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  PENDING = 'pending'
}

// Detailed status result, with optional message and other properties
export interface MedicationStatusDetail {
  status: MedicationStatusEnum;
  message?: string;
  daysOverdue?: number;
  daysUntilDue?: number;
  nextDue?: string | Date | null;
}

// Union type for simple strings or detailed objects
export type MedicationStatusResult = MedicationStatusEnum | MedicationStatusDetail;

/**
 * Determines if the status is a detailed object or just an enum value
 */
export function isDetailedStatus(
  status: MedicationStatusResult
): status is MedicationStatusDetail {
  return typeof status === 'object' && status !== null && 'status' in status;
}

/**
 * Gets the string status value regardless of input type
 */
export function getStatusString(status: MedicationStatusResult): MedicationStatusEnum {
  if (isDetailedStatus(status)) {
    return status.status;
  }
  return status;
}

/**
 * Gets the message for a status, if available
 */
export function getStatusMessage(status: MedicationStatusResult): string {
  if (isDetailedStatus(status) && status.message) {
    return status.message;
  }
  
  // Default messages based on status
  const statusStr = getStatusString(status);
  
  switch (statusStr) {
    case MedicationStatusEnum.DUE:
      return 'Due today';
    case MedicationStatusEnum.OVERDUE:
      const days = isDetailedStatus(status) && status.daysOverdue 
        ? status.daysOverdue 
        : undefined;
      return days ? `Overdue by ${days} day${days !== 1 ? 's' : ''}` : 'Overdue';
    case MedicationStatusEnum.UPCOMING:
      const daysUntil = isDetailedStatus(status) && status.daysUntilDue 
        ? status.daysUntilDue 
        : undefined;
      return daysUntil ? `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}` : 'Upcoming';
    case MedicationStatusEnum.ADMINISTERED:
      return 'Administered';
    case MedicationStatusEnum.PAUSED:
      return 'Paused';
    case MedicationStatusEnum.COMPLETED:
      return 'Completed';
    case MedicationStatusEnum.PENDING:
      return 'Pending';
    default:
      return 'Unknown status';
  }
}
