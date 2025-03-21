
import { useState, useEffect, useMemo } from 'react';
import { generateTimeSlots } from '../dogGroupColors';

export const useTimeManager = (activeCategory = 'pottybreaks') => {
  // Get current time and hour
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentHour, setCurrentHour] = useState<number>(currentTime.getHours());
  
  // Generate timeSlots based on current time and active category
  const timeSlots = useMemo(() => {
    return generateTimeSlots(currentTime, activeCategory);
  }, [currentTime, activeCategory]);
  
  // Update current time and hour every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentHour(now.getHours());
    }, 60000); // 60000ms = 1 minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Memo-ize the timeslot headers to prevent re-renders
  const timeSlotHeaders = useMemo(() => {
    if (activeCategory === 'feeding') {
      // For feeding, we don't need current hour highlighting
      return timeSlots.map(slot => ({
        slot,
        isCurrent: false
      }));
    }
    
    // For potty breaks, use the original logic
    return timeSlots.map(slot => {
      const [hours, minutesPart] = slot.split(':');
      const [minutes, period] = minutesPart.split(' ');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return {
        slot,
        isCurrent: hour === currentHour
      };
    });
  }, [timeSlots, currentHour, activeCategory]);

  return {
    currentTime,
    currentHour,
    timeSlots,
    timeSlotHeaders
  };
};

export default useTimeManager;
