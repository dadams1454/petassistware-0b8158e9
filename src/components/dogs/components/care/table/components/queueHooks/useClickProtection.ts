
import { useCallback, useRef } from 'react';

interface ClickThrottle {
  [key: string]: number;
}

export const useClickProtection = (category: string = 'pottybreaks') => {
  // Track clicks by dog+timeSlot to prevent excessive clicks
  const clickThrottleRef = useRef<ClickThrottle>({});
  const clickCount = useRef<number>(0);
  
  // Click protection with rate limiting
  const trackClick = useCallback((dogName: string, timeSlot: string) => {
    const key = `${dogName}-${timeSlot}-${category}`;
    const now = Date.now();
    const lastClickTime = clickThrottleRef.current[key] || 0;
    
    // Increment global click counter
    clickCount.current += 1;
    
    // Allow the click if it's been more than 1 second since the last click on this cell
    const timeSinceLastClick = now - lastClickTime;
    
    if (timeSinceLastClick < 1000) {
      console.log(`Click throttled for ${key}: ${timeSinceLastClick}ms since last click`);
      return false;
    }
    
    // Update last click time
    clickThrottleRef.current[key] = now;
    return true;
  }, [category]);
  
  // Reset click counter
  const resetClicks = useCallback(() => {
    clickCount.current = 0;
    clickThrottleRef.current = {};
  }, []);

  return {
    trackClick,
    clickCount,
    resetClicks
  };
};
