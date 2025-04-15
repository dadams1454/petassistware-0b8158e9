
import { MedicationStatusEnum } from '@/types/health-enums';

/**
 * Gets a display label and color class for a medication status
 */
export const getStatusLabel = (status: string) => {
  let statusLabel = 'Unknown';
  let statusColor = 'bg-gray-200 text-gray-800';
  
  switch (status) {
    case MedicationStatusEnum.DUE:
      statusLabel = 'Due';
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case MedicationStatusEnum.OVERDUE:
      statusLabel = 'Overdue';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.UPCOMING:
      statusLabel = 'Upcoming';
      statusColor = 'bg-purple-100 text-purple-800';
      break;
    case MedicationStatusEnum.COMPLETED:
      statusLabel = 'Completed';
      statusColor = 'bg-green-100 text-green-800';
      break;
    case MedicationStatusEnum.SKIPPED:
      statusLabel = 'Skipped';
      statusColor = 'bg-amber-100 text-amber-800';
      break;
    default:
      statusLabel = 'Unknown';
      statusColor = 'bg-gray-200 text-gray-800';
      break;
  }
  
  return { statusLabel, statusColor };
};

/**
 * Calculate medication status based on schedule and last administered date
 */
export const calculateMedicationStatus = (
  lastAdministered: Date | string | null,
  frequency: string,
  nextDueDate?: Date | string | null
): {
  status: string;
  message: string;
  nextDue?: Date | null;
  daysOverdue?: number;
  daysUntilDue?: number;
} => {
  if (!lastAdministered && !nextDueDate) {
    return {
      status: MedicationStatusEnum.DUE,
      message: 'No previous administration recorded',
      nextDue: null
    };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If explicit next due date is provided
  if (nextDueDate) {
    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        status: MedicationStatusEnum.OVERDUE,
        message: `Overdue by ${Math.abs(diffDays)} days`,
        nextDue: dueDate,
        daysOverdue: Math.abs(diffDays)
      };
    } else if (diffDays === 0) {
      return {
        status: MedicationStatusEnum.DUE,
        message: 'Due today',
        nextDue: dueDate
      };
    } else if (diffDays <= 7) {
      return {
        status: MedicationStatusEnum.UPCOMING,
        message: `Due in ${diffDays} days`,
        nextDue: dueDate,
        daysUntilDue: diffDays
      };
    } else {
      return {
        status: MedicationStatusEnum.UPCOMING,
        message: `Next dose on ${dueDate.toLocaleDateString()}`,
        nextDue: dueDate,
        daysUntilDue: diffDays
      };
    }
  }
  
  // If we need to calculate based on lastAdministered and frequency
  if (lastAdministered) {
    const lastDate = new Date(lastAdministered);
    lastDate.setHours(0, 0, 0, 0);
    
    // Calculate next due date based on frequency
    const nextDue = new Date(lastDate);
    
    if (frequency.includes('day')) {
      const days = parseInt(frequency.match(/\d+/)?.[0] || '1', 10);
      nextDue.setDate(nextDue.getDate() + days);
    } else if (frequency.includes('week')) {
      const weeks = parseInt(frequency.match(/\d+/)?.[0] || '1', 10);
      nextDue.setDate(nextDue.getDate() + (weeks * 7));
    } else if (frequency.includes('month')) {
      const months = parseInt(frequency.match(/\d+/)?.[0] || '1', 10);
      nextDue.setMonth(nextDue.getMonth() + months);
    } else if (frequency.includes('year')) {
      const years = parseInt(frequency.match(/\d+/)?.[0] || '1', 10);
      nextDue.setFullYear(nextDue.getFullYear() + years);
    } else if (frequency === 'once' || frequency === 'as needed') {
      return {
        status: MedicationStatusEnum.COMPLETED,
        message: `Last administered on ${lastDate.toLocaleDateString()}`,
        nextDue: null
      };
    }
    
    const diffDays = Math.round((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        status: MedicationStatusEnum.OVERDUE,
        message: `Overdue by ${Math.abs(diffDays)} days`,
        nextDue: nextDue,
        daysOverdue: Math.abs(diffDays)
      };
    } else if (diffDays === 0) {
      return {
        status: MedicationStatusEnum.DUE,
        message: 'Due today',
        nextDue: nextDue
      };
    } else if (diffDays <= 7) {
      return {
        status: MedicationStatusEnum.UPCOMING,
        message: `Due in ${diffDays} days`,
        nextDue: nextDue,
        daysUntilDue: diffDays
      };
    } else {
      return {
        status: MedicationStatusEnum.UPCOMING,
        message: `Next dose on ${nextDue.toLocaleDateString()}`,
        nextDue: nextDue,
        daysUntilDue: diffDays
      };
    }
  }
  
  // Fallback
  return {
    status: MedicationStatusEnum.UNKNOWN,
    message: 'Unable to determine status',
    nextDue: null
  };
};
