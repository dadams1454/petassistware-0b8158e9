
import { useCallback, useRef } from 'react';
import { startOfDay, addDays } from 'date-fns';

export function useMidnightCheck(onMidnightReached: (newDate: Date) => void) {
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup midnight check timer
  const setupMidnightCheck = useCallback(() => {
    if (midnightCheckRef.current) {
      clearTimeout(midnightCheckRef.current);
    }
    
    // Calculate time until midnight
    const now = new Date();
    const tomorrow = startOfDay(addDays(now, 1));
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing all data!');
      const newDate = new Date();
      
      // Trigger the callback with the new date
      onMidnightReached(newDate);
      
      // Set up next midnight check
      setupMidnightCheck();
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    };
  }, [onMidnightReached]);
  
  return {
    setupMidnightCheck,
    cleanupMidnightCheck: () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
      }
    }
  };
}
