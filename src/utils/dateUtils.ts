
import { format, parseISO } from 'date-fns';

/**
 * Formats a date as a string in the format 'YYYY-MM-DD'
 */
export const formatDateToYYYYMMDD = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Get year, month, and day
  const year = dateObj.getFullYear();
  // getMonth() returns 0-11, so add 1
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date for display (with user-friendly format)
 */
export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Calculates age in days from a birthdate
 */
export const calculateAgeInDays = (birthDate: string | Date): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  // Calculate difference in milliseconds
  const diffMs = today.getTime() - birth.getTime();
  
  // Convert to days (1000ms * 60s * 60min * 24h)
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Formats a date range
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};
