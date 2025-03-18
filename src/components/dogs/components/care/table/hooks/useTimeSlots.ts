
import { useMemo, useState, useEffect } from 'react';

/**
 * Custom hook for managing time slots in the dog care time table
 * 
 * @returns {Object} Object containing:
 *   - timeSlots: Array of formatted time strings (e.g., "6:00 AM")
 *   - currentHour: Number representing the current hour in 24-hour format
 */
export const useTimeSlots = () => {
  // Create time slots array once with useMemo to prevent recreation on each render
  const timeSlots = useMemo(() => {
    const slots = [];
    // Generate time slots from 6 AM (6) to 10 PM (22) in 24-hour format
    for (let hour = 6; hour <= 22; hour++) {
      // Convert to 12-hour format for display
      const displayHour = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${displayHour}:00 ${amPm}`);
    }
    return slots;
  }, []); // Empty dependency array ensures this runs only once
  
  // Track current hour for highlighting the current time slot
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());
  
  // Update current hour every minute using an interval
  useEffect(() => {
    // Initial function to update the hour
    const updateCurrentHour = () => {
      const now = new Date();
      setCurrentHour(now.getHours());
    };
    
    // Set up interval to check for hour changes
    const intervalId = setInterval(updateCurrentHour, 60000); // 60000ms = 1 minute
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return { timeSlots, currentHour };
};
