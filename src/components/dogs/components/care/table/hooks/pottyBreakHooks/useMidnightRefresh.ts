
import { useCallback, useRef, useEffect } from 'react';

export const useMidnightRefresh = (onMidnightReached: () => void) => {
  const midnightCheckRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to check if it's midnight and trigger a refresh
  const setupMidnightCheck = useCallback(() => {
    // Clear any existing interval
    if (midnightCheckRef.current) {
      clearInterval(midnightCheckRef.current);
    }
    
    // Get current time and calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Time until midnight in milliseconds
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ Setting up midnight check: ${timeUntilMidnight / 1000 / 60} minutes until midnight refresh`);
    
    // Set timeout for immediate midnight reset
    midnightCheckRef.current = setTimeout(() => {
      console.log('🕛 Midnight reached - refreshing feeding data...');
      onMidnightReached();
      
      // Set up daily check after first trigger
      midnightCheckRef.current = setInterval(() => {
        console.log('🕛 Daily midnight refresh triggered');
        onMidnightReached();
      }, 24 * 60 * 60 * 1000); // Check every 24 hours
    }, timeUntilMidnight);
    
    return () => {
      if (midnightCheckRef.current) {
        clearTimeout(midnightCheckRef.current);
        clearInterval(midnightCheckRef.current);
      }
    };
  }, [onMidnightReached]);

  // Use effect to set up the midnight check on mount
  useEffect(() => {
    const cleanup = setupMidnightCheck();
    return cleanup;
  }, [setupMidnightCheck]);

  return {
    setupMidnightCheck
  };
};
