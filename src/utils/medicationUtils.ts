
import { MedicationStatusEnum, MedicationStatusResult } from '@/types/medication-status';

/**
 * Extended enum for additional medication statuses beyond the core ones
 */
export enum ExtendedMedicationStatusEnum {
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown'
}

/**
 * Gets a user-friendly label for a medication status
 */
export function getStatusLabel(status: MedicationStatusResult | string): string {
  const statusString = typeof status === 'string' ? status : status.status || '';
  
  switch (statusString) {
    case MedicationStatusEnum.DUE:
      return 'Due';
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
    case ExtendedMedicationStatusEnum.SKIPPED:
      return 'Skipped';
    case ExtendedMedicationStatusEnum.UNKNOWN:
    default:
      return 'Unknown';
  }
}
