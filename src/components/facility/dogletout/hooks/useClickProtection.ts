
import { useRef, useCallback } from 'react';

/**
 * Hook to provide protection against rapid/duplicate clicks
 */
export const useClickProtection = (category: string) => {
  const lastClickTimeRef = useRef<Record<string, number>>({});
  const clickCount = useRef<number>(0);
  const THROTTLE_MS = 500; // Minimum time between clicks on the same item

  /**
   * Track a click and decide if it should be allowed through
   * @returns boolean - Whether the click should proceed
   */
  const trackClick = useCallback((dogName: string, timeSlot: string) => {
    clickCount.current += 1;
    
    // Create a unique key for this dog + time slot combination
    const key = `${category}:${dogName}:${timeSlot}`;
    const now = Date.now();
    const lastClick = lastClickTimeRef.current[key] || 0;
    
    // If this is a rapid repeat click, block it
    if (now - lastClick < THROTTLE_MS) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Throttling click for ${key}, too soon after last click (${now - lastClick}ms)`);
      }
      return false;
    }
    
    // Update last click time
    lastClickTimeRef.current[key] = now;
    return true;
  }, [category]);

  /**
   * Reset all click tracking state
   */
  const resetClicks = useCallback(() => {
    lastClickTimeRef.current = {};
    clickCount.current = 0;
  }, []);

  return {
    trackClick,
    resetClicks,
    clickCount
  };
};
