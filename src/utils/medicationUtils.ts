
import { format, differenceInDays, isAfter, isBefore, isToday, parseISO, addDays } from 'date-fns';

export interface MedicationStatusResult {
  status: 'active' | 'upcoming' | 'overdue' | 'completed' | 'unknown';
  daysOverdue?: number;
  daysUntilDue?: number;
  nextDue?: Date | null;
  message: string;
}

// Define medication frequency constants
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice daily',
  THREE_TIMES_DAILY: 'three times daily',
  EVERY_OTHER_DAY: 'every other day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as needed'
};

// Helper function to get a friendly label for status
export const getStatusLabel = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'active':
      return { label: 'Active', color: 'green' };
    case 'upcoming':
      return { label: 'Upcoming', color: 'blue' };
    case 'overdue':
      return { label: 'Overdue', color: 'red' };
    case 'completed':
      return { label: 'Completed', color: 'gray' };
    case 'unknown':
    default:
      return { label: 'Unknown', color: 'yellow' };
  }
};

/**
 * Calculates the medication status based on start date, end date, frequency, and last administered date
 * @param startDate Start date of the medication
 * @param endDate End date of the medication (if any)
 * @param frequency How often the medication should be administered
 * @param lastAdministered Date the medication was last administered (if any)
 * @returns Status information including current status, days overdue or until due, and a message
 */
export const getMedicationStatus = (
  startDate: string | Date | null,
  endDate: string | Date | null,
  frequency: string,
  lastAdministered: string | Date | null
): MedicationStatusResult => {
  const today = new Date();
  
  // Handle missing start date
  if (!startDate) {
    return {
      status: 'unknown',
      message: 'Missing start date',
      nextDue: null
    };
  }

  // Parse dates
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) : null;
  const lastGiven = lastAdministered ? (typeof lastAdministered === 'string' ? parseISO(lastAdministered) : lastAdministered) : null;
  
  // Check if medication course is completed
  if (end && isBefore(end, today)) {
    return {
      status: 'completed',
      message: `Completed on ${format(end, 'MMM d, yyyy')}`,
      nextDue: null
    };
  }
  
  // Check if medication hasn't started yet
  if (isAfter(start, today)) {
    const daysUntilStart = differenceInDays(start, today);
    return {
      status: 'upcoming',
      message: `Starts ${format(start, 'MMM d, yyyy')} (in ${daysUntilStart} days)`,
      daysUntilDue: daysUntilStart,
      nextDue: start
    };
  }
  
  // Calculate next due date based on frequency and last administered
  let nextDueDate: Date | null = null;
  let daysUntilDue: number | undefined;
  let daysOverdue: number | undefined;
  
  // If never administered, next due date is the start date
  if (!lastGiven) {
    nextDueDate = start;
    
    if (isBefore(nextDueDate, today)) {
      daysOverdue = differenceInDays(today, nextDueDate);
    } else if (isAfter(nextDueDate, today)) {
      daysUntilDue = differenceInDays(nextDueDate, today);
    }
  } else {
    // Calculate next due date based on frequency and last administered
    switch (frequency.toLowerCase()) {
      case 'daily':
      case 'once daily':
        nextDueDate = addDays(lastGiven, 1);
        break;
      case 'twice daily':
        // For twice daily, consider it due after 12 hours, which is approximately 0.5 days
        nextDueDate = new Date(lastGiven.getTime() + 12 * 60 * 60 * 1000);
        break;
      case 'three times daily':
      case 'three_times_daily':
        // For three times daily, consider it due after 8 hours, which is approximately 0.33 days
        nextDueDate = new Date(lastGiven.getTime() + 8 * 60 * 60 * 1000);
        break;
      case 'every other day':
      case 'every_other_day':
        nextDueDate = addDays(lastGiven, 2);
        break;
      case 'weekly':
        nextDueDate = addDays(lastGiven, 7);
        break;
      case 'biweekly':
        nextDueDate = addDays(lastGiven, 14);
        break;
      case 'monthly':
        // Approximate a month as 30 days
        nextDueDate = addDays(lastGiven, 30);
        break;
      case 'quarterly':
        // Approximate a quarter as 91 days (about 3 months)
        nextDueDate = addDays(lastGiven, 91);
        break;
      case 'annually':
        // Approximate a year as 365 days
        nextDueDate = addDays(lastGiven, 365);
        break;
      case 'as needed':
      case 'as_needed':
        // For as-needed medications, consider them always active but never overdue
        return {
          status: 'active',
          message: 'As needed',
          nextDue: null
        };
      default:
        // For unknown frequencies, set a default of daily
        nextDueDate = addDays(lastGiven, 1);
        break;
    }
    
    if (isBefore(nextDueDate, today)) {
      daysOverdue = differenceInDays(today, nextDueDate);
    } else if (isAfter(nextDueDate, today)) {
      daysUntilDue = differenceInDays(nextDueDate, today);
    }
  }
  
  // Determine status based on calculated next due date
  if (isToday(nextDueDate)) {
    return {
      status: 'active',
      message: 'Due today',
      nextDue: nextDueDate
    };
  } else if (daysOverdue) {
    return {
      status: 'overdue',
      message: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
      daysOverdue,
      nextDue: nextDueDate
    };
  } else if (daysUntilDue) {
    return {
      status: 'active',
      message: `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
      daysUntilDue,
      nextDue: nextDueDate
    };
  }
  
  // Fallback
  return {
    status: 'active',
    message: 'Active',
    nextDue: nextDueDate
  };
};

// Helper function to process medication logs and calculate statistics
export const processMedicationLogs = (logs: any[]) => {
  if (!logs || logs.length === 0) {
    return {
      lastAdministered: null,
      adherenceRate: 0,
      administrationCount: 0,
      missedDoses: 0,
      onSchedule: false
    };
  }

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.timestamp || b.administered_at).getTime() - 
    new Date(a.timestamp || a.administered_at).getTime()
  );

  const lastAdministered = sortedLogs[0].timestamp || sortedLogs[0].administered_at;
  const administrationCount = sortedLogs.length;
  
  // In a real implementation, we would calculate missed doses and adherence rate
  // based on the medication schedule and the actual administration times
  const adherenceRate = 100; // Placeholder
  const missedDoses = 0; // Placeholder
  const onSchedule = true; // Placeholder

  return {
    lastAdministered,
    adherenceRate,
    administrationCount,
    missedDoses,
    onSchedule
  };
};
