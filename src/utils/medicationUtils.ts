
import { 
  Medication, 
  MedicationStatusEnum, 
  MedicationStatus,
  MedicationStatusResult 
} from '@/types/health';
import { differenceInDays } from 'date-fns';

// Medication frequency constants
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice daily',
  EVERY_OTHER_DAY: 'every other day',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as needed',
  EVERY_12_HOURS: 'every 12 hours',
  EVERY_8_HOURS: 'every 8 hours',
  EVERY_6_HOURS: 'every 6 hours',
  SINGLE_DOSE: 'single dose'
};

// Process medication logs utility function
export function processMedicationLogs(logs: any[]) {
  if (!logs || !Array.isArray(logs)) return [];
  
  // Group logs by medication
  const groupedLogs: Record<string, any[]> = {};
  
  logs.forEach(log => {
    const medicationId = log.medication_metadata?.medication_id || 'unknown';
    if (!groupedLogs[medicationId]) {
      groupedLogs[medicationId] = [];
    }
    groupedLogs[medicationId].push(log);
  });
  
  // Sort each medication's logs by timestamp (newest first)
  Object.keys(groupedLogs).forEach(medicationId => {
    groupedLogs[medicationId].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });
  
  return groupedLogs;
}

// Get medication status based on frequency, start date, end date
export function getMedicationStatus(
  medication: Medication | null,
  lastDose?: Date | string | null,
  nextDose?: Date | string | null
): MedicationStatusResult {
  if (!medication) {
    return {
      status: MedicationStatusEnum.UNKNOWN
    };
  }

  const now = new Date();

  // If the medication has an end date and it's in the past
  if (medication.end_date && new Date(medication.end_date) < now) {
    return {
      status: MedicationStatusEnum.DISCONTINUED,
      nextDue: null,
      lastDose: lastDose ? new Date(lastDose) : undefined
    };
  }

  // If the medication has a start date in the future
  if (medication.start_date && new Date(medication.start_date) > now) {
    return {
      status: MedicationStatusEnum.SCHEDULED,
      nextDue: new Date(medication.start_date),
      daysUntilNext: differenceInDays(new Date(medication.start_date), now)
    };
  }

  // If the medication is completed
  if (medication.active === false) {
    return {
      status: MedicationStatusEnum.COMPLETED,
      nextDue: null
    };
  }

  // If there's a next dose date and it's in the past, the medication is overdue
  if (nextDose && new Date(nextDose) < now) {
    const daysOverdue = Math.abs(differenceInDays(new Date(nextDose), now));
    return {
      status: MedicationStatusEnum.OVERDUE,
      nextDue: new Date(nextDose),
      daysOverdue
    };
  }

  // If there's a start date but no lastDose, the medication is not started
  if (medication.start_date && !lastDose) {
    return {
      status: MedicationStatusEnum.NOT_STARTED,
      nextDue: new Date(medication.start_date)
    };
  }

  // Otherwise, medication is active
  return {
    status: MedicationStatusEnum.ACTIVE,
    nextDue: nextDose ? new Date(nextDose) : undefined,
    lastDose: lastDose ? new Date(lastDose) : undefined,
    daysUntilNext: nextDose ? differenceInDays(new Date(nextDose), now) : undefined
  };
}

// Calculate the next due date based on current date and frequency
export function calculateNextDoseDue(lastDose: Date | string, frequency: string): Date | null {
  try {
    if (!lastDose || !frequency) return null;

    const lastDoseDate = typeof lastDose === 'string' ? new Date(lastDose) : lastDose;
    const daysSinceLastDose = differenceInDays(new Date(), lastDoseDate);

    // Simple frequency parsing (this could be enhanced for more complex frequencies)
    if (frequency.includes('daily') || frequency.includes('every day')) {
      return new Date(lastDoseDate.setDate(lastDoseDate.getDate() + 1));
    } else if (frequency.includes('twice daily') || frequency.includes('twice a day') || frequency.includes('BID')) {
      return new Date(lastDoseDate.setHours(lastDoseDate.getHours() + 12));
    } else if (frequency.includes('every other day') || frequency.includes('QOD')) {
      return new Date(lastDoseDate.setDate(lastDoseDate.getDate() + 2));
    } else if (frequency.includes('weekly')) {
      return new Date(lastDoseDate.setDate(lastDoseDate.getDate() + 7));
    } else if (frequency.includes('monthly')) {
      return new Date(lastDoseDate.setMonth(lastDoseDate.getMonth() + 1));
    }

    // Default to daily if we can't parse the frequency
    return new Date(lastDoseDate.setDate(lastDoseDate.getDate() + 1));
  } catch (error) {
    console.error('Error calculating next dose date:', error);
    return null;
  }
}

// Get display information for a medication status
export function getStatusLabel(status: MedicationStatusEnum | string): { 
  statusLabel: string; 
  statusColor: string;
} {
  // Default values
  let statusLabel = 'Unknown';
  let statusColor = 'bg-gray-200 text-gray-700';

  // Determine label and color based on status
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      statusLabel = 'Active';
      statusColor = 'bg-green-100 text-green-800';
      break;
    case MedicationStatusEnum.SCHEDULED:
      statusLabel = 'Scheduled';
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case MedicationStatusEnum.OVERDUE:
      statusLabel = 'Overdue';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.COMPLETED:
      statusLabel = 'Completed';
      statusColor = 'bg-green-100 text-green-800';
      break;
    case MedicationStatusEnum.DISCONTINUED:
      statusLabel = 'Discontinued';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.NOT_STARTED:
      statusLabel = 'Not Started';
      statusColor = 'bg-gray-100 text-gray-800';
      break;
    default:
      break;
  }

  return { statusLabel, statusColor };
}
