
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';

interface UsePottyCellActionsProps {
  pottyBreaks: Record<string, string[]>;
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  onRefresh?: () => void;
}

export const usePottyCellActions = ({ 
  pottyBreaks, 
  setPottyBreaks, 
  onRefresh 
}: UsePottyCellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Track active cells for optimistic UI
  const [activeCells, setActiveCells] = useState<Record<string, boolean>>({});
  const pendingOperationsRef = useRef<Map<string, Promise<void>>>(new Map());
  
  // Create a debounced refresh function
  const refreshDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerDebouncedRefresh = useCallback(() => {
    if (refreshDebounceTimeoutRef.current) {
      clearTimeout(refreshDebounceTimeoutRef.current);
    }
    
    refreshDebounceTimeoutRef.current = setTimeout(() => {
      if (onRefresh) {
        console.log('🔄 Executing debounced potty refresh');
        onRefresh();
      }
      refreshDebounceTimeoutRef.current = null;
    }, 1500); // 1.5 second debounce to give visual feedback time
  }, [onRefresh]);
  
  // Initialize active cells from pottyBreaks on mount and when they change
  useEffect(() => {
    const initialActiveCells: Record<string, boolean> = {};
    
    Object.entries(pottyBreaks).forEach(([dogId, timeSlots]) => {
      timeSlots.forEach(timeSlot => {
        const cellKey = `${dogId}-${timeSlot}`;
        initialActiveCells[cellKey] = true;
      });
    });
    
    setActiveCells(initialActiveCells);
  }, [pottyBreaks]);
  
  // Handle potty break cell clicks
  const handlePottyCellClick = useCallback(async (
    dogId: string, 
    dogName: string, 
    timeSlot: string
  ) => {
    // Create a unique key for this cell
    const cellKey = `${dogId}-${timeSlot}`;
    
    // Skip if we have a pending operation for this cell
    if (pendingOperationsRef.current.has(cellKey)) {
      console.log('🔄 Operation already in progress for this cell, skipping');
      return;
    }
    
    // Check if this dog already has a potty break at this time
    const isCurrentlyActive = activeCells[cellKey] || false;
    
    // Immediately update UI for responsive feel (optimistic UI)
    setActiveCells(prev => ({
      ...prev,
      [cellKey]: !isCurrentlyActive
    }));
    
    // Define the operation
    const performOperation = async () => {
      try {
        if (isCurrentlyActive) {
          // Remove the potty break from UI state
          const updatedDogBreaks = pottyBreaks[dogId]?.filter(slot => slot !== timeSlot) || [];
          const updatedPottyBreaks = { ...pottyBreaks };
          
          if (updatedDogBreaks.length === 0) {
            delete updatedPottyBreaks[dogId];
          } else {
            updatedPottyBreaks[dogId] = updatedDogBreaks;
          }
          
          setPottyBreaks(updatedPottyBreaks);
          
          toast({
            title: 'Potty break removed',
            description: `Removed potty break for ${dogName} at ${timeSlot}`,
          });
        } else {
          // Add a new potty break and update UI state - always using current time for the timestamp
          await logDogPottyBreak(dogId, timeSlot);
          
          // Update local state for immediate UI update
          const updatedPottyBreaks = { ...pottyBreaks };
          if (!updatedPottyBreaks[dogId]) {
            updatedPottyBreaks[dogId] = [];
          }
          
          if (!updatedPottyBreaks[dogId].includes(timeSlot)) {
            updatedPottyBreaks[dogId] = [...updatedPottyBreaks[dogId], timeSlot];
          }
          
          setPottyBreaks(updatedPottyBreaks);
          
          toast({
            title: 'Potty break logged',
            description: `${dogName} was taken out at ${timeSlot}`,
          });
        }
      } catch (error) {
        // Revert optimistic UI update on error
        console.error(`Error handling potty break:`, error);
        
        setActiveCells(prev => ({
          ...prev,
          [cellKey]: isCurrentlyActive
        }));
        
        toast({
          title: `Error logging potty break`,
          description: `Could not update potty break for ${dogName}. Please try again.`,
          variant: 'destructive',
        });
      } finally {
        // Remove from pending operations
        pendingOperationsRef.current.delete(cellKey);
        
        // Trigger a debounced refresh after operation completes
        triggerDebouncedRefresh();
      }
    };
    
    // Track this operation
    const operation = performOperation();
    pendingOperationsRef.current.set(cellKey, operation);
    
    // No need to await - let it run in background
    // The UI is already updated optimistically
  }, [pottyBreaks, setPottyBreaks, toast, activeCells, triggerDebouncedRefresh]);
  
  // Check if a cell is active for optimistic UI purposes
  const isCellActive = useCallback((dogId: string, timeSlot: string) => {
    const cellKey = `${dogId}-${timeSlot}`;
    return !!activeCells[cellKey];
  }, [activeCells]);
  
  return {
    isLoading,
    handlePottyCellClick,
    isCellActive
  };
};
