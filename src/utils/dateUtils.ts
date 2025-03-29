
/**
 * Format a date string for display
 * @param dateString ISO date string or other date format
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if invalid date
  }
  
  // Return formatted date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Get age in years and months from a birthdate
 * @param birthdate ISO date string
 * @returns Age string (e.g., "2 years, 3 months")
 */
export function getAgeFromBirthdate(birthdate: string): string {
  if (!birthdate) return '';
  
  const birthDate = new Date(birthdate);
  const now = new Date();
  
  // Check if birthdate is valid
  if (isNaN(birthDate.getTime())) {
    return '';
  }
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  
  // Adjust years and months if needed
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Format the age string
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
  }
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param date Date object or date string
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string | null): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
