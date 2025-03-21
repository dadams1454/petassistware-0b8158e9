
import { useCallback, useMemo } from 'react';

export const useTimeManager = (activeCategory: string) => {
  // Generate time slots based on the active category
  const timeSlots = useMemo(() => {
    if (activeCategory === 'feeding') {
      // For feeding, use named meal times
      return ['Morning', 'Noon', 'Evening'];
    } else {
      // For potty breaks, use hourly slots (8am-8pm)
      return [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
        '6:00 PM', '7:00 PM', '8:00 PM'
      ];
    }
  }, [activeCategory]);
  
  // Get current hour for highlighting in the table
  const getCurrentHour = useCallback(() => {
    const now = new Date();
    return now.getHours();
  }, []);
  
  const currentHour = getCurrentHour();
  
  return {
    currentHour,
    timeSlots
  };
};
