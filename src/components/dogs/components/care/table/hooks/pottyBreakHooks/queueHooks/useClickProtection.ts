
import { useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing click tracking and protection against rapid clicks
 */
export const useClickProtection = (activeCategory?: string) => {
  const { toast } = useToast();
  const clickCountRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);
  
  // Reset click counter when category changes
  useEffect(() => {
    if (activeCategory) {
      clickCountRef.current = 0;
      console.log('Click counter reset due to category change:', activeCategory);
    }
  }, [activeCategory]);
  
  // Track clicks with protection logic
  const trackClick = useCallback((dogName: string, timeSlot: string) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;
    
    // If the click is very rapid (less than 100ms since the last click), 
    // we'll increment the counter. Otherwise, we reset it.
    if (timeSinceLastClick < 100) {
      clickCountRef.current += 1;
    } else if (timeSinceLastClick > 500) {
      // Reset counter if it's been a while since the last click
      clickCountRef.current = 0;
    }
    
    const clickNumber = clickCountRef.current;
    console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot}), ${timeSinceLastClick}ms since last click`);
    
    // Only block if there are truly excessive clicks
    if (clickNumber >= 12) {
      console.log('⚠️ EXCESSIVE CLICKING DETECTED: Applying temporary throttle');
      
      // Show a toast to let the user know, but make it less intrusive
      toast({
        title: 'Multiple clicks detected',
        description: 'Please wait a moment before making more changes',
        duration: 3000,
      });
      
      // Set a timeout to auto-reset the click counter after 1.5 seconds
      setTimeout(() => {
        clickCountRef.current = 0;
        console.log('Click counter auto-reset after timeout');
      }, 1500);
      
      return false; // Block further processing
    }
    
    return true; // Allow processing
  }, [toast]);
  
  return {
    trackClick,
    clickCount: clickCountRef,
    resetClicks: useCallback(() => {
      clickCountRef.current = 0;
      console.log('Click counter manually reset');
    }, [])
  };
};
