
import { useState, useEffect, useMemo } from 'react';
import { generateTimeSlots, isCurrentHourTimeSlot } from '../utils/timeSlotUtils';

/**
 * Hook to manage time slots and current time state
 */
export const useTimeSlots = (activeCategory: string) => {
  // Track current time and hour
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentHour, setCurrentHour] = useState<number>(currentTime.getHours());
  
  // Generate time slots based on active category
  const timeSlots = useMemo(() => {
    return generateTimeSlots(activeCategory, currentTime);
  }, [activeCategory, currentTime]);
  
  // Update current time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentHour(now.getHours());
    }, 60000); // 60 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Generate time slot headers with current hour indicator
  const timeSlotHeaders = useMemo(() => {
    return timeSlots.map(slot => ({
      slot,
      isCurrent: isCurrentHourTimeSlot(slot, currentHour, activeCategory)
    }));
  }, [timeSlots, currentHour, activeCategory]);
  
  return {
    currentTime,
    currentHour,
    timeSlots,
    timeSlotHeaders,
    isCurrentHourSlot: (timeSlot: string) => isCurrentHourTimeSlot(timeSlot, currentHour, activeCategory)
  };
};
