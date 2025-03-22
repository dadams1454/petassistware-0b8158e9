
import { CareLog } from './careLogsContext';

export const useTimeSlotMatching = () => {
  const matchTimeSlot = (log: CareLog, timeSlot: string, category: string): boolean => {
    if (category === 'feeding') {
      // Parse timestamp and check if it matches the time slot (Morning, Noon, Evening)
      const logDate = new Date(log.timestamp);
      const logHour = logDate.getHours();
      
      // Check time ranges:
      // Morning: 5-10, Noon: 10-3, Evening: 3-5AM
      if (timeSlot === 'Morning' && (logHour >= 5 && logHour < 10)) return true;
      if (timeSlot === 'Noon' && (logHour >= 10 && logHour < 15)) return true;
      if (timeSlot === 'Evening' && ((logHour >= 15 && logHour < 24) || (logHour >= 0 && logHour < 5))) return true;
      
      // Another option is to check the task_name directly
      return log.task_name === `${timeSlot} Feeding`;
    } else {
      // Original logic for other categories
      const logDate = new Date(log.timestamp);
      const logHour = logDate.getHours();
      const logMinutes = logDate.getMinutes();
      
      // Format for comparison (e.g., "8:00 AM")
      const period = logHour >= 12 ? 'PM' : 'AM';
      const hour12 = logHour === 0 ? 12 : logHour > 12 ? logHour - 12 : logHour;
      const formattedLogTime = `${hour12}:${logMinutes === 0 ? '00' : logMinutes} ${period}`;
      
      // Check if the normalized time matches the time slot
      return timeSlot === formattedLogTime;
    }
  };

  return { matchTimeSlot };
};
