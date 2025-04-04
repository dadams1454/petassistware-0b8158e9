
import { format, parseISO, isAfter, differenceInDays } from 'date-fns';
import { MedicationStatus, MedicationStatusResult } from '@/types/health';

export enum MedicationFrequency {
  ONCE_DAILY = 'once daily',
  TWICE_DAILY = 'twice daily',
  THREE_TIMES_DAILY = 'three times daily',
  EVERY_OTHER_DAY = 'every other day',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as needed'
}

/**
 * Calculates the status of a medication based on its start and end dates, frequency, and last administered time
 */
export function getMedicationStatus(startDate: string, endDate?: string, frequency?: string, lastAdministered?: string): MedicationStatus {
  const today = new Date();
  const startDateObj = parseISO(startDate);
  const endDateObj = endDate ? parseISO(endDate) : null;
  const lastAdministeredObj = lastAdministered ? parseISO(lastAdministered) : null;
  
  // Check if the medication hasn't started yet
  if (isAfter(startDateObj, today)) {
    return {
      status: 'upcoming',
      nextDue: startDateObj,
      statusColor: 'bg-blue-100 text-blue-800',
      statusLabel: 'Upcoming'
    };
  }
  
  // Check if the medication has ended
  if (endDateObj && !isAfter(today, endDateObj)) {
    return {
      status: 'completed',
      statusColor: 'bg-gray-100 text-gray-800',
      statusLabel: 'Completed'
    };
  }
  
  // Calculate next due date based on frequency
  let nextDue: Date | null = null;
  let daysOverdue = 0;
  
  if (lastAdministeredObj && frequency) {
    const lastDate = lastAdministeredObj;
    
    switch (frequency.toLowerCase()) {
      case MedicationFrequency.ONCE_DAILY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case MedicationFrequency.TWICE_DAILY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setHours(nextDue.getHours() + 12);
        break;
      case MedicationFrequency.THREE_TIMES_DAILY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setHours(nextDue.getHours() + 8);
        break;
      case MedicationFrequency.EVERY_OTHER_DAY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setDate(nextDue.getDate() + 2);
        break;
      case MedicationFrequency.WEEKLY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case MedicationFrequency.BIWEEKLY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setDate(nextDue.getDate() + 14);
        break;
      case MedicationFrequency.MONTHLY.toLowerCase():
        nextDue = new Date(lastDate);
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      default:
        // For "as needed" or unknown frequencies, no next due date
        nextDue = null;
    }
    
    if (nextDue && isAfter(today, nextDue)) {
      daysOverdue = differenceInDays(today, nextDue);
    }
  }
  
  // Determine the status
  if (daysOverdue > 0) {
    return {
      status: 'overdue',
      nextDue,
      lastTaken: lastAdministeredObj,
      daysOverdue,
      statusColor: 'bg-red-100 text-red-800',
      statusLabel: 'Overdue'
    };
  }
  
  return {
    status: 'active',
    nextDue,
    lastTaken: lastAdministeredObj,
    statusColor: 'bg-green-100 text-green-800',
    statusLabel: 'Active'
  };
}

/**
 * Formats the medication frequency for display
 */
export function formatMedicationFrequency(frequency: string): string {
  switch (frequency.toLowerCase()) {
    case MedicationFrequency.ONCE_DAILY.toLowerCase():
      return 'Once a day';
    case MedicationFrequency.TWICE_DAILY.toLowerCase():
      return 'Twice a day';
    case MedicationFrequency.THREE_TIMES_DAILY.toLowerCase():
      return 'Three times a day';
    case MedicationFrequency.EVERY_OTHER_DAY.toLowerCase():
      return 'Every other day';
    case MedicationFrequency.WEEKLY.toLowerCase():
      return 'Once a week';
    case MedicationFrequency.BIWEEKLY.toLowerCase():
      return 'Once every two weeks';
    case MedicationFrequency.MONTHLY.toLowerCase():
      return 'Once a month';
    case MedicationFrequency.AS_NEEDED.toLowerCase():
      return 'As needed';
    default:
      return frequency;
  }
}

/**
 * Provides a label to display based on status
 */
export function getStatusLabel(status: MedicationStatusResult | MedicationStatus): { statusLabel: string; statusColor: string; emoji: string } {
  if (typeof status === 'object' && status !== null) {
    return {
      statusLabel: status.statusLabel || 'Unknown',
      statusColor: status.statusColor || 'bg-gray-100 text-gray-800',
      emoji: getStatusEmoji(status.status)
    };
  }
  
  switch (status) {
    case 'active':
      return { 
        statusLabel: 'Active', 
        statusColor: 'bg-green-100 text-green-800',
        emoji: '✅'
      };
    case 'completed':
      return { 
        statusLabel: 'Completed', 
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '✓'
      };
    case 'upcoming':
      return { 
        statusLabel: 'Upcoming', 
        statusColor: 'bg-blue-100 text-blue-800',
        emoji: '🔜'
      };
    case 'overdue':
      return { 
        statusLabel: 'Overdue', 
        statusColor: 'bg-red-100 text-red-800',
        emoji: '⚠️'
      };
    case 'expired':
      return { 
        statusLabel: 'Expired', 
        statusColor: 'bg-red-100 text-red-800',
        emoji: '⏱️'
      };
    case 'discontinued':
      return { 
        statusLabel: 'Discontinued', 
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '🚫'
      };
    case 'paused':
      return { 
        statusLabel: 'Paused', 
        statusColor: 'bg-yellow-100 text-yellow-800',
        emoji: '⏸️'
      };
    default:
      return { 
        statusLabel: 'Unknown', 
        statusColor: 'bg-gray-100 text-gray-800',
        emoji: '❓'
      };
  }
}

/**
 * Returns an emoji based on status
 */
function getStatusEmoji(status: MedicationStatusResult): string {
  switch (status) {
    case 'active':
      return '✅';
    case 'completed':
      return '✓';
    case 'upcoming':
      return '🔜';
    case 'overdue':
      return '⚠️';
    case 'expired':
      return '⏱️';
    case 'discontinued':
      return '🚫';
    case 'paused':
      return '⏸️';
    default:
      return '❓';
  }
}
