
import { useMemo, useState, useEffect } from 'react';

/**
 * Custom hook for managing time slots in the dog care time table
 * 
 * @returns {Object} Object containing:
 *   - timeSlots: Array of formatted time strings (e.g., "6:00 AM")
 *   - currentHour: Number representing the current hour in 24-hour format
 */
export const useTimeSlots = () => {
  // Create time slots array with a dynamic 7-hour window (6 hours before current hour + current hour)
  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    // Start 6 hours before current hour (showing 7 hours total including current hour)
    let startHour = currentHour - 6;
    
    // Generate 7 hours (current hour + 6 hours before)
    for (let i = 0; i < 7; i++) {
      // Normalize hour (handle wrapping around 24-hour clock)
      const hour = (startHour + i + 24) % 24;
      
      // Convert to 12-hour format for display
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${displayHour}:00 ${amPm}`);
    }
    
    return slots;
  }, []); // Empty dependency array still works because we'll refresh the component
  
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
