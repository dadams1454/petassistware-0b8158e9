
/**
 * Medication status related types
 */

/**
 * Medication status enum
 */
export enum MedicationStatusEnum {
  DUE = 'due',
  UPCOMING = 'upcoming',
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown',
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  SCHEDULED = 'scheduled',
  NOT_STARTED = 'not_started',
  DISCONTINUED = 'discontinued'
}

/**
 * Medication status result interface for detailed status information
 */
export interface MedicationStatusDetail {
  status: string;
  message: string;
  nextDue?: Date | string | null;
  daysOverdue?: number;
  daysUntilDue?: number;
}

/**
 * Medication status result type
 * Can be either a simple status string or a detailed status object
 */
export type MedicationStatusResult = 
  | MedicationStatusEnum
  | 'due'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'skipped'
  | 'unknown'
  | 'active'
  | 'paused'
  | 'stopped'
  | 'scheduled'
  | 'not_started'
  | 'discontinued'
  | MedicationStatusDetail;

/**
 * Helper to check if a status result is a detailed object
 */
export function isDetailedStatus(result: MedicationStatusResult): result is MedicationStatusDetail {
  return typeof result === 'object' && result !== null && 'status' in result;
}

/**
 * Get the status string from a medication status result
 */
export function getStatusString(result: MedicationStatusResult): string {
  if (isDetailedStatus(result)) {
    return result.status;
  }
  return result;
}

/**
 * Get the display message for a medication status
 */
export function getStatusMessage(result: MedicationStatusResult): string {
  if (isDetailedStatus(result)) {
    return result.message;
  }
  
  // Default messages for simple status strings
  switch (result) {
    case 'due':
      return 'Due today';
    case 'upcoming':
      return 'Coming up soon';
    case 'overdue':
      return 'Overdue';
    case 'completed':
      return 'Completed';
    case 'skipped':
      return 'Skipped';
    case 'active':
      return 'Active';
    case 'paused':
      return 'Paused';
    case 'stopped':
      return 'Stopped';
    case 'scheduled':
      return 'Scheduled';
    case 'not_started':
      return 'Not started';
    case 'discontinued':
      return 'Discontinued';
    default:
      return 'Unknown status';
  }
}
