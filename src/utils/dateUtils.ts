
/**
 * Date utility functions
 */

/**
 * Format a date for display
 * @param date Date or ISO string
 * @param format Optional format (short, long, full)
 * @returns Formatted date string
 */
export function formatDateForDisplay(
  date: Date | string | null | undefined,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date:', date);
      return 'Invalid date';
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: format === 'short' ? 'short' : 'long',
      day: 'numeric'
    };
    
    if (format === 'full') {
      options.hour = 'numeric';
      options.minute = 'numeric';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
}

/**
 * Calculate age in days between two dates
 * @param birthDate Birth date
 * @param referenceDate Reference date (defaults to current date)
 * @returns Age in days
 */
export function calculateAgeInDays(
  birthDate: Date | string | null | undefined,
  referenceDate: Date | string = new Date()
): number | null {
  if (!birthDate) return null;
  
  try {
    const startDate = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const endDate = typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn('Invalid date in age calculation:', { birthDate, referenceDate });
      return null;
    }
    
    // Calculate difference in milliseconds
    const diffMs = endDate.getTime() - startDate.getTime();
    
    // Convert to days
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 */
export function formatDateAsISOString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date for ISO formatting:', date);
      return null;
    }
    
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date as ISO:', error);
    return null;
  }
}

/**
 * Get a description of time elapsed or remaining
 */
export function getTimeDescription(
  date: Date | string | null | undefined, 
  referenceDate: Date | string = new Date(),
  isPast = true
): string {
  if (!date) return 'N/A';
  
  try {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const baseDate = typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;
    
    // Validate dates
    if (isNaN(targetDate.getTime()) || isNaN(baseDate.getTime())) {
      console.warn('Invalid date in time description:', { date, referenceDate });
      return 'Invalid date';
    }
    
    // Calculate difference in days
    const diffMs = Math.abs(targetDate.getTime() - baseDate.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Format description
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return isPast ? 'Yesterday' : 'Tomorrow';
    } else if (diffDays < 7) {
      return `${diffDays} days ${isPast ? 'ago' : 'from now'}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ${isPast ? 'ago' : 'from now'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ${isPast ? 'ago' : 'from now'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ${isPast ? 'ago' : 'from now'}`;
    }
  } catch (error) {
    console.error('Error creating time description:', error);
    return 'Date error';
  }
}
