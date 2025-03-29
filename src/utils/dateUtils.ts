
/**
 * Format a date for display
 */
export const formatDateForDisplay = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date for database storage (ISO format)
 */
export const formatDateForDatabase = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
};

/**
 * Get a formatted date string for "today"
 */
export const getTodayFormatted = (): string => {
  return formatDateForDisplay(new Date());
};

/**
 * Calculate the difference in days between two dates
 */
export const daysBetween = (start: Date | string, end: Date | string): number => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  
  const differenceInTime = endDate.getTime() - startDate.getTime();
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

/**
 * Add days to a date
 */
export const addDays = (date: Date | string, days: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  // Reset time part for comparing just the date
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

/**
 * Check if a date is in the future
 */
export const isDateInFuture = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  // Reset time part for comparing just the date
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate > today;
};

/**
 * Format a date as YYYY-MM-DD (for input[type="date"])
 */
export const formatDateForInput = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
