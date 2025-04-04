import { format, parse, parseISO, addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import { MedicationStatus, MedicationStatusEnum, MedicationStatusResult } from '@/types/health';

// Frequency to days mapping
type FrequencyMapping = {
  [key: string]: number;
};

const frequencyToDays: FrequencyMapping = {
  'daily': 1,
  'twice_daily': 0.5,
  'every_other_day': 2,
  'weekly': 7,
  'biweekly': 14,
  'monthly': 30,
  'as_needed': 0,
  'once': 0,
};

// Get the next administration date based on frequency and last administration
export const getNextAdministrationDate = (
  lastAdministered: string | Date | null,
  frequency: string
): Date | null => {
  if (!lastAdministered || !frequency) return null;
  
  // Convert to Date if string
  const lastDate = typeof lastAdministered === 'string' ? 
    parseISO(lastAdministered) : lastAdministered;
  
  // Handle different frequency formats
  const days = getFrequencyDays(frequency);
  
  // If no regular schedule (as_needed, once)
  if (days === 0) return null;
  
  // Calculate next due date
  return addDays(lastDate, days);
};

// Calculate days from frequency string
export const getFrequencyDays = (frequency: string): number => {
  // Standard frequencies
  if (frequency.toLowerCase() in frequencyToDays) {
    return frequencyToDays[frequency.toLowerCase()];
  }
  
  // Parse complex frequencies like "every X days"
  if (frequency.toLowerCase().includes('every')) {
    const match = frequency.match(/every\s+(\d+)\s+(day|days|week|weeks|month|months)/i);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      
      if (unit === 'day' || unit === 'days') {
        return value;
      } else if (unit === 'week' || unit === 'weeks') {
        return value * 7;
      } else if (unit === 'month' || unit === 'months') {
        return value * 30; // Approximate
      }
    }
  }
  
  // Default to daily if we can't parse
  return 1;
};

// Get medication status
export const getMedicationStatus = (
  frequency: string,
  lastAdministered: string | Date | null,
  endDate?: string | Date | null
): MedicationStatusResult => {
  const today = new Date();
  
  // If medication has an end date and it's in the past
  if (endDate) {
    const endDateTime = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    if (isBefore(endDateTime, today)) {
      return { 
        status: MedicationStatusEnum.Completed,
        statusLabel: 'Completed',
        statusColor: 'bg-green-100 text-green-800'
      };
    }
  }
  
  // If never administered
  if (!lastAdministered) {
    return { 
      status: MedicationStatusEnum.Unknown,
      statusLabel: 'Not Started',
      statusColor: 'bg-gray-100 text-gray-800'
    };
  }
  
  // Calculate next due date
  const nextDue = getNextAdministrationDate(lastAdministered, frequency);
  
  // If no regular schedule (as_needed, once)
  if (!nextDue) {
    return { 
      status: MedicationStatusEnum.Unknown,
      statusLabel: 'As Needed',
      statusColor: 'bg-gray-100 text-gray-800',
      nextDue: null
    };
  }
  
  // Check if overdue
  if (isBefore(nextDue, today)) {
    const daysOverdue = differenceInDays(today, nextDue);
    
    return { 
      status: 'Overdue' as MedicationStatusEnum,
      statusLabel: `Overdue (${daysOverdue}d)`,
      statusColor: 'bg-red-100 text-red-800',
      nextDue
    };
  }
  
  // Check if due today
  if (differenceInDays(nextDue, today) === 0) {
    return {
      status: MedicationStatusEnum.Active,
      statusLabel: 'Due Today',
      statusColor: 'bg-green-100 text-green-800',
      nextDue
    };
  }
  
  // Check if due soon (within 24 hours)
  if (differenceInDays(nextDue, today) <= 1) {
    return {
      status: MedicationStatusEnum.Active,
      statusLabel: 'Due Soon',
      statusColor: 'bg-blue-100 text-blue-800',
      nextDue
    };
  }
  
  // Otherwise, it's upcoming
  return {
    status: 'Upcoming' as MedicationStatusEnum,
    statusLabel: 'Upcoming',
    statusColor: 'bg-blue-100 text-blue-800',
    nextDue
  };
};

// Parse and format frequency strings for display
export const formatFrequency = (frequency: string): string => {
  if (!frequency) return 'Unknown';
  
  switch (frequency.toLowerCase()) {
    case 'daily':
      return 'Once daily';
    case 'twice_daily':
      return 'Twice daily';
    case 'every_other_day':
      return 'Every other day';
    case 'weekly':
      return 'Once a week';
    case 'biweekly':
      return 'Every two weeks';
    case 'monthly':
      return 'Once a month';
    case 'as_needed':
      return 'As needed (PRN)';
    case 'once':
      return 'Once only';
    default:
      return frequency;
  }
};

export const getStatusLabel = (status: MedicationStatusEnum): { statusLabel: string, statusColor: string } => {
  switch (status) {
    case MedicationStatusEnum.Active:
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800'
      };
    case MedicationStatusEnum.Overdue:
    case 'Overdue' as MedicationStatusEnum:
      return {
        statusLabel: 'Overdue',
        statusColor: 'bg-red-100 text-red-800'
      };
    case MedicationStatusEnum.Upcoming:
    case 'Upcoming' as MedicationStatusEnum:
      return {
        statusLabel: 'Upcoming',
        statusColor: 'bg-blue-100 text-blue-800'
      };
    case MedicationStatusEnum.Completed:
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-green-100 text-green-800'
      };
    case MedicationStatusEnum.Unknown:
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-800'
      };
  }
};

// Extract status values for components
export const getMedicationStatusValue = (status: MedicationStatus | MedicationStatusResult | string | null): string => {
  if (!status) return MedicationStatusEnum.Unknown;
  
  if (typeof status === 'object' && status !== null && 'status' in status) {
    return (status as MedicationStatusResult).status;
  }
  
  return status as MedicationStatus;
};

// Get status class for UI
export const getStatusClass = (status: MedicationStatus | MedicationStatusResult | string | null): string => {
  const statusValue = getMedicationStatusValue(status);
  
  switch (statusValue) {
    case MedicationStatusEnum.Active:
      return 'bg-green-100 text-green-800';
    case 'Overdue':
    case MedicationStatusEnum.Overdue:
      return 'bg-red-100 text-red-800';
    case 'Upcoming':
    case MedicationStatusEnum.Upcoming:
      return 'bg-blue-100 text-blue-800';
    case MedicationStatusEnum.Completed:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
