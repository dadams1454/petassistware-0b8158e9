
import { 
  MedicationStatus, 
  MedicationStatusEnum,
  MedicationStatusResult
} from '@/types/health';
import { differenceInDays, parseISO } from 'date-fns';

// Medication frequency constants
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice-daily',
  THREE_TIMES_DAILY: 'three-times-daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUAL: 'annual',
  AS_NEEDED: 'as-needed'
};

// Get frequency days
export const getFrequencyDays = (frequency: string): number => {
  switch (frequency?.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
      return 1;
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 0.5;
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return 0.33;
    case MedicationFrequencyConstants.WEEKLY:
      return 7;
    case MedicationFrequencyConstants.BIWEEKLY:
      return 14;
    case MedicationFrequencyConstants.MONTHLY:
      return 30;
    case MedicationFrequencyConstants.QUARTERLY:
      return 90;
    case MedicationFrequencyConstants.ANNUAL:
      return 365;
    case MedicationFrequencyConstants.AS_NEEDED:
      return -1; // Special case for as-needed
    default:
      return 1; // Default to daily if unknown
  }
};

// Process medication logs
export const processMedicationLogs = (logs: any[]) => {
  if (!logs || logs.length === 0) {
    return { preventative: [], other: [] };
  }
  
  const medications: { [key: string]: any } = {};
  
  logs.forEach(log => {
    const medicationId = log.medication_id || log.id;
    
    if (!medications[medicationId]) {
      medications[medicationId] = {
        id: medicationId,
        name: log.medication_name || log.name,
        dosage: log.dosage,
        dosageUnit: log.dosage_unit,
        frequency: log.frequency,
        isPreventative: log.is_preventative || false,
        lastAdministered: log.timestamp,
        notes: log.notes
      };
    } else if (medications[medicationId].lastAdministered && log.timestamp) {
      const lastDate = new Date(medications[medicationId].lastAdministered);
      const currentDate = new Date(log.timestamp);
      
      if (currentDate > lastDate) {
        medications[medicationId].lastAdministered = log.timestamp;
      }
    }
  });
  
  // Separate preventative and other medications
  const preventative = [];
  const other = [];
  
  for (const id in medications) {
    const medication = medications[id];
    
    // Calculate next due date based on frequency and last administered
    if (medication.lastAdministered && medication.frequency) {
      const days = getFrequencyDays(medication.frequency);
      const lastDate = new Date(medication.lastAdministered);
      
      if (days > 0) {
        const nextDue = new Date(lastDate.getTime() + days * 24 * 60 * 60 * 1000);
        medication.nextDue = nextDue.toISOString();
        
        // Determine status
        const today = new Date();
        const daysUntilDue = Math.ceil((nextDue.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
        
        if (daysUntilDue < 0) {
          medication.status = 'overdue';
        } else if (daysUntilDue === 0) {
          medication.status = 'active';
        } else if (daysUntilDue <= 2) {
          medication.status = 'upcoming';
        } else {
          medication.status = 'completed';
        }
      } else if (days === -1) {
        // As-needed medications are always considered active
        medication.status = 'active';
      } else {
        medication.status = 'unknown';
      }
    } else {
      medication.status = 'unknown';
    }
    
    // Push to appropriate array
    if (medication.isPreventative) {
      preventative.push(medication);
    } else {
      other.push(medication);
    }
  }
  
  return { preventative, other };
};

// Get status label and color
export const getStatusLabel = (status: MedicationStatusEnum | string): { statusLabel: string; statusColor: string; emoji?: string } => {
  switch (status) {
    case 'active':
    case MedicationStatusEnum.Active:
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800',
        emoji: '✅'
      };
    case 'upcoming':
      return {
        statusLabel: 'Upcoming',
        statusColor: 'bg-blue-100 text-blue-800',
        emoji: '📆'
      };
    case 'overdue':
      return {
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800',
        emoji: '⚠️'
      };
    case 'completed':
    case MedicationStatusEnum.Completed:
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '✓'
      };
    case 'unknown':
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-600',
        emoji: '❓'
      };
  }
};

// Determine medication status
export const determineMedicationStatus = (
  lastAdministered: string | null,
  frequency: string | null
): MedicationStatusEnum => {
  if (!lastAdministered || !frequency) {
    return MedicationStatusEnum.NotStarted;
  }
  
  const days = getFrequencyDays(frequency);
  if (days === -1) {
    // As-needed medications are always considered active
    return MedicationStatusEnum.Active;
  }
  
  const lastDate = parseISO(lastAdministered);
  const nextDue = new Date(lastDate.getTime() + days * 24 * 60 * 60 * 1000);
  const today = new Date();
  const daysUntilDue = differenceInDays(nextDue, today);
  
  if (daysUntilDue < 0) {
    return MedicationStatusEnum.Discontinued; // Using existing enum instead of 'Overdue'
  } else if (daysUntilDue === 0) {
    return MedicationStatusEnum.Active;
  } else if (daysUntilDue <= 2) {
    return MedicationStatusEnum.Scheduled; // Using existing enum instead of 'Upcoming'
  } else {
    return MedicationStatusEnum.Active;
  }
};
