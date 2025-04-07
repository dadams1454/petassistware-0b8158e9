
import { format, parseISO, differenceInDays, isAfter, isBefore, isToday } from 'date-fns';
import { MedicationStatusEnum, MedicationStatusResult } from '@/types';

/**
 * Get medication status label and colors
 */
export const getStatusLabel = (status: MedicationStatusEnum) => {
  let statusLabel = '';
  let statusColor = '';
  
  switch (status) {
    case MedicationStatusEnum.ACTIVE:
      statusLabel = 'Active';
      statusColor = 'bg-green-100 text-green-800';
      break;
    case MedicationStatusEnum.COMPLETED:
      statusLabel = 'Completed';
      statusColor = 'bg-green-100 text-green-800';
      break;
    case MedicationStatusEnum.PAUSED:
      statusLabel = 'Paused';
      statusColor = 'bg-amber-100 text-amber-800';
      break;
    case MedicationStatusEnum.STOPPED:
      statusLabel = 'Stopped';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.SCHEDULED:
      statusLabel = 'Scheduled';
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case MedicationStatusEnum.UPCOMING:
      statusLabel = 'Upcoming';
      statusColor = 'bg-indigo-100 text-indigo-800';
      break;
    case MedicationStatusEnum.OVERDUE:
      statusLabel = 'Overdue';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.NOT_STARTED:
      statusLabel = 'Not Started';
      statusColor = 'bg-gray-100 text-gray-800';
      break;
    case MedicationStatusEnum.DISCONTINUED:
      statusLabel = 'Discontinued';
      statusColor = 'bg-red-100 text-red-800';
      break;
    case MedicationStatusEnum.UNKNOWN:
    default:
      statusLabel = 'Unknown';
      statusColor = 'bg-gray-100 text-gray-800';
      break;
  }
  
  return { statusLabel, statusColor };
};

/**
 * Determine the status of a medication based on dates and settings
 */
export const getMedicationStatus = (
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  nextDueDate?: string | Date | null,
  isActive?: boolean
): MedicationStatusResult => {
  const today = new Date();
  let status = MedicationStatusEnum.UNKNOWN;
  let message = '';
  let daysOverdue = 0;
  let daysUntilDue = 0;
  
  // Format dates for comparison
  const start = startDate ? (typeof startDate === 'string' ? parseISO(startDate) : startDate) : null;
  const end = endDate ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) : null;
  const nextDue = nextDueDate ? (typeof nextDueDate === 'string' ? parseISO(nextDueDate) : nextDueDate) : null;
  
  // If it has an end date in the past, it's completed
  if (end && isBefore(end, today)) {
    status = MedicationStatusEnum.COMPLETED;
    message = `Completed on ${format(end, 'MM/dd/yyyy')}`;
    return { status, message, nextDue };
  }
  
  // If it has no start date yet (not started)
  if (!start) {
    status = MedicationStatusEnum.NOT_STARTED;
    message = 'Not yet started';
    
    if (nextDue) {
      if (isToday(nextDue)) {
        status = MedicationStatusEnum.SCHEDULED;
        message = 'Scheduled for today';
      } else if (isAfter(nextDue, today)) {
        daysUntilDue = differenceInDays(nextDue, today);
        status = MedicationStatusEnum.SCHEDULED;
        message = `Scheduled to start in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
      }
    }
    
    return { status, message, daysUntilDue, nextDue };
  }
  
  // If it has a start date in the future (scheduled)
  if (isAfter(start, today)) {
    status = MedicationStatusEnum.SCHEDULED;
    daysUntilDue = differenceInDays(start, today);
    message = `Scheduled to start in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
    return { status, message, daysUntilDue, nextDue: start };
  }
  
  // Check if it's overdue (next due date is in the past)
  if (nextDue && isBefore(nextDue, today) && isActive !== false) {
    status = MedicationStatusEnum.OVERDUE;
    daysOverdue = differenceInDays(today, nextDue);
    message = `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
    return { status, message, daysOverdue, nextDue };
  }
  
  // Check if it's due today
  if (nextDue && isToday(nextDue) && isActive !== false) {
    status = MedicationStatusEnum.ACTIVE;
    message = 'Due today';
    return { status, message, nextDue };
  }
  
  // Check if it's upcoming
  if (nextDue && isAfter(nextDue, today) && isActive !== false) {
    daysUntilDue = differenceInDays(nextDue, today);
    
    if (daysUntilDue <= 7) {
      status = MedicationStatusEnum.UPCOMING;
      message = `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
    } else {
      status = MedicationStatusEnum.ACTIVE;
      message = `Next dose in ${daysUntilDue} days`;
    }
    
    return { status, message, daysUntilDue, nextDue };
  }
  
  // Default active status
  if (isActive !== false) {
    status = MedicationStatusEnum.ACTIVE;
    message = 'Active';
  } else {
    status = MedicationStatusEnum.STOPPED;
    message = 'Discontinued';
  }
  
  return { status, message, nextDue };
};
