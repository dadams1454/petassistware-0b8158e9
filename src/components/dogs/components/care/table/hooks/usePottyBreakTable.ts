
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { getPottyBreaksByDogAndTimeSlot2, savePottyBreaksByDogAndTimeSlot } from '@/services/dailyCare/pottyBreak/pottyBreakQueryService';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { toast } from '@/components/ui/use-toast';
import { useDailyCare } from '@/contexts/dailyCare';

const usePottyBreakTable = (
  dogsStatus: DogCareStatus[], 
  onRefresh?: () => void,
  activeCategory: string = 'pottybreaks'
) => {
  const [currentDate] = useState(new Date());
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { fetchDogCareLogs, addCareLog } = useDailyCare();
  const [careLogs, setCareLogs] = useState<Record<string, Record<string, string[]>>>({});
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...dogsStatus].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );
  
  // Fetch potty breaks data
  const fetchPottyBreaks = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching potty breaks for date:', currentDate.toISOString().slice(0, 10));
      const breaks = await getPottyBreaksByDogAndTimeSlot2(currentDate);
      console.log('Retrieved potty breaks:', breaks);
      setPottyBreaks(breaks);
    } catch (error) {
      console.error('Error fetching potty breaks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load potty break data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch care logs for each dog
  const fetchCareLogs = useCallback(async () => {
    if (!sortedDogs.length) return;
    
    try {
      setIsLoading(true);
      const logsMap: Record<string, Record<string, string[]>> = {};
      
      // For each dog, fetch care logs
      for (const dog of sortedDogs) {
        const logs = await fetchDogCareLogs(dog.dog_id);
        
        // Group logs by category and time slot
        logs.forEach(log => {
          const logDate = new Date(log.timestamp);
          const hour = logDate.getHours();
          const timeSlot = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
          
          if (!logsMap[dog.dog_id]) {
            logsMap[dog.dog_id] = {};
          }
          
          if (!logsMap[dog.dog_id][log.category]) {
            logsMap[dog.dog_id][log.category] = [];
          }
          
          logsMap[dog.dog_id][log.category].push(timeSlot);
        });
      }
      
      setCareLogs(logsMap);
    } catch (error) {
      console.error('Error fetching care logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDogCareLogs, sortedDogs]);
  
  // Load potty breaks and care logs on initial render and when dependencies change
  useEffect(() => {
    fetchPottyBreaks();
    fetchCareLogs();
  }, [currentDate, fetchCareLogs]);
  
  // Check if a dog has a potty break at a specific time slot
  const hasPottyBreak = useCallback((dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  }, [pottyBreaks]);
  
  // Check if a dog has a care log in a specific category and time slot
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    if (category === 'pottybreaks') {
      return hasPottyBreak(dogId, timeSlot);
    }
    
    return careLogs[dogId]?.[category]?.includes(timeSlot) || false;
  }, [careLogs, hasPottyBreak]);
  
  // Handle cell click to log a potty break or other care
  const handleCellClick = async (dogId: string, dogName: string, timeSlot: string, category: string) => {
    try {
      setIsLoading(true);
      
      if (category === 'pottybreaks') {
        // Clone current state
        const updatedBreaks = { ...pottyBreaks };
        
        // If the dog doesn't have an entry yet, create one
        if (!updatedBreaks[dogId]) {
          updatedBreaks[dogId] = [];
        }
        
        // Toggle the state - if already marked, remove it, otherwise add it
        const timeSlotIndex = updatedBreaks[dogId].indexOf(timeSlot);
        if (timeSlotIndex >= 0) {
          // Remove the time slot from the dog's breaks
          updatedBreaks[dogId].splice(timeSlotIndex, 1);
          toast({
            title: 'Potty Break Removed',
            description: `Removed potty break for ${dogName} at ${timeSlot}`,
          });
        } else {
          // Add the time slot to the dog's breaks
          updatedBreaks[dogId].push(timeSlot);
          
          // Also log this in the database as a potty break event
          await logDogPottyBreak(dogId, timeSlot);
          
          toast({
            title: 'Potty Break Logged',
            description: `${dogName} was taken out at ${timeSlot}`,
          });
        }
        
        // Update state with the new breaks
        setPottyBreaks(updatedBreaks);
        
        // Save the updated potty breaks to the database
        await savePottyBreaksByDogAndTimeSlot(currentDate, updatedBreaks);
      } else {
        // For other care categories, handle differently
        // Parse the time slot to get a date object
        const [hours, minutesPart] = timeSlot.split(':');
        const [minutes, period] = minutesPart.split(' ');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const timestamp = new Date(currentDate);
        timestamp.setHours(hour, parseInt(minutes) || 0, 0, 0);
        
        // Check if we already have a care log for this dog, category, and time slot
        const hasExistingLog = hasCareLogged(dogId, timeSlot, category);
        
        if (hasExistingLog) {
          // TODO: Implement removal of care logs if needed
          toast({
            title: 'Not Implemented',
            description: `Removing ${category} logs is not yet implemented`,
          });
        } else {
          // Log the care
          await addCareLog({
            dog_id: dogId,
            category,
            task_name: category.charAt(0).toUpperCase() + category.slice(1),
            timestamp,
            notes: `${category} at ${timeSlot}`
          });
          
          // Update local state
          const updatedLogs = { ...careLogs };
          if (!updatedLogs[dogId]) {
            updatedLogs[dogId] = {};
          }
          if (!updatedLogs[dogId][category]) {
            updatedLogs[dogId][category] = [];
          }
          updatedLogs[dogId][category].push(timeSlot);
          setCareLogs(updatedLogs);
          
          toast({
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Logged`,
            description: `${dogName}'s ${category} logged at ${timeSlot}`,
          });
        }
      }
      
      // Refresh the data to show the updated state
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error(`Error toggling ${category}:`, error);
      toast({
        title: 'Error',
        description: `Failed to update ${category}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    fetchPottyBreaks();
    fetchCareLogs();
    if (onRefresh) {
      onRefresh();
    }
  };

  return {
    currentDate,
    isLoading,
    pottyBreaks,
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    handleCellClick,
    handleRefresh
  };
};

export default usePottyBreakTable;
