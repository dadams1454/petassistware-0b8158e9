
import { MedicationStatusEnum } from '@/types/medication-status';
import { format, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';

// Constants for medication frequency
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as_needed',
  ONE_TIME: 'one_time',
  CUSTOM: 'custom',
  
  // Get display label for frequency
  getLabel: (frequency: string): string => {
    switch (frequency) {
      case 'daily': return 'Once Daily';
      case 'twice_daily': return 'Twice Daily';
      case 'three_times_daily': return 'Three Times Daily';
      case 'every_other_day': return 'Every Other Day';
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Every Two Weeks';
      case 'monthly': return 'Monthly';
      case 'as_needed': return 'As Needed';
      case 'one_time': return 'One Time';
      case 'custom': return 'Custom';
      default: return frequency;
    }
  }
};

// Medication status type
export type MedicationStatus = {
  status: MedicationStatusEnum;
  message: string;
  nextDue?: string | null;
  daysOverdue?: number;
  daysUntilDue?: number;
};

// Function to get status label and color for UI
export const getStatusLabel = (status: string) => {
  const statusMap: Record<string, { statusLabel: string; statusColor: string }> = {
    [MedicationStatusEnum.DUE]: { 
      statusLabel: 'Due Today', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    [MedicationStatusEnum.OVERDUE]: { 
      statusLabel: 'Overdue', 
      statusColor: 'bg-red-100 text-red-800' 
    },
    [MedicationStatusEnum.UPCOMING]: { 
      statusLabel: 'Upcoming', 
      statusColor: 'bg-blue-100 text-blue-800' 
    },
    [MedicationStatusEnum.COMPLETED]: { 
      statusLabel: 'Completed', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    [MedicationStatusEnum.SKIPPED]: { 
      statusLabel: 'Skipped', 
      statusColor: 'bg-amber-100 text-amber-800' 
    },
    [MedicationStatusEnum.UNKNOWN]: { 
      statusLabel: 'Unknown', 
      statusColor: 'bg-gray-100 text-gray-800' 
    },
    [MedicationStatusEnum.ACTIVE]: { 
      statusLabel: 'Active', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    [MedicationStatusEnum.PAUSED]: { 
      statusLabel: 'Paused', 
      statusColor: 'bg-amber-100 text-amber-800' 
    },
    [MedicationStatusEnum.STOPPED]: { 
      statusLabel: 'Stopped', 
      statusColor: 'bg-red-100 text-red-800' 
    },
    [MedicationStatusEnum.SCHEDULED]: { 
      statusLabel: 'Scheduled', 
      statusColor: 'bg-blue-100 text-blue-800' 
    },
    [MedicationStatusEnum.NOT_STARTED]: { 
      statusLabel: 'Not Started', 
      statusColor: 'bg-gray-100 text-gray-800' 
    },
    [MedicationStatusEnum.DISCONTINUED]: { 
      statusLabel: 'Discontinued', 
      statusColor: 'bg-red-100 text-red-800' 
    },
    // Fallbacks for string values
    'due': { 
      statusLabel: 'Due Today', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    'overdue': { 
      statusLabel: 'Overdue', 
      statusColor: 'bg-red-100 text-red-800' 
    },
    'upcoming': { 
      statusLabel: 'Upcoming', 
      statusColor: 'bg-blue-100 text-blue-800' 
    },
    'completed': { 
      statusLabel: 'Completed', 
      statusColor: 'bg-green-100 text-green-800' 
    },
    'skipped': { 
      statusLabel: 'Skipped', 
      statusColor: 'bg-amber-100 text-amber-800' 
    },
    'unknown': { 
      statusLabel: 'Unknown', 
      statusColor: 'bg-gray-100 text-gray-800' 
    }
  };

  // Default fallback
  return statusMap[status.toLowerCase()] || { 
    statusLabel: 'Unknown', 
    statusColor: 'bg-gray-100 text-gray-800' 
  };
};

export interface PetMedication {
  id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  next_due?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  notes?: string;
  status?: string;
  dog_id?: string;
  puppy_id?: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  administered_date: string;
  administered_by?: string;
  notes?: string;
}

export type ProcessedMedicationLogs = {
  [key: string]: {
    preventative: PetMedication[];
    other: PetMedication[];
  };
};

// Function to process medication logs from raw data
export const processMedicationLogs = (
  medications: PetMedication[],
  logs: MedicationLog[] = []
): ProcessedMedicationLogs => {
  // Group logs by medication_id for easy lookup
  const logsByMedication = logs.reduce((acc, log) => {
    if (!acc[log.medication_id]) {
      acc[log.medication_id] = [];
    }
    acc[log.medication_id].push(log);
    return acc;
  }, {} as Record<string, MedicationLog[]>);

  // Process each medication and categorize
  const result: ProcessedMedicationLogs = {};
  
  medications.forEach(medication => {
    const dogId = medication.dog_id || 'unknown';
    
    if (!result[dogId]) {
      result[dogId] = {
        preventative: [],
        other: []
      };
    }
    
    // Determine if this is preventative based on name or tags
    // (In a real app, this would be a property)
    const isPreventative = medication.name.toLowerCase().includes('preventative') ||
      medication.name.toLowerCase().includes('vaccine') ||
      medication.name.toLowerCase().includes('vaccination');
    
    // Add to appropriate category
    if (isPreventative) {
      result[dogId].preventative.push(medication);
    } else {
      result[dogId].other.push(medication);
    }
  });
  
  return result;
};
