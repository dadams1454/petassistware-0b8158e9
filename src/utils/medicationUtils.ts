
import { Medication, MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { addDays, isBefore, isAfter, parseISO, differenceInDays } from 'date-fns';

// Define frequency constants
export const MedicationFrequencyConstants = {
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as_needed',
  DAILY: 'daily',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually'
};

// Get days until next dose based on frequency
export const getDaysUntilNextDose = (frequency: string, lastAdministered?: string | Date): number => {
  if (!lastAdministered) return 0;
  
  const lastDate = typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered;
  const today = new Date();
  
  switch (frequency) {
    case MedicationFrequencyConstants.ONCE_DAILY:
    case MedicationFrequencyConstants.DAILY:
      return 1 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 0.5 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return 0.33 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      return 0.25 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return 2 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.WEEKLY:
      return 7 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.BIWEEKLY:
      return 14 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.MONTHLY:
      return 30 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.QUARTERLY:
      return 90 - differenceInDays(today, lastDate);
    case MedicationFrequencyConstants.ANNUALLY:
      return 365 - differenceInDays(today, lastDate);
    default:
      return 0; // As needed or unknown frequency
  }
};

// Calculate next due date based on frequency and last administered date
export const getNextDueDate = (frequency: string, lastAdministered?: string | Date): Date | null => {
  if (!lastAdministered) return null;
  
  const lastDate = typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered;
  
  switch (frequency) {
    case MedicationFrequencyConstants.ONCE_DAILY:
    case MedicationFrequencyConstants.DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequencyConstants.TWICE_DAILY:
      return addDays(lastDate, 0.5);
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return addDays(lastDate, 0.33);
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      return addDays(lastDate, 0.25);
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return addDays(lastDate, 2);
    case MedicationFrequencyConstants.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequencyConstants.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequencyConstants.MONTHLY:
      return addDays(lastDate, 30);
    case MedicationFrequencyConstants.QUARTERLY:
      return addDays(lastDate, 90);
    case MedicationFrequencyConstants.ANNUALLY:
      return addDays(lastDate, 365);
    default:
      return null; // As needed or unknown frequency
  }
};

// Determine medication status
export const getMedicationStatus = (medication: Medication): MedicationStatusResult => {
  const today = new Date();
  const startDate = medication.start_date ? parseISO(medication.start_date) : null;
  const endDate = medication.end_date ? parseISO(medication.end_date) : null;
  const lastAdministered = medication.last_administered ? parseISO(medication.last_administered) : null;
  
  // If the medication is inactive
  if (!medication.active) {
    return { status: MedicationStatusEnum.Discontinued };
  }
  
  // If the medication has an end date that's in the past
  if (endDate && isBefore(endDate, today)) {
    return { status: MedicationStatusEnum.Completed };
  }
  
  // If the medication has a start date that's in the future
  if (startDate && isAfter(startDate, today)) {
    return { 
      status: MedicationStatusEnum.Scheduled,
      nextDue: startDate
    };
  }
  
  // If it's active but hasn't been administered yet
  if (!lastAdministered) {
    return { 
      status: MedicationStatusEnum.Active,
      nextDue: startDate || today,
      isOverdue: startDate ? isBefore(startDate, today) : false
    };
  }
  
  // If it's active and has been administered
  const daysUntilNextDose = getDaysUntilNextDose(medication.frequency, lastAdministered);
  const nextDueDate = getNextDueDate(medication.frequency, lastAdministered);
  
  return {
    status: MedicationStatusEnum.Active,
    nextDue: nextDueDate,
    daysUntilNextDose,
    isOverdue: daysUntilNextDose < 0
  };
};

// Get status label with color for display
export const getStatusLabel = (status: MedicationStatusEnum) => {
  switch (status) {
    case MedicationStatusEnum.Active:
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-100 text-green-800'
      };
    case MedicationStatusEnum.Completed:
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-blue-100 text-blue-800'
      };
    case MedicationStatusEnum.Discontinued:
      return {
        statusLabel: 'Discontinued',
        statusColor: 'bg-red-100 text-red-800'
      };
    case MedicationStatusEnum.NotStarted:
      return {
        statusLabel: 'Not Started',
        statusColor: 'bg-gray-100 text-gray-800'
      };
    case MedicationStatusEnum.Scheduled:
      return {
        statusLabel: 'Scheduled',
        statusColor: 'bg-purple-100 text-purple-800'
      };
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-100 text-gray-800'
      };
  }
};

// Process medication logs from daily care data
export const processMedicationLogs = (logs: any[] = []): Record<string, any> => {
  const processedLogs: Record<string, any> = {};
  
  logs.forEach(log => {
    if (!log.medication_metadata) return;
    
    const medicationId = log.medication_metadata.medication_id;
    if (!medicationId) return;
    
    if (!processedLogs[medicationId]) {
      processedLogs[medicationId] = {
        administrations: [],
        lastAdministered: null
      };
    }
    
    processedLogs[medicationId].administrations.push({
      id: log.id,
      timestamp: log.timestamp,
      notes: log.notes,
      metadata: log.medication_metadata
    });
    
    // Update last administered date if this is more recent
    if (!processedLogs[medicationId].lastAdministered || 
        new Date(log.timestamp) > new Date(processedLogs[medicationId].lastAdministered)) {
      processedLogs[medicationId].lastAdministered = log.timestamp;
    }
  });
  
  return processedLogs;
};

// Get list of upcoming medications
export const getUpcomingMedications = (medications: Medication[], days: number = 7): Medication[] => {
  const today = new Date();
  const futureDate = addDays(today, days);
  
  return medications.filter(med => {
    const status = getMedicationStatus(med);
    if (status.nextDue && status.status === MedicationStatusEnum.Active) {
      const nextDueDate = typeof status.nextDue === 'string' ? parseISO(status.nextDue) : status.nextDue;
      return isBefore(nextDueDate, futureDate) && isAfter(nextDueDate, today);
    }
    return false;
  });
};

// Get list of overdue medications
export const getOverdueMedications = (medications: Medication[]): Medication[] => {
  return medications.filter(med => {
    const status = getMedicationStatus(med);
    return status.isOverdue === true;
  });
};

// Calculate medication status based on start and end dates
export const calculateMedicationStatus = (startDate?: string, endDate?: string): MedicationStatusEnum => {
  const today = new Date();
  
  // Check if the medication has an end date that's in the past
  if (endDate && isBefore(new Date(endDate), today)) {
    return MedicationStatusEnum.Completed;
  }
  
  // Check if the medication has a start date that's in the future
  if (startDate && isAfter(new Date(startDate), today)) {
    return MedicationStatusEnum.Scheduled;
  }
  
  // If it's active
  return MedicationStatusEnum.Active;
};
