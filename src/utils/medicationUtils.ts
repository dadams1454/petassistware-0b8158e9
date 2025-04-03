
import { MedicationStatus, MedicationStatusResult, MedicationFrequency } from '../types/health';
import { differenceInDays, parseISO, isValid, isAfter, isBefore, addDays } from 'date-fns';

// Check if a value is a complex status object
export const isComplexStatus = (status: any): status is MedicationStatusResult => {
  return status !== null && 
         typeof status === 'object' && 
         'status' in status &&
         'statusColor' in status;
};

// Get status value from various status types
export const getStatusValue = (status: string | MedicationStatusResult): string => {
  if (isComplexStatus(status)) {
    return status.status;
  }
  return status;
};

// Get color for different status types
export const getStatusColor = (status: string | MedicationStatus): string => {
  if (!status) return "bg-gray-200 text-gray-700";
  
  switch (status) {
    case 'active':
      return "bg-green-100 text-green-800";
    case 'pending':
      return "bg-blue-100 text-blue-800";
    case 'completed':
      return "bg-slate-100 text-slate-800";
    case 'expired':
      return "bg-red-100 text-red-800";
    case 'discontinued':
      return "bg-slate-100 text-slate-800";
    case 'upcoming':
      return "bg-amber-100 text-amber-800";
    case 'due':
      return "bg-orange-100 text-orange-800";
    case 'overdue':
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

// Calculate medication status based on date ranges
export const calculateMedicationStatus = (startDate?: string, endDate?: string): MedicationStatusResult => {
  const today = new Date();
  
  if (!startDate) {
    return { 
      status: 'unknown', 
      statusColor: getStatusColor('unknown'),
      statusLabel: 'Unknown' 
    };
  }
  
  const start = parseISO(startDate);
  if (!isValid(start)) {
    return { 
      status: 'unknown', 
      statusColor: getStatusColor('unknown'),
      statusLabel: 'Invalid Date' 
    };
  }
  
  // Check if medication has ended
  if (endDate) {
    const end = parseISO(endDate);
    if (isValid(end) && isBefore(end, today)) {
      return { 
        status: 'completed', 
        statusColor: getStatusColor('completed'),
        statusLabel: 'Completed' 
      };
    }
  }
  
  // Not started yet
  if (isAfter(start, today)) {
    const daysUntilStart = differenceInDays(start, today);
    let status: MedicationStatus = 'upcoming';
    
    // Due within 3 days
    if (daysUntilStart <= 3) {
      status = 'due';
    }
    
    return {
      status,
      statusColor: getStatusColor(status),
      statusLabel: `Starts in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`,
      dueDate: startDate
    };
  }
  
  // Active medication
  return {
    status: 'active',
    statusColor: getStatusColor('active'),
    statusLabel: 'Active'
  };
};

// Get medication frequency display text
export const getMedicationFrequencyText = (frequency: string): string => {
  switch (frequency) {
    case MedicationFrequency.ONCE:
      return 'Once';
    case MedicationFrequency.DAILY:
      return 'Daily';
    case MedicationFrequency.TWICE_DAILY:
      return 'Twice daily';
    case MedicationFrequency.THREE_TIMES_DAILY:
      return 'Three times daily';
    case MedicationFrequency.EVERY_OTHER_DAY:
      return 'Every other day';
    case MedicationFrequency.WEEKLY:
      return 'Weekly';
    case MedicationFrequency.BIWEEKLY:
      return 'Every 2 weeks';
    case MedicationFrequency.MONTHLY:
      return 'Monthly';
    case MedicationFrequency.AS_NEEDED:
      return 'As needed';
    case MedicationFrequency.CUSTOM:
      return 'Custom';
    default:
      return frequency;
  }
};

// Export the MedicationFrequency enum for components to use
export { MedicationFrequency };
