
/**
 * Utility functions for health records
 */
import { 
  HealthRecord, 
  HealthRecordType,
  MedicationStatusResult 
} from '../types';
import { format, differenceInDays, addDays, parseISO } from 'date-fns';

/**
 * Format a date to a standardized format
 * @param dateString Date string to format
 * @param formatStr Optional format string
 * @returns Formatted date string
 */
export function formatHealthDate(dateString?: string, formatStr = 'MMM d, yyyy'): string {
  if (!dateString) return 'N/A';
  
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Calculate days until a health event is due
 * @param dueDate Due date string
 * @returns Number of days until due (negative if overdue)
 */
export function daysUntilDue(dueDate?: string): number | null {
  if (!dueDate) return null;
  
  try {
    const due = new Date(dueDate);
    const today = new Date();
    return differenceInDays(due, today);
  } catch (error) {
    console.error('Error calculating days until due:', error);
    return null;
  }
}

/**
 * Determine if a health event is due soon
 * @param dueDate Due date string
 * @param thresholdDays Days threshold to consider "soon"
 * @returns True if due soon
 */
export function isDueSoon(dueDate?: string, thresholdDays = 14): boolean {
  const days = daysUntilDue(dueDate);
  if (days === null) return false;
  
  return days >= 0 && days <= thresholdDays;
}

/**
 * Determine if a health event is overdue
 * @param dueDate Due date string
 * @returns True if overdue
 */
export function isOverdue(dueDate?: string): boolean {
  const days = daysUntilDue(dueDate);
  if (days === null) return false;
  
  return days < 0;
}

/**
 * Determine medication status based on schedule
 * @param medication Medication record
 * @returns Medication status
 */
export function determineMedicationStatus(medication: HealthRecord): MedicationStatusResult {
  if (!medication) return 'unknown';
  
  const today = new Date();
  
  // Check if medication has ended
  if (medication.end_date && new Date(medication.end_date) < today) {
    return 'completed';
  }
  
  // Check if next due date exists
  if (medication.next_due_date) {
    const nextDue = new Date(medication.next_due_date);
    const daysUntilNext = differenceInDays(nextDue, today);
    
    if (daysUntilNext < 0) {
      return {
        status: 'overdue',
        message: `Overdue by ${Math.abs(daysUntilNext)} days`,
        nextDue: medication.next_due_date,
        daysOverdue: Math.abs(daysUntilNext)
      };
    } else if (daysUntilNext <= 3) {
      return {
        status: 'due',
        message: daysUntilNext === 0 ? 'Due today' : `Due in ${daysUntilNext} days`,
        nextDue: medication.next_due_date,
        daysUntilDue: daysUntilNext
      };
    } else {
      return {
        status: 'upcoming',
        message: `Due in ${daysUntilNext} days`,
        nextDue: medication.next_due_date,
        daysUntilDue: daysUntilNext
      };
    }
  }
  
  // If no next due date but has start date, calculate based on frequency
  if (medication.start_date && medication.frequency) {
    // This would require more complex logic based on frequency pattern
    return {
      status: 'unknown',
      message: 'Unable to determine status from schedule',
      nextDue: null
    };
  }
  
  return 'unknown';
}

/**
 * Calculate the next due date for a recurring health record
 * @param record Health record
 * @param frequency Frequency in days
 * @returns Next due date string
 */
export function calculateNextDueDate(record: HealthRecord, frequency: number): string {
  const baseDate = record.date || record.visit_date || record.created_at;
  
  if (!baseDate) {
    return format(addDays(new Date(), frequency), 'yyyy-MM-dd');
  }
  
  try {
    const nextDate = addDays(new Date(baseDate), frequency);
    return format(nextDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error calculating next due date:', error);
    return format(addDays(new Date(), frequency), 'yyyy-MM-dd');
  }
}

/**
 * Group health records by type
 * @param records Array of health records
 * @returns Records grouped by type
 */
export function groupRecordsByType(records: HealthRecord[]): Record<HealthRecordType, HealthRecord[]> {
  const result: Record<string, HealthRecord[]> = {};
  
  records.forEach(record => {
    const type = record.record_type;
    if (!result[type]) {
      result[type] = [];
    }
    result[type].push(record);
  });
  
  return result as Record<HealthRecordType, HealthRecord[]>;
}

/**
 * Sort health records by date
 * @param records Array of health records
 * @param ascending Sort in ascending order if true
 * @returns Sorted records
 */
export function sortRecordsByDate(records: HealthRecord[], ascending = false): HealthRecord[] {
  return [...records].sort((a, b) => {
    const dateA = new Date(a.date || a.visit_date || a.created_at);
    const dateB = new Date(b.date || b.visit_date || b.created_at);
    
    return ascending 
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
}

/**
 * Filter records by date range
 * @param records Array of health records
 * @param startDate Start date string
 * @param endDate End date string
 * @returns Filtered records
 */
export function filterRecordsByDateRange(
  records: HealthRecord[],
  startDate?: string,
  endDate?: string
): HealthRecord[] {
  if (!startDate && !endDate) return records;
  
  return records.filter(record => {
    const recordDate = new Date(record.date || record.visit_date || record.created_at);
    
    let isAfterStart = true;
    let isBeforeEnd = true;
    
    if (startDate) {
      isAfterStart = recordDate >= new Date(startDate);
    }
    
    if (endDate) {
      isBeforeEnd = recordDate <= new Date(endDate);
    }
    
    return isAfterStart && isBeforeEnd;
  });
}

/**
 * Get a summary of vaccination status
 * @param vaccinationRecords Array of vaccination records
 * @returns Vaccination status summary
 */
export function getVaccinationStatusSummary(vaccinationRecords: HealthRecord[]): {
  upToDate: boolean;
  nextDue?: string;
  overdue: HealthRecord[];
  dueSoon: HealthRecord[];
} {
  const overdue: HealthRecord[] = [];
  const dueSoon: HealthRecord[] = [];
  let earliestNextDue: string | undefined;
  
  vaccinationRecords.forEach(record => {
    if (record.next_due_date) {
      if (isOverdue(record.next_due_date)) {
        overdue.push(record);
      } else if (isDueSoon(record.next_due_date)) {
        dueSoon.push(record);
      }
      
      if (!earliestNextDue || daysUntilDue(record.next_due_date)! < daysUntilDue(earliestNextDue)!) {
        earliestNextDue = record.next_due_date;
      }
    }
  });
  
  return {
    upToDate: overdue.length === 0,
    nextDue: earliestNextDue,
    overdue,
    dueSoon
  };
}
