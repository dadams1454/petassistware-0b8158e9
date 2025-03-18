
import { useState, useCallback, useRef } from 'react';
import { savePottyBreaksByDogAndTimeSlot } from '@/services/dailyCare/pottyBreak/queries/timeSlotQueries';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { useDailyCare } from '@/contexts/dailyCare';
import { toast } from '@/components/ui/use-toast';

export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  onRefresh?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addCareLog } = useDailyCare();
  const pendingUpdatesRef = useRef<Set<string>>(new Set());
  
  // Handle cell click to log a potty break or other care
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Create a unique key for this update to prevent duplicates
    const updateKey = `${dogId}-${timeSlot}-${category}`;
    
    // Prevent duplicate clicks/updates
    if (pendingUpdatesRef.current.has(updateKey)) {
      console.log('🔍 Update already in progress for:', updateKey);
      return;
    }
    
    try {
      pendingUpdatesRef.current.add(updateKey);
      setIsLoading(true);
      
      if (category === 'pottybreaks') {
        // Determine the current status of the cell
        const hasBreak = pottyBreaks[dogId]?.includes(timeSlot) || false;
        const hasFailed = false; // We'll need to implement this with a separate map or flag in pottyBreaks
        
        // Handle different click scenarios:
        // 1. No status → success (✓)
        // 2. Success (✓) → failure (X)
        // 3. Failure (X) → clear
        
        // For now, just toggle between no status and success
        // First update UI immediately for responsive feeling
        const updatedBreaks = { ...pottyBreaks };
        
        // If the dog doesn't have an entry yet, create one
        if (!updatedBreaks[dogId]) {
          updatedBreaks[dogId] = [];
        }
        
        // Toggle the state - if already marked, remove it, otherwise add it
        const timeSlotIndex = updatedBreaks[dogId].indexOf(timeSlot);
        if (timeSlotIndex >= 0) {
          // Remove the time slot from the dog's breaks (success → nothing)
          updatedBreaks[dogId].splice(timeSlotIndex, 1);
          
          // Update UI immediately
          setPottyBreaks(updatedBreaks);
          
          // Log an X mark in the database (this is a placeholder - we'll need to add this functionality)
          // For now, log a care event with a different category to distinguish it
          await addCareLog({
            dog_id: dogId,
            category: 'pottybreaks', 
            task_name: 'Potty Break Refused',
            timestamp: new Date(),
            notes: `Failed potty break for ${dogName} at ${timeSlot}`
          });
          
          toast({
            title: 'Potty Break Refused',
            description: `Marked that ${dogName} refused potty break at ${timeSlot}`,
          });
        } else {
          // Add the time slot to the dog's breaks (nothing → success)
          updatedBreaks[dogId].push(timeSlot);
          
          // Update UI immediately
          setPottyBreaks(updatedBreaks);
          
          // Log this in the database as a successful potty break event
          await logDogPottyBreak(dogId, timeSlot);
          
          toast({
            title: 'Potty Break Logged',
            description: `${dogName} was successfully taken out at ${timeSlot}`,
          });
        }
        
        // Save the updated potty breaks to the database
        await savePottyBreaksByDogAndTimeSlot(currentDate, updatedBreaks);
      } else {
        // For other care categories
        // Parse the time slot to get a date object
        const [hours, minutesPart] = timeSlot.split(':');
        const [minutes, period] = minutesPart.split(' ');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const timestamp = new Date(currentDate);
        timestamp.setHours(hour, parseInt(minutes) || 0, 0, 0);
        
        // Log the care
        await addCareLog({
          dog_id: dogId,
          category,
          task_name: category.charAt(0).toUpperCase() + category.slice(1),
          timestamp,
          notes: `${category} at ${timeSlot}`
        });
        
        toast({
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Logged`,
          description: `${dogName}'s ${category} logged at ${timeSlot}`,
        });
      }
      
      // Only trigger refresh after a slight delay to prevent UI flickering
      // and to allow time for database operations to complete
      if (onRefresh) {
        // Use a timeout to reduce refresh frequency
        setTimeout(() => {
          onRefresh();
        }, 300);
      }
    } catch (error) {
      console.error(`❌ Error toggling ${category}:`, error);
      toast({
        title: 'Error',
        description: `Failed to update ${category}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      pendingUpdatesRef.current.delete(updateKey);
    }
  }, [pottyBreaks, setPottyBreaks, currentDate, addCareLog, onRefresh]);
  
  return {
    isLoading,
    handleCellClick
  };
};
