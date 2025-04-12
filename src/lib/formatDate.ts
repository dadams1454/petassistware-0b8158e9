
/**
 * Date formatting utilities for display
 */

/**
 * Format a date to display format
 */
export function formatDate(
  date: Date | string | null | undefined,
  options: {
    format?: 'short' | 'medium' | 'long' | 'full';
    includeTime?: boolean;
    includeYear?: boolean;
  } = {}
): string {
  if (!date) return 'N/A';
  
  const {
    format = 'medium',
    includeTime = false,
    includeYear = true
  } = options;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date:', date);
      return 'Invalid date';
    }
    
    // Create format options
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: format === 'short' ? 'short' : 'long',
      day: 'numeric'
    };
    
    if (includeYear) {
      formatOptions.year = 'numeric';
    }
    
    if (includeTime || format === 'full') {
      formatOptions.hour = 'numeric';
      formatOptions.minute = 'numeric';
    }
    
    return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
}

/**
 * Format a date as a relative time description
 */
export function formatRelativeTime(
  date: Date | string | null | undefined,
  baseDate: Date | string = new Date()
): string {
  if (!date) return 'N/A';
  
  try {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const referenceDate = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
    
    // Validate dates
    if (isNaN(targetDate.getTime()) || isNaN(referenceDate.getTime())) {
      console.warn('Invalid date in relative time:', { date, baseDate });
      return 'Invalid date';
    }
    
    // Determine if date is in the past
    const isPast = targetDate < referenceDate;
    
    // Calculate difference in milliseconds
    const diffMs = Math.abs(targetDate.getTime() - referenceDate.getTime());
    
    // Convert to various time units
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    // Format relative time
    if (diffSec < 60) {
      return isPast ? 'just now' : 'in a few seconds';
    } else if (diffMin < 60) {
      return isPast 
        ? `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago` 
        : `in ${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'}`;
    } else if (diffHour < 24) {
      return isPast 
        ? `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago` 
        : `in ${diffHour} ${diffHour === 1 ? 'hour' : 'hours'}`;
    } else if (diffDay < 7) {
      return isPast 
        ? `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago` 
        : `in ${diffDay} ${diffDay === 1 ? 'day' : 'days'}`;
    } else {
      // For longer periods, return a formatted date
      return formatDate(date, { format: 'medium' });
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Date error';
  }
}

export default formatDate;
