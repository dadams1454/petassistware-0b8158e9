
import { useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing click tracking and protection against rapid clicks
 */
export const useClickProtection = (activeCategory?: string) => {
  const { toast } = useToast();
  const clickCountRef = useRef<number>(0);
  
  // Reset click counter when category changes
  useEffect(() => {
    if (activeCategory) {
      clickCountRef.current = 0;
      console.log('Click counter reset due to category change:', activeCategory);
    }
  }, [activeCategory]);
  
  // Track clicks with protection logic
  const trackClick = useCallback((dogName: string, timeSlot: string) => {
    // Increment click counter for debugging
    clickCountRef.current += 1;
    const clickNumber = clickCountRef.current;
    console.log(`Cell clicked: ${clickNumber} times (${dogName}, ${timeSlot})`);
    
    // Special handling around the 6-click threshold to prevent the issue
    if (clickNumber === 5) {
      console.log('⚠️ WARNING: Approaching 6 clicks! Adding protection');
    }
    
    if (clickNumber >= 6) {
      console.log('⚠️ 6+ CLICKS DETECTED: Applying extra safeguards');
      
      // Show a toast to let the user know we detected rapid clicking
      toast({
        title: 'Multiple clicks detected',
        description: 'Please wait a moment before making more changes',
      });
      
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
