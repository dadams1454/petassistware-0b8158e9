
import { useMemo, useState, useEffect } from 'react';

export const useTimeSlots = () => {
  // Create timeslots array once, not on every render
  const timeSlots = useMemo(() => {
    const slots = [];
    // Generate time slots from 6 AM to 10 PM
    for (let hour = 6; hour <= 22; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${displayHour}:00 ${amPm}`);
    }
    return slots;
  }, []);
  
  // Get current hour
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  
  // Update current hour every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // 60000ms = 1 minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  return { timeSlots, currentHour };
};
