
import { MedicationStatusEnum } from '@/types/health';

// Get status label and color based on status
export const getStatusLabel = (status: MedicationStatusEnum | string) => {
  let statusLabel = '';
  let statusColor = '';
  
  // Convert string to enum if needed
  let statusEnum = status as MedicationStatusEnum;
  if (typeof status === 'string' && !Object.values(MedicationStatusEnum).includes(status as MedicationStatusEnum)) {
    switch (status.toLowerCase()) {
      case 'active': statusEnum = MedicationStatusEnum.ACTIVE; break;
      case 'overdue': statusEnum = MedicationStatusEnum.OVERDUE; break;
      case 'discontinued': statusEnum = MedicationStatusEnum.DISCONTINUED; break;
      case 'scheduled': statusEnum = MedicationStatusEnum.SCHEDULED; break;
      case 'not_started': statusEnum = MedicationStatusEnum.NOT_STARTED; break;
      case 'completed': statusEnum = MedicationStatusEnum.COMPLETED; break;
      default: statusEnum = MedicationStatusEnum.UNKNOWN;
    }
  }
  
  // Determine label and color based on status
  switch (statusEnum) {
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
      statusColor = 'bg-gray-100 text-gray-800';
      break;
    case MedicationStatusEnum.DISCONTINUED:
      statusLabel = 'Discontinued';
      statusColor = 'bg-amber-100 text-amber-800';
      break;
    case MedicationStatusEnum.NOT_STARTED:
      statusLabel = 'Not Started';
      statusColor = 'bg-slate-100 text-slate-800';
      break;
    default:
      statusLabel = 'Unknown';
      statusColor = 'bg-gray-100 text-gray-800';
      break;
  }
  
  return { statusLabel, statusColor };
};

// Calculate medication status based on dates and frequency
export const getMedicationStatus = (
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined,
  lastAdministered: Date | string | null | undefined,
  frequency: string | null | undefined,
  discontinued: boolean = false
) => {
  if (discontinued) {
    return {
      status: MedicationStatusEnum.DISCONTINUED,
      daysUntilDue: null,
      daysOverdue: null,
      nextDue: null
    };
  }
  
  const today = new Date();
  
  // Convert dates if they're strings
  const start = startDate ? (typeof startDate === 'string' ? new Date(startDate) : startDate) : null;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;
  const lastDate = lastAdministered ? (typeof lastAdministered === 'string' ? new Date(lastAdministered) : lastAdministered) : null;
  
  // Handle not started yet
  if (start && start > today) {
    return {
      status: MedicationStatusEnum.SCHEDULED,
      daysUntilDue: Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      daysOverdue: null,
      nextDue: start
    };
  }
  
  // Handle completed medications
  if (end && end < today) {
    return {
      status: MedicationStatusEnum.COMPLETED,
      daysUntilDue: null, 
      daysOverdue: null,
      nextDue: null
    };
  }
  
  // If no last administered date, it's not started
  if (!lastDate) {
    return {
      status: MedicationStatusEnum.NOT_STARTED,
      daysUntilDue: null,
      daysOverdue: null,
      nextDue: null
    };
  }
  
  // Calculate next due date based on frequency
  let daysToAdd = 0;
  switch (frequency?.toLowerCase()) {
    case 'daily':
    case 'once daily':
      daysToAdd = 1;
      break;
    case 'twice daily':
    case 'three times daily':
      daysToAdd = 0.5; // Not precisely handling multiple times per day
      break;
    case 'every other day':
      daysToAdd = 2;
      break;
    case 'weekly':
      daysToAdd = 7;
      break;
    case 'biweekly':
      daysToAdd = 14;
      break;
    case 'monthly':
      daysToAdd = 30;
      break;
    case 'quarterly':
      daysToAdd = 90;
      break;
    case 'annually':
      daysToAdd = 365;
      break;
    case 'as needed':
    case 'once':
      return {
        status: MedicationStatusEnum.ACTIVE,
        daysUntilDue: null,
        daysOverdue: null,
        nextDue: null
      };
    default:
      daysToAdd = 1; // Default to daily if frequency not recognized
  }
  
  const nextDueDate = new Date(lastDate);
  nextDueDate.setDate(lastDate.getDate() + daysToAdd);
  
  // Calculate days until due or overdue
  const diffTime = nextDueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      status: MedicationStatusEnum.OVERDUE,
      daysUntilDue: null,
      daysOverdue: Math.abs(diffDays),
      nextDue: nextDueDate
    };
  } else {
    return {
      status: MedicationStatusEnum.ACTIVE,
      daysUntilDue: diffDays,
      daysOverdue: null,
      nextDue: nextDueDate
    };
  }
};

// Define medication frequency constants
export const MEDICATION_FREQUENCY = {
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
  AS_NEEDED: 'as needed',
  ONCE: 'once'
};

// Export the same constants under the name MedicationFrequencyConstants for backward compatibility
export const MedicationFrequencyConstants = MEDICATION_FREQUENCY;

// Process medication logs for dogs
export const processMedicationLogs = (logs: any[]) => {
  // Group medications by type (preventative or other)
  const preventative: any[] = [];
  const other: any[] = [];
  
  logs.forEach(log => {
    const medicationInfo = {
      id: log.id,
      name: log.medication_name || log.task_name || 'Unnamed Medication',
      dosage: log.dosage,
      dosage_unit: log.dosage_unit,
      frequency: log.frequency || 'daily',
      lastAdministered: log.timestamp || log.created_at,
      nextDue: log.next_due_date,
      status: log.status || 'active',
      notes: log.notes,
      isPreventative: log.is_preventative || false,
      startDate: log.start_date
    };
    
    if (medicationInfo.isPreventative) {
      preventative.push(medicationInfo);
    } else {
      other.push(medicationInfo);
    }
  });
  
  return {
    preventative,
    other
  };
};
