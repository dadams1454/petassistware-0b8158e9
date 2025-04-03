
/**
 * Format a Date object to a YYYY-MM-DD string for database storage
 */
export const formatDateToYYYYMMDD = (date: Date | string): string => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    // If already in ISO format, extract the date portion
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    return date;
  }
  
  // Format Date object to YYYY-MM-DD
  return date.toISOString().split('T')[0];
};

/**
 * Parse a date string to a Date object
 */
export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date();
  
  // If it's already a date object, return it
  if (dateString instanceof Date) return dateString;
  
  // Parse the date string
  return new Date(dateString);
};

/**
 * Format a date to a human-readable string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a date to a display format (Month D, YYYY)
 */
export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
