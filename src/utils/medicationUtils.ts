
import { format, parseISO, isAfter, subDays, isBefore, addDays } from 'date-fns';
import { parseFrequency } from './dateUtils';
import { MedicationStatusEnum, MedicationStatus } from '@/types/health';
import { StatusColor } from '@/types/ui';
import { MedicationStatusResult } from '@/types/health';

export interface StatusInfo {
  statusLabel: string;
  statusColor: string;
  emoji: string;
}

// Constants for medication frequencies
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

// Helper function to get the appropriate label and color for a medication status
export function getStatusLabel(status: MedicationStatusEnum | string): { statusLabel: string; statusColor: string } {
  let statusLabel = '';
  let statusColor = '';
  
  switch (String(status)) {
    case MedicationStatusEnum.Active:
    case 'active':
      statusLabel = 'Active';
      statusColor = 'bg-green-100 text-green-800';
      break;
    case MedicationStatusEnum.Completed:
    case 'completed':
      statusLabel = 'Completed';
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case MedicationStatusEnum.Discontinued:
    case 'discontinued':
    case 'overdue':
      statusLabel = status === 'overdue' ? 'Overdue' : 'Discontinued';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.OnHold:
    case 'on-hold':
      statusLabel = 'On Hold';
      statusColor = 'bg-yellow-100 text-yellow-800';
      break;
    case MedicationStatusEnum.Scheduled:
    case 'scheduled':
    case 'upcoming':
      statusLabel = status === 'upcoming' ? 'Upcoming' : 'Scheduled';
      statusColor = 'bg-indigo-100 text-indigo-800';
      break;
    case MedicationStatusEnum.NotStarted:
    case 'not_started':
      statusLabel = 'Not Started';
      statusColor = 'bg-gray-100 text-gray-800';
      break;
    default:
      statusLabel = 'Unknown';
      statusColor = 'bg-gray-100 text-gray-800';
      break;
  }
  
  return { statusLabel, statusColor };
}

// Function to determine medication status based on administration history
export function determineMedicationStatus(
  medication: {
    start_date: string;
    end_date?: string;
    frequency: string;
    is_active?: boolean;
  },
  lastAdministered?: string | null,
  now: Date = new Date()
): MedicationStatusResult {
  // Parse dates for comparison
  const startDate = parseISO(medication.start_date);
  const endDate = medication.end_date ? parseISO(medication.end_date) : null;
  
  // If medication has ended
  if (endDate && isBefore(endDate, now)) {
    return { status: MedicationStatusEnum.Completed };
  }
  
  // If medication hasn't started yet
  if (isAfter(startDate, now)) {
    return { 
      status: MedicationStatusEnum.Scheduled,
      nextDue: medication.start_date 
    };
  }
  
  // Not active flag is set
  if (medication.is_active === false) {
    return { status: MedicationStatusEnum.Discontinued };
  }
  
  // Parse frequency to determine next due date
  let nextDue: Date | null = null;
  
  // Hasn't been administered yet
  if (!lastAdministered) {
    // If it should have started already, it's overdue
    if (isBefore(startDate, now)) {
      return { 
        status: MedicationStatusEnum.Discontinued, // Using Discontinued as a proxy for Overdue
        nextDue: format(startDate, 'yyyy-MM-dd') 
      };
    } else {
      return { 
        status: MedicationStatusEnum.Scheduled,
        nextDue: format(startDate, 'yyyy-MM-dd')  
      };
    }
  }
  
  // If it has been administered, determine the next due date
  const lastAdminDate = parseISO(lastAdministered);
  const { interval, unit } = parseFrequency(medication.frequency);
  
  if (interval && unit) {
    switch (unit) {
      case 'hour':
        nextDue = new Date(lastAdminDate);
        nextDue.setHours(nextDue.getHours() + interval);
        break;
      case 'day':
        nextDue = addDays(lastAdminDate, interval);
        break;
      case 'week':
        nextDue = addDays(lastAdminDate, interval * 7);
        break;
      case 'month':
        nextDue = new Date(lastAdminDate);
        nextDue.setMonth(nextDue.getMonth() + interval);
        break;
      default:
        // If we can't parse the frequency, we'll consider it active
        return { 
          status: MedicationStatusEnum.Active,
          lastAdministered 
        };
    }
  }
  
  // Determine status based on next due date
  if (nextDue) {
    const formattedNextDue = format(nextDue, 'yyyy-MM-dd');
    
    // Overdue (more than 1 day past due)
    if (isBefore(nextDue, subDays(now, 1))) {
      return { 
        status: MedicationStatusEnum.Discontinued, // Using Discontinued as a proxy for Overdue
        nextDue: formattedNextDue,
        lastAdministered
      };
    }
    
    // Due today
    if (isBefore(nextDue, addDays(now, 1))) {
      return { 
        status: MedicationStatusEnum.Active,
        nextDue: formattedNextDue,
        lastAdministered
      };
    }
    
    // Upcoming
    return { 
      status: MedicationStatusEnum.Scheduled, // Using Scheduled as a proxy for Upcoming
      nextDue: formattedNextDue,
      lastAdministered
    };
  }
  
  // Default to active if we can't determine the status
  return { 
    status: MedicationStatusEnum.Active,
    lastAdministered 
  };
}

// Function to get status with appropriate emoji for display
export function getMedicationStatusInfo(status: MedicationStatusEnum | string): StatusInfo {
  const { statusLabel, statusColor } = getStatusLabel(status);
  let emoji = '💊';
  
  switch (String(status)) {
    case MedicationStatusEnum.Active:
    case 'active':
      emoji = '✅';
      break;
    case MedicationStatusEnum.Completed:
    case 'completed':
      emoji = '🏁';
      break;
    case MedicationStatusEnum.Discontinued:
    case 'discontinued':
    case 'overdue':
      emoji = '⚠️';
      break;
    case MedicationStatusEnum.OnHold:
    case 'on-hold':
      emoji = '⏸️';
      break;
    case MedicationStatusEnum.Scheduled:
    case 'scheduled':
    case 'upcoming':
      emoji = '📅';
      break;
    case MedicationStatusEnum.NotStarted:
    case 'not_started':
      emoji = '⏱️';
      break;
    default:
      emoji = '❓';
      break;
  }
  
  return { statusLabel, statusColor, emoji };
}

// Function to process medication logs and organize them by type
export function processMedicationLogs(logs: any[]) {
  const preventativeMeds: any[] = [];
  const otherMeds: any[] = [];

  if (!logs || !Array.isArray(logs)) {
    return { preventative: preventativeMeds, other: otherMeds };
  }

  logs.forEach(log => {
    const medication = {
      id: log.id,
      name: log.medication_name || 'Unknown Medication',
      dosage: log.dosage ? `${log.dosage} ${log.dosage_unit || ''}` : '',
      frequency: log.frequency || 'As needed',
      lastAdministered: log.administered_at || log.timestamp || log.created_at,
      nextDue: log.next_due || '',
      status: log.status || 'active',
      isPreventative: log.is_preventative === true,
      notes: log.notes || '',
      startDate: log.start_date || ''
    };

    if (medication.isPreventative) {
      preventativeMeds.push(medication);
    } else {
      otherMeds.push(medication);
    }
  });

  return {
    preventative: preventativeMeds,
    other: otherMeds
  };
}
