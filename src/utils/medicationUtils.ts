import { HealthRecord } from '@/types/health';

export enum MedicationFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice-daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  AS_NEEDED = 'as-needed'
}

export type MedicationStatusResult = 'active' | 'expired' | 'upcoming' | 'due' | 'overdue';

export interface MedicationStatus {
  status: MedicationStatusResult;
  statusLabel?: string;
  statusColor?: string;
}

export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: string;
  frequency: string;
  lastAdministered: string;
  nextDue?: string;
  status?: MedicationStatusResult;
}

export interface DogCareStatus {
  dog_id: string;
  dog_name: string;
  dog_photo: string;
  breed: string;
  color: string;
  sex: string;
  last_care: string;
  flags: string[];
}

export function isComplexStatus(status: any): status is MedicationStatus {
  return typeof status === 'object' && status !== null && 'status' in status;
}

export function getStatusValue(status: string | MedicationStatus): string {
  if (isComplexStatus(status)) {
    return status.statusLabel || status.status;
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getStatusColor(status: string | MedicationStatus): string {
  if (isComplexStatus(status)) {
    return status.statusColor || '';
  }
  
  switch(status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'due':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'expired':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

// Function to calculate medication status
export function getMedicationStatus(medication: MedicationInfo): MedicationStatus {
  // Add implementation here based on business rules
  // For example, checking if medication is overdue, due soon, active, etc.
  
  if (!medication.nextDue) {
    return { 
      status: 'active',
      statusLabel: 'Active',
      statusColor: getStatusColor('active')
    };
  }
  
  const now = new Date();
  const nextDueDate = new Date(medication.nextDue);
  
  if (nextDueDate < now) {
    return { 
      status: 'overdue',
      statusLabel: 'Overdue', 
      statusColor: getStatusColor('overdue')
    };
  }
  
  // Due within 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);
  
  if (nextDueDate <= threeDaysFromNow) {
    return { 
      status: 'due',
      statusLabel: 'Due Soon',
      statusColor: getStatusColor('due')
    };
  }
  
  // Due within 7 days
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);
  
  if (nextDueDate <= sevenDaysFromNow) {
    return { 
      status: 'upcoming',
      statusLabel: 'Upcoming',
      statusColor: getStatusColor('upcoming')
    };
  }
  
  return { 
    status: 'active',
    statusLabel: 'Active',
    statusColor: getStatusColor('active')
  };
}
