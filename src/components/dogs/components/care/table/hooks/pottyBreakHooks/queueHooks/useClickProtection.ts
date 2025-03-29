
import { useRef, useCallback } from 'react';

export const useClickProtection = () => {
  const clickTimesRef = useRef<Record<string, number>>({});
  const MIN_TIME_BETWEEN_CLICKS = 500; // 500ms

  // Track clicks to prevent rapid clicking
  const trackClick = useCallback((dogName: string, timeSlot: string): boolean => {
    const key = `${dogName}-${timeSlot}`;
    const now = Date.now();
    const lastClick = clickTimesRef.current[key] || 0;
    
    // If click is too soon after last click, block it
    if (now - lastClick < MIN_TIME_BETWEEN_CLICKS) {
      console.log(`Blocking rapid click for ${key}`);
      return false;
    }
    
    // Update last click time
    clickTimesRef.current[key] = now;
    return true;
  }, []);

  return { trackClick };
};
