
import { MedicationStatus, MedicationStatusResult } from '@/types/health';

// Define MedicationFrequency type for export
export type MedicationFrequency = 'daily' | 'twice_daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed';

/**
 * Get medication status based on start/end dates and frequency
 */
export const getMedicationStatus = (medication: any): MedicationStatusResult => {
  if (!medication) {
    return {
      status: 'inactive',
      statusColor: 'bg-gray-200 text-gray-800',
      statusLabel: 'Inactive'
    };
  }

  const today = new Date();
  const startDate = medication.start_date ? new Date(medication.start_date) : null;
  const endDate = medication.end_date ? new Date(medication.end_date) : null;

  // Status based on dates
  if (startDate && startDate > today) {
    return {
      status: 'pending',
      statusColor: 'bg-blue-100 text-blue-800',
      statusLabel: 'Pending'
    };
  }

  if (endDate && endDate < today) {
    return {
      status: 'completed',
      statusColor: 'bg-green-100 text-green-800',
      statusLabel: 'Completed'
    };
  }

  if (medication.is_active === false) {
    return {
      status: 'discontinued',
      statusColor: 'bg-orange-100 text-orange-800',
      statusLabel: 'Discontinued'
    };
  }

  return {
    status: 'active',
    statusColor: 'bg-blue-500 text-white',
    statusLabel: 'Active'
  };
};

/**
 * Determine if the status is a complex object or a simple string
 */
export const isComplexStatus = (status: any): status is MedicationStatusResult => {
  return typeof status === 'object' && status !== null && 'statusLabel' in status;
};

/**
 * Extract the status value from a status object or return the status if it's a string
 */
export const getStatusValue = (status: string | MedicationStatusResult): string => {
  if (typeof status === 'string') {
    return status;
  }
  
  return status.status || '';
};

/**
 * Get color class for a status
 */
export const getStatusColor = (status: string | MedicationStatusResult): string => {
  if (isComplexStatus(status)) {
    return status.statusColor;
  }
  
  // Default colors for string statuses
  switch (status) {
    case 'active':
      return 'bg-blue-500 text-white';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'discontinued':
      return 'bg-orange-100 text-orange-800';
    case 'inactive':
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

/**
 * Get time slots for a medication frequency
 */
export const getTimeSlotsForFrequency = (frequency: MedicationFrequency): string[] => {
  switch (frequency) {
    case 'daily':
      return ['08:00'];
    case 'twice_daily':
      return ['08:00', '20:00'];
    case 'weekly':
      return ['08:00'];
    case 'biweekly':
      return ['08:00'];
    case 'monthly':
      return ['08:00'];
    case 'as_needed':
      return [];
    default:
      return ['08:00'];
  }
};
