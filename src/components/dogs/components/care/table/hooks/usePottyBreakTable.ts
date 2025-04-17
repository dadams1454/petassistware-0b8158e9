
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { DogCareStatus, CareLog } from '@/types/dailyCare';
import { useCareLogs } from '@/hooks/useCareLogs';
import { useDailyCare } from '@/contexts/dailyCare';
import { useCareTracking } from '../components/useCareTracking';

const usePottyBreakTable = (dogs: DogCareStatus[]) => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const { toast } = useToast();
  const { fetchDogCareLogs } = useDailyCare();
  
  // Create our own tracking state instead of using useCareTracking
  const [careLogged, setCareLogged] = useState<Record<string, boolean>>({});
  
  const { careLogs, loading, error, refresh } = useCareLogs({
    dogIds: dogs.map(dog => dog.dog_id),
    category: 'pottybreaks'
  });
  
  // Custom implementation of hasCareLogged
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    const key = `${dogId}-${timeSlot}-${category}`;
    return careLogged[key] || false;
  }, [careLogged]);
  
  // Initialize time slots
  useEffect(() => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    setTimeSlots(slots);
  }, []);
  
  // Initialize care logged state from care logs
  useEffect(() => {
    if (careLogs && careLogs.length > 0) {
      const newCareLogged: Record<string, boolean> = {};
      
      careLogs.forEach(log => {
        const logDate = new Date(log.timestamp);
        const timeSlot = `${logDate.getHours().toString().padStart(2, '0')}:${logDate.getMinutes().toString().padStart(2, '0')}`;
        const key = `${log.dog_id}-${timeSlot}-${log.category}`;
        newCareLogged[key] = true;
      });
      
      setCareLogged(newCareLogged);
    }
  }, [careLogs]);
  
  // Function to handle cell click
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string, category: string) => {
    const key = `${dogId}-${timeSlot}-${category}`;
    
    // Toggle care logged state
    if (careLogged[key]) {
      // Remove the care logged
      const updatedCareLogged = { ...careLogged };
      delete updatedCareLogged[key];
      setCareLogged(updatedCareLogged);
      
      // Find the care log to delete
      const logToDelete = careLogs.find(log => {
        const logDate = new Date(log.timestamp);
        const logTimeSlot = `${logDate.getHours().toString().padStart(2, '0')}:${logDate.getMinutes().toString().padStart(2, '0')}`;
        return log.dog_id === dogId && logTimeSlot === timeSlot && log.category === category;
      });
      
      // TODO: Implement delete functionality
      toast({
        title: "Potty break removed",
        description: `Removed potty break for ${dogName} at ${timeSlot}`
      });
    } else {
      // Add new care logged
      setCareLogged(prev => ({
        ...prev,
        [key]: true
      }));
      
      // TODO: Implement add functionality
      toast({
        title: "Potty break logged",
        description: `Logged potty break for ${dogName} at ${timeSlot}`
      });
    }
    
    // Refresh care logs
    refresh();
  }, [careLogged, careLogs, refresh, toast]);
  
  return {
    timeSlots,
    careLogs,
    loading,
    error,
    refresh,
    hasCareLogged,
    handleCellClick
  };
};

export default usePottyBreakTable;
