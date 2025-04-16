
import { 
  MedicationStatusEnum, 
  MedicationStatusResult, 
  isDetailedStatus, 
  getStatusString
} from '@/types/medication-status';
import { Medication, MedicationAdministration } from '@/types/health';

/**
 * Constants for medication frequency values
 */
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  ONCE_DAILY: 'once daily',
  TWICE_DAILY: 'twice daily',
  THREE_TIMES_DAILY: 'three times daily',
  EVERY_OTHER_DAY: 'every other day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as needed'
};

/**
 * Additional status types for UI display purposes
 */
export const ExtendedMedicationStatusEnum = {
  ...MedicationStatusEnum,
  SKIPPED: 'skipped',
  UNKNOWN: 'unknown'
};

/**
 * Get the display label for a medication status
 */
export function getStatusLabel(status: MedicationStatusResult | string): string {
  const statusString = typeof status === 'string' ? status : getStatusString(status);

  switch (statusString) {
    case MedicationStatusEnum.DUE:
      return 'Due';
    case MedicationStatusEnum.OVERDUE:
      return 'Overdue';
    case MedicationStatusEnum.UPCOMING:
      return 'Upcoming';
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

/**
 * Process medication logs to get the latest status
 */
export function processMedicationLogs(logs: any[]): Record<string, any> {
  if (!logs || !Array.isArray(logs)) {
    return {};
  }

  const processedLogs: Record<string, any> = {};

  // Group logs by medication_id
  logs.forEach(log => {
    const medicationId = log.metadata?.medication_id;
    if (medicationId) {
      if (!processedLogs[medicationId]) {
        processedLogs[medicationId] = [];
      }
      processedLogs[medicationId].push(log);
    }
  });

  // Sort logs for each medication by timestamp (newest first)
  Object.keys(processedLogs).forEach(medicationId => {
    processedLogs[medicationId].sort((a: any, b: any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  });

  return processedLogs;
}

/**
 * Calculate the medication status based on schedule and administrations
 */
export function calculateMedicationStatus(
  medication: Medication,
  lastAdministered?: string | Date | null
): MedicationStatusResult {
  if (!medication) {
    return ExtendedMedicationStatusEnum.UNKNOWN;
  }

  // Handle paused medications
  if (medication.paused) {
    return MedicationStatusEnum.PAUSED;
  }

  // Handle completed medications
  if (medication.end_date && new Date(medication.end_date) < new Date()) {
    return MedicationStatusEnum.COMPLETED;
  }

  const now = new Date();
  const startDate = medication.start_date ? new Date(medication.start_date) : null;

  // If medication hasn't started yet
  if (startDate && startDate > now) {
    return {
      status: MedicationStatusEnum.UPCOMING,
      message: 'Scheduled to start soon',
      nextDue: startDate,
      daysUntilDue: Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    };
  }

  // If we have a 'next_due' date specified directly
  if (medication.next_due) {
    const nextDueDate = new Date(medication.next_due);
    const isOverdue = nextDueDate < now;
    const isDueToday = nextDueDate.toDateString() === now.toDateString();

    if (isOverdue) {
      const daysOverdue = Math.ceil((now.getTime() - nextDueDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: MedicationStatusEnum.OVERDUE,
        message: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
        nextDue: nextDueDate,
        daysOverdue
      };
    }
    
    if (isDueToday) {
      return {
        status: MedicationStatusEnum.DUE,
        message: 'Due today',
        nextDue: nextDueDate
      };
    }
    
    const daysUntil = Math.ceil((nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: MedicationStatusEnum.UPCOMING,
      message: `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
      nextDue: nextDueDate,
      daysUntilDue: daysUntil
    };
  }

  // If there's no next_due date but we have a last administered date, calculate based on frequency
  if (lastAdministered && medication.frequency) {
    // Calculate the next due date based on the frequency
    const lastDate = new Date(lastAdministered);
    let nextDueDate: Date;
    
    switch (medication.frequency.toLowerCase()) {
      case MedicationFrequencyConstants.DAILY:
      case MedicationFrequencyConstants.ONCE_DAILY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setDate(lastDate.getDate() + 1);
        break;
      case MedicationFrequencyConstants.TWICE_DAILY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setHours(lastDate.getHours() + 12);
        break;
      case MedicationFrequencyConstants.THREE_TIMES_DAILY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setHours(lastDate.getHours() + 8);
        break;
      case MedicationFrequencyConstants.EVERY_OTHER_DAY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setDate(lastDate.getDate() + 2);
        break;
      case MedicationFrequencyConstants.WEEKLY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setDate(lastDate.getDate() + 7);
        break;
      case MedicationFrequencyConstants.BIWEEKLY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setDate(lastDate.getDate() + 14);
        break;
      case MedicationFrequencyConstants.MONTHLY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setMonth(lastDate.getMonth() + 1);
        break;
      case MedicationFrequencyConstants.QUARTERLY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setMonth(lastDate.getMonth() + 3);
        break;
      case MedicationFrequencyConstants.ANNUALLY:
        nextDueDate = new Date(lastDate);
        nextDueDate.setFullYear(lastDate.getFullYear() + 1);
        break;
      case MedicationFrequencyConstants.AS_NEEDED:
        return {
          status: MedicationStatusEnum.PENDING,
          message: 'As needed',
          nextDue: null
        };
      default:
        return {
          status: ExtendedMedicationStatusEnum.UNKNOWN,
          message: 'Unknown schedule',
          nextDue: null
        };
    }
    
    // Now determine status based on the calculated next due date
    const isOverdue = nextDueDate < now;
    const isDueToday = nextDueDate.toDateString() === now.toDateString();

    if (isOverdue) {
      const daysOverdue = Math.ceil((now.getTime() - nextDueDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: MedicationStatusEnum.OVERDUE,
        message: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
        nextDue: nextDueDate,
        daysOverdue
      };
    }
    
    if (isDueToday) {
      return {
        status: MedicationStatusEnum.DUE,
        message: 'Due today',
        nextDue: nextDueDate
      };
    }
    
    const daysUntil = Math.ceil((nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: MedicationStatusEnum.UPCOMING,
      message: `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
      nextDue: nextDueDate,
      daysUntilDue: daysUntil
    };
  }

  // If we don't have enough information to calculate the status
  if (medication.frequency === MedicationFrequencyConstants.AS_NEEDED) {
    return {
      status: MedicationStatusEnum.PENDING,
      message: 'As needed',
      nextDue: null
    };
  }

  // Default case
  return {
    status: ExtendedMedicationStatusEnum.UNKNOWN,
    message: 'Unable to determine status',
    nextDue: null
  };
}
