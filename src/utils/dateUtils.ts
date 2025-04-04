
import { format, differenceInDays, addDays, parseISO, isValid } from 'date-fns';

// Format date to "YYYY-MM-DD" format
export const formatDate = (date: Date | string | null): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, 'yyyy-MM-dd');
};

// Format date to a more human-readable format
export const formatReadableDate = (date: Date | string | null): string => {
  if (!date) return 'Not specified';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) return 'Invalid date';
  
  return format(dateObj, 'MMM d, yyyy');
};

// Calculate age in days from birthdate
export const calculateAge = (birthDate: string | Date | null): number => {
  if (!birthDate) return 0;
  
  const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  
  if (!isValid(birthDateObj)) return 0;
  
  return differenceInDays(new Date(), birthDateObj);
};

// Calculate age in weeks from birthdate
export const calculateAgeInWeeks = (birthDate: string | Date | null): number => {
  const ageInDays = calculateAge(birthDate);
  return Math.floor(ageInDays / 7);
};

// Format age description based on days
export const formatAgeDescription = (ageInDays: number): string => {
  if (ageInDays < 0) return 'Not born yet';
  if (ageInDays === 0) return 'Born today';
  if (ageInDays < 7) return `${ageInDays} ${ageInDays === 1 ? 'day' : 'days'} old`;
  
  const weeks = Math.floor(ageInDays / 7);
  const remainingDays = ageInDays % 7;
  
  if (weeks < 16) {
    return remainingDays > 0 
      ? `${weeks} ${weeks === 1 ? 'week' : 'weeks'}, ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} old`
      : `${weeks} ${weeks === 1 ? 'week' : 'weeks'} old`;
  }
  
  const months = Math.floor(ageInDays / 30);
  if (months < 24) {
    return `${months} ${months === 1 ? 'month' : 'months'} old`;
  }
  
  const years = Math.floor(ageInDays / 365);
  const remainingMonths = Math.floor((ageInDays % 365) / 30);
  
  return remainingMonths > 0
    ? `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'} old`
    : `${years} ${years === 1 ? 'year' : 'years'} old`;
};

// Parses frequency strings like "every 12 hours" or "twice daily"
export function parseFrequency(frequencyStr: string): { interval: number; unit: string } {
  const frequencyLower = frequencyStr.toLowerCase();
  let interval = 1;
  let unit = 'day';

  // Handle specific patterns
  if (frequencyLower.includes('twice daily') || frequencyLower.includes('twice a day') || frequencyLower.includes('2 times daily')) {
    return { interval: 12, unit: 'hours' };
  }
  
  if (frequencyLower.includes('three times daily') || frequencyLower.includes('3 times daily')) {
    return { interval: 8, unit: 'hours' };
  }
  
  if (frequencyLower.includes('four times daily') || frequencyLower.includes('4 times daily')) {
    return { interval: 6, unit: 'hours' };
  }
  
  if (frequencyLower.includes('every other day') || frequencyLower.includes('every 2 days')) {
    return { interval: 2, unit: 'days' };
  }
  
  if (frequencyLower.includes('weekly') || frequencyLower.includes('once a week')) {
    return { interval: 7, unit: 'days' };
  }
  
  if (frequencyLower.includes('monthly') || frequencyLower.includes('once a month')) {
    return { interval: 30, unit: 'days' };
  }
  
  // Parse "every X hours/days/etc"
  const matches = frequencyLower.match(/every\s+(\d+)\s+(hour|hours|day|days|week|weeks|month|months)/i);
  if (matches && matches.length >= 3) {
    interval = parseInt(matches[1], 10);
    unit = matches[2].toLowerCase();
    
    // Normalize unit to singular
    if (unit.endsWith('s')) {
      unit = unit.slice(0, -1);
    }
    
    return { interval, unit };
  }
  
  // Default to once daily if we can't parse
  return { interval: 1, unit: 'day' };
}
