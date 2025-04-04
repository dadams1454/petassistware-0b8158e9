
/**
 * Format a date to YYYY-MM-DD string
 * @param date - Date object or date string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (date: Date | string): string => {
  if (!date) return '';
  
  let dateObj: Date;
  
  // Convert string to Date object if necessary
  if (typeof date === 'string') {
    // Handle already formatted date strings
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  // Check for invalid date
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDateToYYYYMMDD:', date);
    return '';
  }
  
  // Format to YYYY-MM-DD
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parse a frequency string to get the number of days
 * @param frequency - Frequency string (e.g., 'daily', 'weekly')
 * @returns Number of days for the frequency
 */
export const parseFrequency = (frequency: string): number => {
  const frequencyMap: Record<string, number> = {
    'daily': 1,
    'twice_daily': 0.5,
    'once_daily': 1,
    'every_other_day': 2,
    'weekly': 7,
    'twice_weekly': 3.5,
    'biweekly': 14,
    'monthly': 30,
    'quarterly': 90,
    'annually': 365,
    'as_needed': 0,
  };
  
  return frequencyMap[frequency.toLowerCase()] || 0;
};

/**
 * Formats a date for display in UI
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check for invalid date
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};
