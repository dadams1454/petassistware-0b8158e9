
import { format, parse, isValid } from 'date-fns';

/**
 * Formats a Date object to a YYYY-MM-DD string
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  if (!isValid(date)) {
    return new Date().toISOString().split('T')[0];
  }
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parses a date string in various formats to a Date object
 */
export const parseFlexibleDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const formats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyy/MM/dd',
    'MMM dd, yyyy',
    'MMMM dd, yyyy'
  ];
  
  // Try to parse using the formats
  for (const formatString of formats) {
    try {
      const parsedDate = parse(dateString, formatString, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (e) {
      // Continue to next format if this one fails
    }
  }
  
  // Try to create Date directly
  const directDate = new Date(dateString);
  if (isValid(directDate)) {
    return directDate;
  }
  
  return null;
};

/**
 * Calculates age in days from a birth date
 */
export const calculateAgeInDays = (birthDate: string | Date): number => {
  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  if (!isValid(birthDateObj)) {
    return 0;
  }
  
  const diffTime = today.getTime() - birthDateObj.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculates age in weeks from a birth date
 */
export const calculateAgeInWeeks = (birthDate: string | Date): number => {
  const ageInDays = calculateAgeInDays(birthDate);
  return Math.floor(ageInDays / 7);
};
