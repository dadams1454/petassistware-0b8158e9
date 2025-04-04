import { MedicationStatusEnum } from '@/types/health';

/**
 * Medication frequency constants
 */
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice-daily',
  THREE_TIMES_DAILY: 'three-times-daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as-needed'
};

/**
 * Get label and style for medication status
 */
export const getStatusLabel = (status: MedicationStatusEnum | string) => {
  switch (status) {
    case MedicationStatusEnum.Active:
    case 'active':
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800',
        icon: 'check-circle'
      };
    case MedicationStatusEnum.Completed:
    case 'completed':
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-blue-100 text-blue-800',
        icon: 'check-circle'
      };
    case MedicationStatusEnum.Discontinued:
    case 'discontinued':
    case 'overdue':
      return {
        statusLabel: 'Discontinued',
        statusColor: 'bg-red-100 text-red-800',
        icon: 'x-circle'
      };
    case MedicationStatusEnum.NotStarted:
    case 'not_started':
      return {
        statusLabel: 'Not Started',
        statusColor: 'bg-gray-100 text-gray-800',
        icon: 'clock'
      };
    case MedicationStatusEnum.Scheduled:
    case 'scheduled':
    case 'upcoming':
      return {
        statusLabel: 'Scheduled',
        statusColor: 'bg-purple-100 text-purple-800',
        icon: 'calendar'
      };
    case MedicationStatusEnum.UpcomingDue:
    case 'upcoming_due':
      return {
        statusLabel: 'Due Soon',
        statusColor: 'bg-yellow-100 text-yellow-800',
        icon: 'alert-circle'
      };
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-800',
        icon: 'help-circle'
      };
  }
};

/**
 * Calculate medication status based on dates
 */
export const calculateMedicationStatus = (
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  lastAdministered?: string | Date | null
) => {
  if (!startDate) {
    return MedicationStatusEnum.NotStarted;
  }

  const now = new Date();
  const start = new Date(startDate);
  
  // If medication hasn't started yet
  if (start > now) {
    return MedicationStatusEnum.Scheduled;
  }
  
  // If medication has ended
  if (endDate && new Date(endDate) < now) {
    return MedicationStatusEnum.Completed;
  }
  
  // Medication is active
  return MedicationStatusEnum.Active;
};

/**
 * Process medication logs into categorized structure
 */
export const processMedicationLogs = (logs: any[]) => {
  const processedLogs = {
    preventative: [],
    other: []
  };
  
  if (!logs || logs.length === 0) {
    return processedLogs;
  }
  
  // Group logs by medication name
  const logsByMedication: Record<string, any[]> = {};
  
  logs.forEach(log => {
    const medicationName = log.task_name || 'Unknown';
    if (!logsByMedication[medicationName]) {
      logsByMedication[medicationName] = [];
    }
    logsByMedication[medicationName].push(log);
  });
  
  // Process each medication group
  Object.keys(logsByMedication).forEach(name => {
    const medicationLogs = logsByMedication[name];
    const latestLog = medicationLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    
    const isPreventative = name.toLowerCase().includes('preventative') || 
                          name.toLowerCase().includes('preventive');
    
    const medicationInfo = {
      id: latestLog.id,
      name: name,
      dosage: latestLog.dosage,
      frequency: latestLog.frequency || 'daily',
      lastAdministered: latestLog.timestamp,
      nextDue: latestLog.next_due_date,
      status: latestLog.status,
      notes: latestLog.notes,
      isPreventative: isPreventative,
      startDate: latestLog.start_date
    };
    
    if (isPreventative) {
      processedLogs.preventative.push(medicationInfo);
    } else {
      processedLogs.other.push(medicationInfo);
    }
  });
  
  return processedLogs;
};
