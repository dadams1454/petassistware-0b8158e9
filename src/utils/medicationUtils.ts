
import { format, isBefore, isAfter, addDays } from 'date-fns';
import { MedicationStatus, MedicationStatusResult } from '@/types/health';
import { MedicationInfo } from '@/components/dogs/components/care/medications/types/medicationTypes';

export enum MedicationFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed'
}

// Function to calculate the next dose date based on medication frequency
export const calculateNextDueDate = (lastAdministered: string | Date, frequency: string): Date => {
  const lastDate = typeof lastAdministered === 'string' 
    ? new Date(lastAdministered) 
    : lastAdministered;
    
  switch (frequency?.toLowerCase()) {
    case MedicationFrequency.DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequency.TWICE_DAILY:
      return addDays(lastDate, 0.5);
    case MedicationFrequency.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequency.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequency.MONTHLY:
      return addDays(lastDate, 30);
    default:
      return addDays(lastDate, 1); // Default to daily
  }
};

// Function to determine medication status
export const getMedicationStatus = (
  lastAdministered: string | Date | undefined, 
  frequency: string | undefined
): MedicationStatusResult => {
  if (!lastAdministered || !frequency) {
    return { status: MedicationStatus.upcoming };
  }

  const now = new Date();
  const lastDate = typeof lastAdministered === 'string' 
    ? new Date(lastAdministered) 
    : lastAdministered;
  
  const nextDueDate = calculateNextDueDate(lastDate, frequency);
  
  if (isBefore(nextDueDate, now)) {
    return { 
      status: MedicationStatus.overdue,
      nextDue: format(nextDueDate, 'yyyy-MM-dd'),
      lastAdministered: format(lastDate, 'yyyy-MM-dd')
    };
  } else if (isAfter(nextDueDate, addDays(now, 2))) {
    return { 
      status: MedicationStatus.active,
      nextDue: format(nextDueDate, 'yyyy-MM-dd'),
      lastAdministered: format(lastDate, 'yyyy-MM-dd')
    };
  } else {
    return { 
      status: MedicationStatus.upcoming,
      nextDue: format(nextDueDate, 'yyyy-MM-dd'),
      lastAdministered: format(lastDate, 'yyyy-MM-dd')
    };
  }
};

// Function to get the display label and color for a medication status
export const getStatusLabel = (status: MedicationStatus | MedicationStatusResult | null) => {
  if (!status) {
    return { 
      statusLabel: 'Unknown', 
      statusColor: 'bg-gray-100 text-gray-800', 
      emoji: '❓' 
    };
  }
  
  let statusValue: MedicationStatus;
  
  if (typeof status === 'object' && status.status) {
    statusValue = status.status;
  } else {
    statusValue = status as MedicationStatus;
  }
  
  switch (statusValue) {
    case MedicationStatus.active:
      return { 
        statusLabel: 'Active', 
        statusColor: 'bg-green-100 text-green-800', 
        emoji: '✅' 
      };
    case MedicationStatus.overdue:
      return { 
        statusLabel: 'Overdue', 
        statusColor: 'bg-red-100 text-red-800', 
        emoji: '⚠️' 
      };
    case MedicationStatus.upcoming:
      return { 
        statusLabel: 'Upcoming', 
        statusColor: 'bg-blue-100 text-blue-800', 
        emoji: '🔔' 
      };
    case MedicationStatus.completed:
      return { 
        statusLabel: 'Completed', 
        statusColor: 'bg-gray-100 text-gray-800', 
        emoji: '✓' 
      };
    default:
      return { 
        statusLabel: 'Unknown', 
        statusColor: 'bg-gray-100 text-gray-800', 
        emoji: '❓' 
      };
  }
};

// Convert an array of medication logs to MedicationInfo objects
export const processMedicationLogs = (logs: any[]): { preventative: MedicationInfo[], other: MedicationInfo[] } => {
  const result: { preventative: MedicationInfo[], other: MedicationInfo[] } = {
    preventative: [],
    other: []
  };
  
  if (!logs || logs.length === 0) {
    return result;
  }
  
  // Group by medication name
  const groupedLogs: Record<string, any[]> = {};
  
  logs.forEach(log => {
    if (!groupedLogs[log.task_name]) {
      groupedLogs[log.task_name] = [];
    }
    groupedLogs[log.task_name].push(log);
  });
  
  // Process each group
  Object.entries(groupedLogs).forEach(([medicationName, medicationLogs]) => {
    // Sort by timestamp for most recent first
    medicationLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const mostRecent = medicationLogs[0];
    const metadata = mostRecent.medication_metadata || {};
    const isPreventative = metadata.is_preventative === true;
    
    // Extract frequency from metadata or default to daily
    const frequency = metadata.frequency || 'daily';
    
    // Calculate status based on last administered and frequency
    const status = getMedicationStatus(mostRecent.timestamp, frequency);
    
    const info: MedicationInfo = {
      id: mostRecent.id,
      name: medicationName,
      dosage: metadata.dosage,
      frequency: metadata.frequency || 'daily',
      lastAdministered: mostRecent.timestamp,
      nextDue: status.nextDue,
      status: status,
      notes: mostRecent.notes,
      isPreventative: isPreventative
    };
    
    // Add to appropriate category
    if (isPreventative) {
      result.preventative.push(info);
    } else {
      result.other.push(info);
    }
  });
  
  return result;
};

// Export MedicationFrequency 
export { MedicationFrequency };
