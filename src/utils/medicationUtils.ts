import { 
  MedicationStatus, 
  MedicationStatusEnum,
  MedicationStatusResult 
} from '@/types/health';
import { format, differenceInDays, isValid } from 'date-fns';

// Function to determine the status of a medication
export const getMedicationStatus = (
  lastAdministered: string | Date | null, 
  frequency: string, 
  endDate?: string | Date | null
): MedicationStatusResult => {
  // If there's no last administered date, return unknown
  if (!lastAdministered) {
    return {
      status: MedicationStatusEnum.unknown,
      statusLabel: 'Unknown',
      statusColor: 'bg-gray-200 text-gray-700',
      isOverdue: false,
    };
  }
  
  // Handle end date - if it's in the past, medication is completed
  if (endDate) {
    const today = new Date();
    const endDateTime = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    if (isValid(endDateTime) && endDateTime < today) {
      return {
        status: MedicationStatusEnum.completed,
        statusLabel: 'Completed',
        statusColor: 'bg-green-200 text-green-700',
        isOverdue: false,
      };
    }
  }
  
  // Calculate next due date based on frequency
  const lastGiven = typeof lastAdministered === 'string' 
    ? new Date(lastAdministered) 
    : lastAdministered;
  
  if (!isValid(lastGiven)) {
    return {
      status: MedicationStatusEnum.unknown,
      statusLabel: 'Invalid Date',
      statusColor: 'bg-gray-200 text-gray-700',
      isOverdue: false,
    };
  }
  
  const nextDue = calculateNextDueDate(lastGiven, frequency);
  
  // Determine status based on next due date
  return getStatusFromDueDate(nextDue);
};

// Helper function to calculate next due date based on frequency
export const calculateNextDueDate = (lastGiven: Date, frequency: string): Date | null => {
  if (!frequency || !lastGiven || !isValid(lastGiven)) {
    return null;
  }
  
  const nextDue = new Date(lastGiven);
  
  if (/daily|every day/i.test(frequency)) {
    nextDue.setDate(nextDue.getDate() + 1);
  } else if (/twice daily|twice a day|bid|b\.i\.d\./i.test(frequency)) {
    nextDue.setHours(nextDue.getHours() + 12);
  } else if (/three times daily|tid|t\.i\.d\./i.test(frequency)) {
    nextDue.setHours(nextDue.getHours() + 8);
  } else if (/every other day|eod|e\.o\.d\./i.test(frequency)) {
    nextDue.setDate(nextDue.getDate() + 2);
  } else if (/weekly|once a week/i.test(frequency)) {
    nextDue.setDate(nextDue.getDate() + 7);
  } else if (/biweekly|every two weeks/i.test(frequency)) {
    nextDue.setDate(nextDue.getDate() + 14);
  } else if (/monthly|once a month/i.test(frequency)) {
    nextDue.setMonth(nextDue.getMonth() + 1);
  } else if (/every (\d+) hours/i.test(frequency)) {
    const match = frequency.match(/every (\d+) hours/i);
    if (match && match[1]) {
      const hours = parseInt(match[1], 10);
      nextDue.setHours(nextDue.getHours() + hours);
    }
  } else if (/every (\d+) days/i.test(frequency)) {
    const match = frequency.match(/every (\d+) days/i);
    if (match && match[1]) {
      const days = parseInt(match[1], 10);
      nextDue.setDate(nextDue.getDate() + days);
    }
  } else if (/every (\d+) weeks/i.test(frequency)) {
    const match = frequency.match(/every (\d+) weeks/i);
    if (match && match[1]) {
      const weeks = parseInt(match[1], 10);
      nextDue.setDate(nextDue.getDate() + (weeks * 7));
    }
  } else if (/every (\d+) months/i.test(frequency)) {
    const match = frequency.match(/every (\d+) months/i);
    if (match && match[1]) {
      const months = parseInt(match[1], 10);
      nextDue.setMonth(nextDue.getMonth() + months);
    }
  } else {
    // Default to daily if we can't parse the frequency
    nextDue.setDate(nextDue.getDate() + 1);
  }
  
  return nextDue;
};

// Helper function to get status based on due date
export const getStatusFromDueDate = (dueDate: Date | null): MedicationStatusResult => {
  if (!dueDate || !isValid(dueDate)) {
    return {
      status: MedicationStatusEnum.unknown,
      statusLabel: 'Unknown',
      statusColor: 'bg-gray-200 text-gray-700',
      isOverdue: false,
    };
  }
  
  const now = new Date();
  const days = differenceInDays(dueDate, now);
  
  // If due date is in the past, it's overdue
  if (days < 0) {
    return {
      status: MedicationStatusEnum.overdue,
      statusLabel: 'Overdue',
      statusColor: 'bg-red-200 text-red-700',
      nextDue: dueDate,
      daysUntilNext: days,
      isOverdue: true,
    };
  }
  
  // If due date is today, it's due today
  if (days === 0) {
    return {
      status: MedicationStatusEnum.active,
      statusLabel: 'Due Today',
      statusColor: 'bg-amber-200 text-amber-700',
      nextDue: dueDate,
      daysUntilNext: 0,
      isOverdue: false,
    };
  }
  
  // If due date is tomorrow, it's due soon
  if (days === 1) {
    return {
      status: MedicationStatusEnum.active,
      statusLabel: 'Due Tomorrow',
      statusColor: 'bg-amber-100 text-amber-700',
      nextDue: dueDate,
      daysUntilNext: 1,
      isOverdue: false,
    };
  }
  
  // If due date is within 3 days, it's upcoming
  if (days <= 3) {
    return {
      status: MedicationStatusEnum.upcoming,
      statusLabel: 'Upcoming',
      statusColor: 'bg-blue-200 text-blue-700',
      nextDue: dueDate,
      daysUntilNext: days,
      isOverdue: false,
    };
  }
  
  // Otherwise it's just active
  return {
    status: MedicationStatusEnum.active,
    statusLabel: 'Active',
    statusColor: 'bg-green-200 text-green-700',
    nextDue: dueDate,
    daysUntilNext: days,
    isOverdue: false,
  };
};

// Helper function to get status label and color
export const getStatusLabel = (
  status: MedicationStatus | string
): { statusLabel: string, statusColor: string } => {
  // If status is already a status result object, return its values
  if (typeof status === 'object' && status !== null && 'statusLabel' in status && 'statusColor' in status) {
    return {
      statusLabel: status.statusLabel as string,
      statusColor: status.statusColor as string
    };
  }
  
  // String status handlers
  const statusString = String(status);
  
  switch (statusString) {
    case String(MedicationStatusEnum.active):
      return {
        statusLabel: 'Active',
        statusColor: 'bg-green-200 text-green-700'
      };
    case String(MedicationStatusEnum.overdue):
      return {
        statusLabel: 'Overdue',
        statusColor: 'bg-red-200 text-red-700'
      };
    case String(MedicationStatusEnum.upcoming):
      return {
        statusLabel: 'Upcoming',
        statusColor: 'bg-blue-200 text-blue-700'
      };
    case String(MedicationStatusEnum.completed):
      return {
        statusLabel: 'Completed',
        statusColor: 'bg-gray-200 text-gray-700'
      };
    default:
      return {
        statusLabel: 'Unknown',
        statusColor: 'bg-gray-200 text-gray-700'
      };
  }
};
