
/**
 * Format a Date object to YYYY-MM-DD string
 * @param date The date to format
 * @returns The formatted date string
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format a date string to a human-readable format
 * @param dateString The date string to format
 * @returns The formatted date string
 */
export const formatDateToHuman = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
 * Calculate the age in days from a birthdate
 * @param birthDate The birthdate string
 * @returns The age in days
 */
export const calculateAgeInDays = (birthDate: string | null | undefined): number => {
  if (!birthDate) return 0;
  
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = today.getTime() - birth.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
};

/**
 * Calculate the age in weeks from a birthdate
 * @param birthDate The birthdate string
 * @returns The age in weeks
 */
export const calculateAgeInWeeks = (birthDate: string | null | undefined): number => {
  const days = calculateAgeInDays(birthDate);
  return Math.floor(days / 7);
};

/**
 * Format an age in days to a human-readable string
 * @param days The age in days
 * @returns The formatted age string
 */
export const formatAge = (days: number): string => {
  if (days < 0) return 'Invalid age';
  if (days === 0) return 'Born today';
  if (days === 1) return '1 day old';
  if (days < 14) return `${days} days old`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week old';
  if (weeks < 8) return `${weeks} weeks old`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month old';
  if (months < 24) return `${months} months old`;
  
  const years = Math.floor(days / 365);
  if (years === 1) return '1 year old';
  return `${years} years old`;
};

/**
 * Check if a date is in the future
 * @param dateString The date string to check
 * @returns True if the date is in the future
 */
export const isDateInFuture = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

/**
 * Check if a date is in the past
 * @param dateString The date string to check
 * @returns True if the date is in the past
 */
export const isDateInPast = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  } catch (error) {
    console.error('Error checking if date is in past:', error);
    return false;
  }
};
