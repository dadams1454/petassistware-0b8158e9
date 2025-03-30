
/**
 * Formats a Date object or string to a database-friendly ISO date string (YYYY-MM-DD)
 */
export const formatDateForDatabase = (date: Date | string | null | undefined): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') {
    // If already a string, make sure it's formatted correctly
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return undefined;
    return parsedDate.toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};

/**
 * Parses a database date string to a Date object for UI components
 */
export const parseDatabaseDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Formats a date for display in the UI
 */
export const formatDateForDisplay = (date: Date | string | null | undefined, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { month: 'numeric', day: 'numeric', year: '2-digit' } :
    format === 'long' ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } :
    { month: 'short', day: 'numeric', year: 'numeric' };
    
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Checks if a date is overdue (before today)
 */
export const isDateOverdue = (date: Date | string | null | undefined): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  return dateObj < today;
};

/**
 * Checks if a date is coming up within the specified number of days
 */
export const isDateUpcoming = (date: Date | string | null | undefined, daysAhead = 30): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysAhead);
  
  return dateObj >= today && dateObj <= futureDate;
};
