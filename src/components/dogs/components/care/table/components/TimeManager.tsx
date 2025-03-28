
import { useState, useEffect, useMemo } from 'react';
import { 
  MedicationFrequency, 
  getTimeSlotsForFrequency 
} from '@/utils/medicationUtils';

export const useTimeManager = (activeCategory = 'feeding') => {
  // Get current time and hour
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentHour, setCurrentHour] = useState<number>(currentTime.getHours());
  
  // Generate timeSlots based on current time and active category
  const timeSlots = useMemo(() => {
    // Different time slot patterns for different care categories
    if (activeCategory === 'feeding') {
      // For feeding, show morning, afternoon, and evening slots
      return ['7:00 AM (Breakfast)', '12:00 PM (Lunch)', '6:00 PM (Dinner)'];
    } else if (activeCategory === 'medication') {
      // For medications, use frequency-based slots (default to monthly)
      return getTimeSlotsForFrequency(MedicationFrequency.MONTHLY);
    } else {
      // Default to feeding slots
      return ['7:00 AM (Breakfast)', '12:00 PM (Lunch)', '6:00 PM (Dinner)'];
    }
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
    return timeSlots.map(slot => ({
      slot,
      isCurrent: false
    }));
  }, [timeSlots]);

  return {
    currentTime,
    currentHour,
    timeSlots,
    timeSlotHeaders
  };
};

export default useTimeManager;
