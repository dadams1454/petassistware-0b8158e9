
/**
 * Utility functions for handling dates safely in TypeScript
 */

/**
 * Safely convert a value to an ISO string date
 * @param value - Any value that might be a date
 * @returns ISO string date or null
 */
export const toISOStringOrNull = (value: unknown): string | null => {
  if (!value) return null;
  
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  // Try to convert to a date if it's a string
  if (typeof value === 'string') {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      console.error('Invalid date string:', value);
    }
  }
  
  return null;
};

/**
 * Safely format a date to YYYY-MM-DD
 * @param value - Any value that might be a date
 * @returns Formatted date string or null
 */
export const formatDateToYYYYMMDD = (value: unknown): string | null => {
  const isoString = toISOStringOrNull(value);
  if (!isoString) return null;
  
  return isoString.split('T')[0];
};

/**
 * Checks if a value is a valid date
 * @param value - Any value to check
 * @returns boolean indicating if the value is a valid date
 */
export const isValidDate = (value: unknown): boolean => {
  if (!value) return false;
  
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  
  if (typeof value === 'string') {
    try {
      const date = new Date(value);
      return !isNaN(date.getTime());
    } catch (e) {
      return false;
    }
  }
  
  return false;
};

/**
 * Safely calculates age in days between two dates
 * @param startDate - Birth date or start date
 * @param endDate - Current date or end date to compare against
 * @returns Age in days or null if dates are invalid
 */
export const calculateAgeInDays = (startDate: unknown, endDate: unknown = new Date()): number | null => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return null;
  
  const start = startDate instanceof Date ? startDate : new Date(startDate as string);
  const end = endDate instanceof Date ? endDate : new Date(endDate as string);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format a date for display in a user-friendly format
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid date';
  }
};
