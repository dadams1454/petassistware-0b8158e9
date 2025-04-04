import { MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { format, addDays, isPast } from 'date-fns';

// Medication frequency constants
export const MedicationFrequencyConstants = {
  AS_NEEDED: 'as needed',
  ONCE_DAILY: 'once daily',
  TWICE_DAILY: 'twice daily',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually'
};

// Get status label and color
export const getStatusLabel = (status: MedicationStatusEnum | string): { statusLabel: string; statusColor: string } => {
  switch (String(status).toLowerCase()) {
    case 'active':
    case MedicationStatusEnum.Active:
      return { statusLabel: 'Active', statusColor: 'bg-green-100 text-green-800' };
    case 'completed':
    case MedicationStatusEnum.Completed:
      return { statusLabel: 'Completed', statusColor: 'bg-gray-100 text-gray-800' };
    case 'overdue':
    case MedicationStatusEnum.Overdue:
      return { statusLabel: 'Overdue', statusColor: 'bg-red-100 text-red-800' };
    case 'up_to_date':
    case MedicationStatusEnum.UpToDate:
      return { statusLabel: 'Up to Date', statusColor: 'bg-blue-100 text-blue-800' };
    case 'scheduled':
    case MedicationStatusEnum.Scheduled:
      return { statusLabel: 'Scheduled', statusColor: 'bg-blue-100 text-blue-800' };
    case 'not_started':
    case MedicationStatusEnum.NotStarted:
      return { statusLabel: 'Not Started', statusColor: 'bg-gray-100 text-gray-800' };
    case 'discontinued':
    case MedicationStatusEnum.Discontinued:
      return { statusLabel: 'Discontinued', statusColor: 'bg-red-100 text-red-800' };
    default:
      return { statusLabel: 'Unknown', statusColor: 'bg-yellow-100 text-yellow-800' };
  }
};

// Calculate the next due date and days until next dose
const calculateNextDue = (medication: any): { nextDueDate: Date; daysUntil: number } => {
  const lastAdministered = new Date(medication.last_administered);
  let nextDueDate = new Date(lastAdministered);
  let daysUntil = 0;

  switch (medication.frequency.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
    case MedicationFrequencyConstants.ONCE_DAILY:
      nextDueDate = addDays(lastAdministered, 1);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    case MedicationFrequencyConstants.TWICE_DAILY:
      nextDueDate = addDays(lastAdministered, 0.5);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    case MedicationFrequencyConstants.WEEKLY:
      nextDueDate = addDays(lastAdministered, 7);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    case MedicationFrequencyConstants.BIWEEKLY:
      nextDueDate = addDays(lastAdministered, 14);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    case MedicationFrequencyConstants.MONTHLY:
      nextDueDate.setMonth(lastAdministered.getMonth() + 1);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    case MedicationFrequencyConstants.QUARTERLY:
      nextDueDate.setMonth(lastAdministered.getMonth() + 3);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    case MedicationFrequencyConstants.ANNUALLY:
      nextDueDate.setFullYear(lastAdministered.getFullYear() + 1);
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
    default:
      nextDueDate = addDays(lastAdministered, 30); // Default to monthly
      daysUntil = Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      break;
  }

  return { nextDueDate, daysUntil };
};

// Calculate medication status with updated enum values
export const getMedicationStatus = (medication: any): MedicationStatusResult => {
  // If no medication or missing critical data
  if (!medication || !medication.frequency) {
    return {
      status: MedicationStatusEnum.Unknown,
      overdue: false,
      daysUntilNext: null,
      nextDue: null,
      message: "Unknown medication status"
    };
  }

  // Handle completed/discontinued medications
  if (medication.end_date && new Date(medication.end_date) < new Date()) {
    return {
      status: MedicationStatusEnum.Discontinued,
      overdue: false,
      daysUntilNext: null,
      nextDue: null,
      message: "Medication discontinued"
    };
  }

  // No start date yet or future start
  if (!medication.start_date || new Date(medication.start_date) > new Date()) {
    return {
      status: MedicationStatusEnum.NotStarted,
      overdue: false,
      daysUntilNext: null,
      nextDue: null,
      message: "Not started yet"
    };
  }

  // If never administered
  if (!medication.last_administered) {
    return {
      status: MedicationStatusEnum.Scheduled,
      overdue: false,
      daysUntilNext: 0,
      nextDue: new Date(),
      message: "Due today (never administered)"
    };
  }

  // Calculate next due date
  const { nextDueDate, daysUntil } = calculateNextDue(medication);

  if (daysUntil < 0) {
    return {
      status: MedicationStatusEnum.Overdue,
      overdue: true,
      daysUntilNext: daysUntil,
      nextDue: nextDueDate,
      message: `Overdue by ${Math.abs(daysUntil)} days`
    };
  }

  return {
    status: MedicationStatusEnum.Active,
    overdue: false,
    daysUntilNext: daysUntil,
    nextDue: nextDueDate,
    message: daysUntil === 0 ? "Due today" : `Due in ${daysUntil} days`
  };
};
