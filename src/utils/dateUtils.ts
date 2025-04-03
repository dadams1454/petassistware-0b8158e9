
import { format, addDays, subDays, differenceInDays, isAfter, isBefore, isValid } from 'date-fns';

/**
 * Format a date to YYYY-MM-DD (ISO date format)
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  if (!isValidDate(date)) return '';
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format a date to Month Day, Year (e.g., January 1, 2023)
 */
export const formatDateLong = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(dateObj)) return '';
  
  return format(dateObj, 'MMMM d, yyyy');
};

/**
 * Format a date for display in a standard format
 */
export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(dateObj)) return '';
  
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Check if a value is a valid Date object
 */
export const isValidDate = (value: any): boolean => {
  if (!value) return false;
  
  // If it's a Date object, check if it's valid
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  
  // If it's a string, try to create a Date and check
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  return false;
};

/**
 * Calculate age in days between two dates
 */
export const calculateAgeDays = (startDate: string, endDate: string = ''): number => {
  if (!startDate) return 0;
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  if (!isValidDate(start) || !isValidDate(end)) return 0;
  
  return differenceInDays(end, start);
};

/**
 * Format a date as a relative time (e.g., "2 days ago", "in 3 days")
 */
export const formatRelativeDate = (date: string): string => {
  if (!date) return '';
  
  const targetDate = new Date(date);
  if (!isValidDate(targetDate)) return '';
  
  const today = new Date();
  const daysDiff = differenceInDays(targetDate, today);
  
  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff === -1) return 'Yesterday';
  
  if (daysDiff > 0) {
    return `In ${daysDiff} days`;
  } else {
    return `${Math.abs(daysDiff)} days ago`;
  }
};
