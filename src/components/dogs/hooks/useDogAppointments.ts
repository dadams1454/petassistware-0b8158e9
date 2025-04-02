
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/services/eventService';
import { DogProfile } from '@/types/dog';

export function useDogAppointments(dogs: DogProfile[]) {
  // Fetch all events
  const { data: allEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
  });
  
  // Get upcoming appointments for each dog
  const dogAppointments = useMemo(() => {
    if (!allEvents) return {};
    
    const appointments: Record<string, number> = {};
    
    allEvents.forEach(event => {
      if (event.status === 'completed' || event.status === 'cancelled') {
        return;
      }
      
      dogs.forEach(dog => {
        if (event.title?.toLowerCase().includes(dog.name.toLowerCase()) || 
            event.description?.toLowerCase().includes(dog.name.toLowerCase())) {
          appointments[dog.id] = (appointments[dog.id] || 0) + 1;
        }
      });
    });
    
    return appointments;
  }, [allEvents, dogs]);

  return dogAppointments;
}
