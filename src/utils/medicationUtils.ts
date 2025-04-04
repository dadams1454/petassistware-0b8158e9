import { MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { addDays, isAfter, isBefore, parseISO } from 'date-fns';

// Constants for frequency
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  ONCE_DAILY: 'once daily',
  TWICE_DAILY: 'twice daily',
  THREE_TIMES_DAILY: 'three times daily',
  EVERY_OTHER_DAY: 'every other day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as needed',
  ONCE: 'once'
};

// Get next due date based on frequency and last administered date
export const getNextDueDate = (frequency: string, lastAdministered: string | Date): Date => {
  const lastDate = typeof lastAdministered === 'string' 
    ? parseISO(lastAdministered) 
    : lastAdministered;
  
  switch (frequency.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
    case MedicationFrequencyConstants.ONCE_DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequencyConstants.TWICE_DAILY:
      return addDays(lastDate, 0.5);
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return addDays(lastDate, 1/3);
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return addDays(lastDate, 2);
    case MedicationFrequencyConstants.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequencyConstants.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequencyConstants.MONTHLY:
      return addDays(lastDate, 30);
    case MedicationFrequencyConstants.AS_NEEDED:
    case MedicationFrequencyConstants.ONCE:
      return new Date(8640000000000000); // Far future date
    default:
      return addDays(lastDate, 1); // Default to daily
  }
};

// Calculate medication status based on its properties
export const getMedicationStatus = (
  startDate: string | undefined,
  endDate: string | undefined,
  lastAdministered: string | undefined,
  frequency: string,
  active: boolean
): MedicationStatusResult => {
  const today = new Date();
  
  // Check if medication is discontinued or completed
  if (!active) {
    return {
      status: MedicationStatusEnum.DISCONTINUED
    };
  }
  
  // Check if medication has ended
  if (endDate && isBefore(parseISO(endDate), today)) {
    return {
      status: MedicationStatusEnum.COMPLETED
    };
  }
  
  // Check if medication hasn't started yet
  if (startDate && isAfter(parseISO(startDate), today)) {
    return {
      status: MedicationStatusEnum.SCHEDULED,
      nextDue: parseISO(startDate),
      daysUntilDue: Math.ceil((parseISO(startDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    };
  }
  
  // If it's a one-time medication that has been administered
  if ((frequency === MedicationFrequencyConstants.ONCE) && lastAdministered) {
    return {
      status: MedicationStatusEnum.COMPLETED
    };
  }
  
  // If it hasn't been administered yet
  if (!lastAdministered) {
    return {
      status: MedicationStatusEnum.NOT_STARTED
    };
  }
  
  // Calculate next due date based on frequency and last administered date
  const nextDue = getNextDueDate(frequency, lastAdministered);
  
  // Check if medication is overdue
  if (isBefore(nextDue, today)) {
    const daysOverdue = Math.ceil((today.getTime() - nextDue.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: MedicationStatusEnum.OVERDUE,
      nextDue,
      daysOverdue
    };
  }
  
  // Medication is active and on schedule
  const daysUntilDue = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return {
    status: MedicationStatusEnum.ACTIVE,
    nextDue,
    daysUntilDue
  };
};

// Get UI-friendly status label and color
export const getStatusLabel = (status: MedicationStatusEnum): { statusLabel: string; statusColor: string } => {
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      return { statusLabel: 'Active', statusColor: 'bg-green-100 text-green-800' };
    case MedicationStatusEnum.SCHEDULED:
      return { statusLabel: 'Scheduled', statusColor: 'bg-blue-100 text-blue-800' };
    case MedicationStatusEnum.OVERDUE:
      return { statusLabel: 'Overdue', statusColor: 'bg-red-100 text-red-800' };
    case MedicationStatusEnum.COMPLETED:
      return { statusLabel: 'Completed', statusColor: 'bg-gray-100 text-gray-800' };
    case MedicationStatusEnum.DISCONTINUED:
      return { statusLabel: 'Discontinued', statusColor: 'bg-yellow-100 text-yellow-800' };
    case MedicationStatusEnum.NOT_STARTED:
      return { statusLabel: 'Not Started', statusColor: 'bg-purple-100 text-purple-800' };
    case MedicationStatusEnum.UNKNOWN:
    default:
      return { statusLabel: 'Unknown', statusColor: 'bg-gray-100 text-gray-800' };
  }
};

// Process medication logs for display
export const processMedicationLogs = (medications: any[], dogId?: string) => {
  // Group medications by type (preventative vs other)
  const preventative: any[] = [];
  const other: any[] = [];
  
  medications.forEach(med => {
    if (med.is_preventative) {
      preventative.push(med);
    } else {
      other.push(med);
    }
  });
  
  // If we have a specific dog ID, filter to only that dog's medications
  if (dogId) {
    return {
      [dogId]: {
        preventative,
        other,
        all: medications
      }
    };
  }
  
  // Otherwise, group by dog ID
  const groupedByDog: Record<string, { preventative: any[], other: any[], all: any[] }> = {};
  
  medications.forEach(med => {
    const id = med.dog_id;
    
    if (!groupedByDog[id]) {
      groupedByDog[id] = {
        preventative: [],
        other: [],
        all: []
      };
    }
    
    groupedByDog[id].all.push(med);
    
    if (med.is_preventative) {
      groupedByDog[id].preventative.push(med);
    } else {
      groupedByDog[id].other.push(med);
    }
  });
  
  return groupedByDog;
};
