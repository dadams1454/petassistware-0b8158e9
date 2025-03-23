
import { generateTimeSlots as generateTimeSlotsUtil } from './utils/timeSlotUtils';

// Function to generate time slots dynamically based on current time
export const generateTimeSlots = (currentTime = new Date(), viewType = 'pottybreaks'): string[] => {
  return generateTimeSlotsUtil(viewType, currentTime);
};

// Function to determine row color based on index
export const getDogRowColor = (index: number): string => {
  // Alternate between white and very light gray for better readability
  return index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50';
};
