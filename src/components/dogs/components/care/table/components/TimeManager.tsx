
import { useState, useEffect, useMemo } from 'react';
import { generateTimeSlots } from '../dogGroupColors';
import { MedicationFrequency } from '@/types/medication';
import { getTimeSlotsForFrequency } from '@/utils/medicationUtils';

export const useTimeManager = (activeCategory = 'pottybreaks') => {
  // Get current time and hour
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentHour, setCurrentHour] = useState<number>(currentTime.getHours());
  
  // Generate timeSlots based on current time and active category
  const timeSlots = useMemo(() => {
    // Different time slot patterns for different care categories
    if (activeCategory === 'feeding') {
      // For feeding, show morning, afternoon, and evening slots
      return ['7:00 AM (Breakfast)', '12:00 PM (Lunch)', '6:00 PM (Dinner)'];
    } else if (activeCategory === 'medications') {
      // For medications, use frequency-based slots (default to monthly)
      return getTimeSlotsForFrequency(MedicationFrequency.MONTHLY);
    } else if (activeCategory === 'exercise' || activeCategory === 'training') {
      // For exercise/training, show morning and afternoon slots
      return ['8:00 AM', '12:00 PM', '4:00 PM'];
    } else if (activeCategory === 'grooming') {
      // For grooming, show weekly slots
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    } else {
      // For potty breaks and other categories, use the standard hourly slots
      return generateTimeSlots(currentTime, activeCategory);
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
    if (activeCategory === 'feeding' || activeCategory === 'medications' || 
        activeCategory === 'exercise' || activeCategory === 'training' || 
        activeCategory === 'grooming') {
      // For these categories, we don't need current hour highlighting
      return timeSlots.map(slot => ({
        slot,
        isCurrent: false
      }));
    }
    
    // For potty breaks and other hourly categories, use the original logic
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
