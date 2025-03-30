
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
  
  // Handle cell click with protection against double clicks
  const handleCellClick = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string
  ) => {
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
  }, [toast, onRefresh]);
  
  return {
    isLoading,
    handleCellClick
  };
};
