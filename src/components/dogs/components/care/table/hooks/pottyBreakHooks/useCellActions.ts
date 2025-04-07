
import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Type for the return value of the useCellActions hook
 */
export interface UseCellActionsResult {
  isLoading: boolean;
  handleCellClick: (
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string
  ) => void;
}

/**
 * Hook to manage cell actions in the care time table
 * 
 * @param {Date} currentDate The current date
 * @param {Record<string, string[]>} pottyBreaks The potty breaks
 * @param {(breaks: Record<string, string[]>) => void} setPottyBreaks Function to set potty breaks
 * @param {() => void} [onRefresh] Optional callback to refresh data
 * @param {string} [activeCategory='feeding'] The active category
 * @returns {UseCellActionsResult} The cell actions
 */
export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: (breaks: Record<string, string[]>) => void,
  onRefresh?: () => void,
  activeCategory: string = 'feeding'
): UseCellActionsResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Handle cell click with protection against double clicks
  const handleCellClick = useCallback((
    dogId: string, 
    dogName: string, 
    timeSlot: string, 
    category: string
  ): void => {
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
