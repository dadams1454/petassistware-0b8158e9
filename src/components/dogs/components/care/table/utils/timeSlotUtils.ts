
import { format } from 'date-fns';

/**
 * Generates time slots based on the category and current time
 * @param category The active category (pottybreaks or feeding)
 * @param currentTime The current time to base time slots around
 * @returns Array of time slot strings
 */
export const generateTimeSlots = (category: string, currentTime: Date = new Date()): string[] => {
  if (category === 'feeding') {
    return ['Morning', 'Noon', 'Evening'];
  }
  
  // For potty breaks, show a range of hours
  const slots: string[] = [];
  const currentHour = currentTime.getHours();
  
  // Start 3 hours before current hour and show 8 hours total
  let startHour = currentHour - 3;
  
  for (let i = 0; i < 8; i++) {
    // Normalize hour (handle wrapping around 24-hour clock)
    const hour = (startHour + i + 24) % 24;
    
    // Format hour to 12-hour format with AM/PM
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    
    slots.push(`${formattedHour}:00 ${period}`);
  }
  
  return slots;
};

/**
 * Determines if a time slot is the current hour
 * @param timeSlot The time slot to check
 * @param currentHour The current hour (24-hour format)
 * @param category The active category
 * @returns Boolean indicating if this is the current hour's time slot
 */
export const isCurrentHourTimeSlot = (timeSlot: string, currentHour: number, category: string): boolean => {
  // For feeding, we don't highlight current hour
  if (category === 'feeding') return false;
  
  // For potty breaks
  const [hourStr, ampmPart] = timeSlot.split(':');
  const [_, ampm] = ampmPart.split(' ');
  
  const hour = parseInt(hourStr);
  const isPM = ampm === 'PM';
  const is12Hour = hour === 12;
  
  // Convert to 24-hour format
  let hour24 = hour;
  if (isPM && !is12Hour) hour24 += 12; 
  if (!isPM && is12Hour) hour24 = 0;
  
  return hour24 === currentHour;
};

/**
 * Convert a timestamp to a time slot
 * @param timestamp ISO timestamp string
 * @param category The active category
 * @returns A formatted time slot string
 */
export const getTimeSlotFromTimestamp = (timestamp: string, category: string): string => {
  const date = new Date(timestamp);
  
  if (category === 'feeding') {
    const hour = date.getHours();
    
    // Morning: 5-10, Noon: 10-3, Evening: 3-8
    if (hour >= 5 && hour < 10) return 'Morning';
    if (hour >= 10 && hour < 15) return 'Noon';
    return 'Evening';
  }
  
  // For potty breaks - format as hour string
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:00 ${ampm}`;
};

/**
 * Gets a descriptive label for a feeding time slot
 */
export const getFeedingTimeLabel = (timeSlot: string): string => {
  switch (timeSlot) {
    case 'Morning': return 'Morning Feeding (7 AM)';
    case 'Noon': return 'Noon Feeding (12 PM)';
    case 'Evening': return 'Evening Feeding (6 PM)';
    default: return timeSlot;
  }
};

/**
 * Gets the hour from a time slot string
 */
export const getHourFromTimeSlot = (timeSlot: string): number | null => {
  if (['Morning', 'Noon', 'Evening'].includes(timeSlot)) {
    // Convert feeding time slots to hours
    switch (timeSlot) {
      case 'Morning': return 7;  // 7 AM
      case 'Noon': return 12;    // 12 PM
      case 'Evening': return 18; // 6 PM
      default: return null;
    }
  }
  
  // Parse hour from potty break time slot (e.g., "8:00 AM")
  const match = timeSlot.match(/(\d+):00 (AM|PM)/);
  if (!match) return null;
  
  let hour = parseInt(match[1]);
  const isPM = match[2] === 'PM';
  
  // Convert to 24-hour format
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  
  return hour;
};
