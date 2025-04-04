
import { MedicationStatusEnum } from '@/types/health';

/**
 * Get the status label and color for a medication status
 * @param status - Medication status
 * @returns Object with status label and color
 */
export const getStatusLabel = (status: MedicationStatusEnum | string) => {
  let statusLabel = '';
  let statusColor = '';
  let emoji = '';
  
  switch (String(status).toLowerCase()) {
    case 'active':
    case MedicationStatusEnum.Active:
      statusLabel = 'Active';
      statusColor = 'bg-green-100 text-green-800';
      emoji = '✅';
      break;
    case 'discontinued':
    case MedicationStatusEnum.Discontinued:
    case 'overdue':
      statusLabel = status === 'overdue' ? 'Overdue' : 'Discontinued';
      statusColor = 'bg-red-100 text-red-800';
      emoji = '⚠️';
      break;
    case 'scheduled':
    case MedicationStatusEnum.Scheduled:
    case 'upcoming':
      statusLabel = status === 'upcoming' ? 'Upcoming' : 'Scheduled';
      statusColor = 'bg-blue-100 text-blue-800';
      emoji = '📅';
      break;
    case 'not_started':
    case MedicationStatusEnum.NotStarted:
      statusLabel = 'Not Started';
      statusColor = 'bg-gray-100 text-gray-800';
      emoji = '⏱️';
      break;
    case 'completed':
    case MedicationStatusEnum.Completed:
      statusLabel = 'Completed';
      statusColor = 'bg-green-100 text-green-800';
      emoji = '✅';
      break;
    default:
      statusLabel = 'Unknown';
      statusColor = 'bg-gray-100 text-gray-800';
      emoji = '❓';
  }
  
  return { statusLabel, statusColor, emoji };
};

/**
 * Calculate medication status based on last administration and frequency
 * @param lastAdministered - Date of last administration
 * @param frequency - Medication frequency 
 * @param endDate - End date for the medication
 * @returns Object with status and next due date
 */
export const calculateMedicationStatus = (
  lastAdministered: string | Date | null,
  frequency: string,
  endDate?: string | Date | null
) => {
  if (!lastAdministered && !endDate) {
    return { status: MedicationStatusEnum.NotStarted, nextDue: null };
  }
  
  const today = new Date();
  
  // Check if medication is discontinued/completed
  if (endDate) {
    const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
    if (endDateObj < today) {
      return { status: MedicationStatusEnum.Discontinued, nextDue: null };
    }
  }
  
  // Handle case where medication hasn't been administered yet
  if (!lastAdministered) {
    return { status: MedicationStatusEnum.Scheduled, nextDue: null };
  }
  
  // Calculate days since last administration
  const lastAdminDate = typeof lastAdministered === 'string' ? 
    new Date(lastAdministered) : lastAdministered;
  
  const daysForFrequency = getFrequencyDays(frequency);
  
  if (daysForFrequency === 0) {
    // Handle as-needed medications
    return { status: MedicationStatusEnum.Active, nextDue: null };
  }
  
  // Calculate next due date
  const nextDueDate = new Date(lastAdminDate);
  nextDueDate.setDate(lastAdminDate.getDate() + daysForFrequency);
  
  // Determine status based on next due date
  if (nextDueDate < today) {
    return { status: MedicationStatusEnum.Overdue, nextDue: nextDueDate };
  } else if (
    nextDueDate.getTime() - today.getTime() < 2 * 24 * 60 * 60 * 1000
  ) {
    // Due in less than 2 days
    return { status: MedicationStatusEnum.Due, nextDue: nextDueDate };
  } else {
    return { status: MedicationStatusEnum.Active, nextDue: nextDueDate };
  }
};

/**
 * Convert frequency string to number of days
 * @param frequency - Medication frequency
 * @returns Number of days for the frequency
 */
const getFrequencyDays = (frequency: string): number => {
  const frequencyMap: Record<string, number> = {
    'once_daily': 1,
    'twice_daily': 0.5,
    'three_times_daily': 0.33,
    'four_times_daily': 0.25,
    'every_other_day': 2,
    'weekly': 7,
    'twice_weekly': 3.5,
    'biweekly': 14,
    'monthly': 30,
    'quarterly': 90,
    'annually': 365,
    'as_needed': 0,
    'daily': 1,
    'biweekly': 14,
    'as_needed': 0
  };
  
  return frequencyMap[frequency.toLowerCase()] || 0;
};

/**
 * Format a frequency string for display
 * @param frequency - Medication frequency code
 * @returns Human-readable frequency
 */
export const formatFrequency = (frequency: string): string => {
  const frequencyMap: Record<string, string> = {
    'once_daily': 'Once daily',
    'twice_daily': 'Twice daily',
    'three_times_daily': 'Three times daily',
    'four_times_daily': 'Four times daily',
    'every_other_day': 'Every other day',
    'weekly': 'Weekly',
    'twice_weekly': 'Twice weekly',
    'biweekly': 'Every two weeks',
    'monthly': 'Monthly',
    'quarterly': 'Every 3 months',
    'annually': 'Yearly',
    'as_needed': 'As needed (PRN)',
    'daily': 'Daily',
    'biweekly': 'Every two weeks',
    'as_needed': 'As needed (PRN)'
  };
  
  return frequencyMap[frequency.toLowerCase()] || frequency;
};
