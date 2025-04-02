
/**
 * Format a date for display in a user-friendly format
 */
export const formatDateForDisplay = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date with time for detailed display
 */
export const formatDateTimeForDisplay = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid date';
  }
};

/**
 * Convert a date to ISO string with validation
 */
export const toISOStringWithFallback = (date: string | Date | null | undefined): string | null => {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error converting to ISO string:', error);
    return null;
  }
};

/**
 * Format a date to YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date to YYYY-MM-DD:', error);
    return null;
  }
};

/**
 * Calculate age in weeks and days from a birthdate
 */
export const calculateAge = (birthDate: string | Date | null | undefined): { weeks: number; days: number } => {
  if (!birthDate) return { weeks: 0, days: 0 };
  
  try {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    return { weeks, days };
  } catch (error) {
    console.error('Error calculating age:', error);
    return { weeks: 0, days: 0 };
  }
};
