
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useOperationQueue } from './queueHooks/useOperationQueue';
import { useClickProtection } from './queueHooks/useClickProtection';

/**
 * Hook to manage cell actions in the care time table
 */
export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: (breaks: Record<string, string[]>) => void,
  onRefresh?: () => void,
  activeCategory: string = 'feeding'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { queueOperation } = useOperationQueue();
  const { trackClick } = useClickProtection();
  
  // Handle cell click with protection against double clicks
  const handleCellClick = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string
  ) => {
    // Use trackClick to prevent rapid clicking
    if (!trackClick(dogName, timeSlot)) {
      return; // Don't proceed if click is blocked
    }
    
    // We've removed potty break handling
    console.log(`Cell clicked: ${dogId}, ${dogName}, ${timeSlot}, ${category}`);
    
    if (category !== 'pottybreaks') {
      toast({
        title: "Feature Not Available",
        description: `Tracking for ${category} is not implemented yet.`
      });
    }
    
    // Trigger refresh if provided
    if (onRefresh) {
      onRefresh();
    }
  }, [toast, onRefresh, trackClick]);
  
  return {
    isLoading,
    handleCellClick
  };
};
