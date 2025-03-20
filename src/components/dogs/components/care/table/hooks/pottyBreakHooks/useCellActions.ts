
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { addCareLog } from '@/services/dailyCare/careLogsService';
import { useAuth } from '@/contexts/AuthProvider';

export const useCellActions = (
  currentDate: Date,
  pottyBreaks: Record<string, string[]>,
  setPottyBreaks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Debounce timer references
  const debounceTimerRef = useRef<number | null>(null);
  
  // Handler for cell clicks
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    if (isLoading) return;
    
    if (category !== activeCategory) {
      console.log('Cell click ignored - category mismatch:', category, activeCategory);
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (category === 'pottybreaks') {
        // Check if this dog already has a potty break at this time
        const hasPottyBreak = pottyBreaks[dogId]?.includes(timeSlot);
        
        if (hasPottyBreak) {
          // Remove the potty break from UI state
          const updatedDogBreaks = pottyBreaks[dogId].filter(slot => slot !== timeSlot);
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
          // Add a new potty break and update UI state
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
      } else if (category === 'feeding') {
        // Handle feeding log action
        const timestamp = getTimestampFromTimeSlot(timeSlot, currentDate);
        
        // Map meal names based on time slot
        let mealName = "Regular Feeding";
        if (timeSlot === "7:00 AM") mealName = "Morning Feeding";
        if (timeSlot === "12:00 PM") mealName = "Noon Feeding";
        if (timeSlot === "6:00 PM") mealName = "Evening Feeding";
        
        await addCareLog({
          dog_id: dogId,
          category: 'feeding',
          task_name: mealName,
          timestamp: timestamp,
          notes: `${dogName} fed at ${timeSlot}`
        }, user?.id || '');
        
        toast({
          title: 'Feeding logged',
          description: `${dogName} was fed at ${timeSlot}`,
        });
      }
      
      // Schedule a refresh after a brief delay to limit API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        if (onRefresh) {
          onRefresh();
        }
        debounceTimerRef.current = null;
      }, 1000);
      
    } catch (error) {
      console.error(`Error handling ${category} cell click:`, error);
      toast({
        title: `Error logging ${category}`,
        description: `Could not log ${category} for ${dogName}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pottyBreaks, setPottyBreaks, activeCategory, currentDate, user, toast, onRefresh]);
  
  // Helper function to convert a time slot string to a Date
  const getTimestampFromTimeSlot = (timeSlot: string, date: Date): Date => {
    const [hourStr, rest] = timeSlot.split(':');
    const [minuteStr, period] = rest.split(' ');
    
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert to 24-hour format
    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, 0, 0);
    
    return timestamp;
  };
  
  return {
    isLoading,
    handleCellClick
  };
};
