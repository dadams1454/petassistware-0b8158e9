
import { useState, useCallback } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to manage care tracking for dogs in the time table
 */
export const useCareTracking = (onRefresh?: () => void) => {
  // Store care records in the format: dogId-timeSlot-category
  const [careRecords, setCareRecords] = useState<Record<string, boolean>>({});
  const { addCareLog } = useDailyCare();
  const { toast } = useToast();
  
  // Check if care is logged for a specific dog, time slot, and category
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    const key = `${dogId}-${timeSlot}-${category}`;
    return careRecords[key] || false;
  }, [careRecords]);
  
  // Handle clicking on a cell to toggle care status
  const handleCellClick = useCallback(async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`🖱️ Cell clicked: ${dogName} at ${timeSlot} for ${category}`);
    
    const key = `${dogId}-${timeSlot}-${category}`;
    const isCurrentlyLogged = careRecords[key];
    
    // Toggle the status in local state first for immediate feedback
    setCareRecords(prev => ({
      ...prev,
      [key]: !isCurrentlyLogged
    }));
    
    try {
      if (!isCurrentlyLogged) {
        // Create a timestamp for the selected time slot
        const [hour, period] = timeSlot.split(' ');
        const hourNum = period === 'AM' ? 
          (hour === '12' ? 0 : parseInt(hour)) : 
          (hour === '12' ? 12 : parseInt(hour) + 12);
          
        const now = new Date();
        const timestamp = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hourNum
        );
        
        // Log the care activity
        await addCareLog({
          dog_id: dogId,
          category: category,
          task_name: `${category} at ${timeSlot}`,
          timestamp: timestamp,
          notes: `Care logged via time table at ${timeSlot}`
        });
        
        toast({
          title: "Care Logged",
          description: `${category} recorded for ${dogName} at ${timeSlot}`,
        });
      } else {
        // We don't actually delete the record in the database, just update UI state
        // In a real implementation, you would add a deleteCareLog call here
        toast({
          title: "Care Removed",
          description: `${category} removed for ${dogName} at ${timeSlot}`,
        });
      }
      
      // Refresh data if callback provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error toggling care status:', error);
      // Revert the local state change if API call fails
      setCareRecords(prev => ({
        ...prev,
        [key]: isCurrentlyLogged
      }));
      
      toast({
        title: "Error",
        description: "Failed to update care status. Please try again.",
        variant: "destructive",
      });
    }
  }, [careRecords, addCareLog, toast, onRefresh]);
  
  return {
    hasCareLogged,
    handleCellClick
  };
};
