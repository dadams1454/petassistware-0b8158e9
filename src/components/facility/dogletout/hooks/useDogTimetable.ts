
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface TimeSlot {
  id: string;
  time: string;
  displayTime: string;
}

export const useDogTimetable = (dogs: DogCareStatus[], date: Date) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Generate time slots from 6am to 10pm
  const generateTimeSlots = useCallback(() => {
    const slots: TimeSlot[] = [];
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    for (let hour = 6; hour <= 22; hour++) {
      const h = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? 'am' : 'pm';
      const time = `${formattedDate}T${hour.toString().padStart(2, '0')}:00:00`;
      const displayTime = `${h}:00 ${ampm}`;
      
      slots.push({
        id: `${formattedDate}-${hour}`,
        time,
        displayTime
      });
    }
    
    return slots;
  }, [date]);
  
  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [generateTimeSlots]);
  
  const toggleDogSelection = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId) 
        : [...prev, dogId]
    );
  };
  
  const clearSelectedDogs = () => {
    setSelectedDogs([]);
  };
  
  return {
    timeSlots,
    isLoading,
    selectedDogs,
    toggleDogSelection,
    clearSelectedDogs
  };
};

export default useDogTimetable;
