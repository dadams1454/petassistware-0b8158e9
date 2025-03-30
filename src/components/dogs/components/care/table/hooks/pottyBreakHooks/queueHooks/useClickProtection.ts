
import { useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { debounce, throttle } from 'lodash';

/**
 * Enhanced hook for managing click tracking and protection against rapid clicks
 * with improved performance characteristics and memory usage
 */
export const useClickProtection = (activeCategory?: string) => {
  const { toast } = useToast();
  const clickCountRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);
  const toastShownRef = useRef<boolean>(false);
  const clickMapRef = useRef<Map<string, number>>(new Map());

  // Debounced toast to prevent excessive notifications with proper cleanup
  const debouncedToast = useRef(
    debounce((title: string, description: string) => {
      if (!toastShownRef.current) {
        toast({
          title,
          description,
          duration: 3000,
        });
        toastShownRef.current = true;
        
        // Reset toast shown flag after a delay
        setTimeout(() => {
          toastShownRef.current = false;
        }, 5000);
      }
    }, 1000)
  ).current;
  
  // Reset click counter when category changes
  useEffect(() => {
    if (activeCategory) {
      clickCountRef.current = 0;
      clickMapRef.current.clear();
      console.log('Click counter reset due to category change:', activeCategory);
    }
    
    return () => {
      // Clean up debounced functions
      debouncedToast.cancel();
    };
  }, [activeCategory]);
  
  // More efficient throttled click tracking
  const throttledTrackClick = useRef(
    throttle((dogName: string, timeSlot: string) => {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTimeRef.current;
      lastClickTimeRef.current = now;
      
      // Create a composite key for the dog + timeslot
      const compositeKey = `${dogName}:${timeSlot}`;
      
      // Track clicks for this specific dog+timeslot to detect repetitive patterns
      const specificClickCount = (clickMapRef.current.get(compositeKey) || 0) + 1;
      clickMapRef.current.set(compositeKey, specificClickCount);
      
      // If the click is very rapid (less than 100ms since the last click), 
      // we'll increment the counter. Otherwise, we reset it.
      if (timeSinceLastClick < 100) {
        clickCountRef.current += 1;
      } else if (timeSinceLastClick > 500) {
        // Reset counter if it's been a while since the last click
        clickCountRef.current = 0;
      }
      
      const clickNumber = clickCountRef.current;
      
      // Only show debug logs when in development or specifically enabled
      if (process.env.NODE_ENV === 'development') {
        console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot}), ${timeSinceLastClick}ms since last click`);
      }
      
      // Only block if there are truly excessive clicks or repetitive clicks on the same cell
      if (clickNumber >= 15 || specificClickCount >= 5) {
        console.log('⚠️ EXCESSIVE CLICKING DETECTED: Applying temporary throttle');
        
        // Show a toast to let the user know, but make it less intrusive and debounced
        debouncedToast(
          'Multiple clicks detected',
          'Please wait a moment before making more changes'
        );
        
        // Set a timeout to auto-reset the click counter after 1.5 seconds
        setTimeout(() => {
          clickCountRef.current = 0;
          // Only clear this specific dog/timeslot counter
          clickMapRef.current.delete(compositeKey);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Click counter auto-reset after timeout');
          }
        }, 1500);
        
        return false; // Block further processing
      }
      
      return true; // Allow processing
    }, 50) // 50ms throttle to smooth rapid clicks but still feel responsive
  ).current;
  
  // Track clicks with protection logic (public API remains the same for compatibility)
  const trackClick = useCallback((dogName: string, timeSlot: string) => {
    return throttledTrackClick(dogName, timeSlot);
  }, [throttledTrackClick]);
  
  // Enhanced reset function with proper cleanup
  const resetClicks = useCallback(() => {
    clickCountRef.current = 0;
    clickMapRef.current.clear();
    toastShownRef.current = false;
    if (process.env.NODE_ENV === 'development') {
      console.log('Click counter manually reset');
    }
  }, []);

  return {
    trackClick,
    clickCount: clickCountRef,
    resetClicks,
    clickMapSize: clickMapRef.current.size
  };
};
