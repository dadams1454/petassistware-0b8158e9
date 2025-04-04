
import { addDays, addWeeks, addMonths, addYears, differenceInDays, isAfter } from 'date-fns';

export enum MedicationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  EVERY_OTHER_DAY = 'every_other_day',
  AS_NEEDED = 'as_needed',
  ONCE = 'once'
}

// Legacy compatibility
export namespace MedicationFrequency {
  export const Daily = MedicationFrequency.DAILY;
  export const Weekly = MedicationFrequency.WEEKLY;
  export const Biweekly = MedicationFrequency.BIWEEKLY;
  export const Monthly = MedicationFrequency.MONTHLY;
  export const Quarterly = MedicationFrequency.QUARTERLY;
  export const Annual = MedicationFrequency.ANNUAL;
}

export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: string | number;
  frequency: string;
  lastAdministered: string;
  nextDue?: string;
  status?: MedicationStatusResult;
}

export type MedicationStatusResult = 
  | 'active'
  | 'completed'
  | 'upcoming'
  | 'overdue'
  | 'expired'
  | 'discontinued'
  | 'paused';

export interface MedicationStatus {
  status: MedicationStatusResult;
  nextDue?: Date | string | null;
  lastTaken?: Date | string | null;
  daysOverdue?: number;
  statusColor?: string;
}

export function getTimeSlotsForFrequency(frequency: string): string[] {
  switch (frequency) {
    case MedicationFrequency.TWICE_DAILY:
      return ['morning', 'evening'];
    case MedicationFrequency.THREE_TIMES_DAILY:
      return ['morning', 'afternoon', 'evening'];
    default:
      return ['anytime'];
  }
}

export function isComplexStatus(value: any): value is MedicationStatusResult | MedicationStatus {
  return value !== null && typeof value === 'object' && 'status' in value;
}

export function getStatusValue(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  if (isComplexStatus(value)) {
    return typeof value.status === 'string' ? value.status : 'unknown';
  }
  return 'unknown';
}

export function getStatusColor(status: string | null): string {
  if (!status) return "bg-gray-200 text-gray-700";
  
  switch (status.toLowerCase()) {
    case 'active':
      return "bg-green-100 text-green-800";
    case 'completed':
      return "bg-blue-100 text-blue-800";
    case 'upcoming':
      return "bg-purple-100 text-purple-800";
    case 'overdue':
      return "bg-red-100 text-red-800";
    case 'expired':
      return "bg-amber-100 text-amber-800";
    case 'discontinued':
      return "bg-gray-100 text-gray-800";
    case 'paused':
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

export function calculateNextDueDate(lastAdministered: string, frequency: string): Date | null {
  if (!lastAdministered) return null;

  const lastDate = new Date(lastAdministered);
  
  switch (frequency) {
    case MedicationFrequency.DAILY:
    case MedicationFrequency.TWICE_DAILY:
    case MedicationFrequency.THREE_TIMES_DAILY:
      return addDays(lastDate, 1);
    case MedicationFrequency.EVERY_OTHER_DAY:
      return addDays(lastDate, 2);
    case MedicationFrequency.WEEKLY:
      return addDays(lastDate, 7);
    case MedicationFrequency.BIWEEKLY:
      return addDays(lastDate, 14);
    case MedicationFrequency.MONTHLY:
      return addMonths(lastDate, 1);
    case MedicationFrequency.QUARTERLY:
      return addMonths(lastDate, 3);
    case MedicationFrequency.ANNUAL:
      return addYears(lastDate, 1);
    case MedicationFrequency.ONCE:
    case MedicationFrequency.AS_NEEDED:
      return null;
    default:
      return addDays(lastDate, 1);
  }
}

export function determineMedicationStatus(medication: MedicationInfo): MedicationStatus {
  const lastTaken = medication.lastAdministered ? new Date(medication.lastAdministered) : null;
  const today = new Date();
  
  // For single dose or as-needed medications
  if (medication.frequency === MedicationFrequency.ONCE || 
      medication.frequency === MedicationFrequency.AS_NEEDED) {
    return {
      status: 'completed',
      lastTaken,
      nextDue: null
    };
  }
  
  // Calculate next due date
  const nextDue = lastTaken ? calculateNextDueDate(medication.lastAdministered, medication.frequency) : null;
  
  // Check if overdue (next due date is in the past)
  if (nextDue && isAfter(today, nextDue)) {
    const daysOverdue = differenceInDays(today, nextDue);
    return {
      status: 'overdue',
      daysOverdue,
      lastTaken,
      nextDue,
      statusColor: 'bg-red-100 text-red-800' 
    };
  }
  
  // If there's no last administration date yet but we have an upcoming event
  if (!lastTaken && nextDue) {
    return {
      status: 'upcoming',
      nextDue,
      statusColor: 'bg-purple-100 text-purple-800'
    };
  }
  
  // Default: Active medication
  return {
    status: 'active',
    lastTaken,
    nextDue,
    statusColor: 'bg-green-100 text-green-800'
  };
}
