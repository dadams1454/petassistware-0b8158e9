
/**
 * Utility functions for date manipulation and formatting
 */

/**
 * Format a date to YYYY-MM-DD string
 * @param date The date to format
 * @returns Formatted date string or null if invalid
 */
export const formatDateToYYYYMMDD = (date: Date | string | null): string | null => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if it's a valid date
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return null;
    }
    
    // Format as YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

/**
 * Safely convert a value to a Date object
 * @param value The value to convert
 * @returns A Date object or null if conversion fails
 */
export const safelyParseDate = (value: unknown): Date | null => {
  if (!value) return null;
  
  try {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }
    
    if (typeof value === 'string') {
      const dateObj = new Date(value);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }
    
    if (typeof value === 'number') {
      const dateObj = new Date(value);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Format a date value safely for display
 * @param date The date to format
 * @param fallback Fallback string if date is invalid
 * @returns Formatted date string or fallback value
 */
export const formatDateWithFallback = (
  date: unknown, 
  format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'MMMM DD, YYYY' = 'YYYY-MM-DD',
  fallback: string = 'N/A'
): string => {
  const parsedDate = safelyParseDate(date);
  if (!parsedDate) return fallback;
  
  switch (format) {
    case 'YYYY-MM-DD':
      return formatDateToYYYYMMDD(parsedDate) || fallback;
    case 'MM/DD/YYYY':
      return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;
    case 'MMMM DD, YYYY': {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
    }
    default:
      return formatDateToYYYYMMDD(parsedDate) || fallback;
  }
};
