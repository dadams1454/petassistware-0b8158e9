
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/services/eventService';

export const useDogEvents = (dog: any) => {
  const navigate = useNavigate();

  const { data: events } = useQuery({
    queryKey: ['dogEvents', dog.id],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      // Filter events that mention this dog in the title or description
      return allEvents.filter(event => 
        (event.title?.toLowerCase().includes(dog.name.toLowerCase()) || 
        event.description?.toLowerCase().includes(dog.name.toLowerCase())) &&
        event.status !== 'completed' && 
        event.status !== 'cancelled'
      );
    },
  });

  const upcomingEvents = events?.length || 0;

  const handleAddAppointment = () => {
    navigate('/calendar', { 
      state: { 
        initialEventData: {
          title: `${dog.name}`,
          description: `Dog: ${dog.name} (${dog.breed})`,
          event_type: 'Vet Appointment'
        }
      } 
    });
  };

  // Navigate to calendar with the event selected
  const handleViewEvent = (event: any) => {
    navigate('/calendar', {
      state: {
        selectedEventId: event.id
      }
    });
  };

  // Navigate to calendar with first event when clicking on the notification badge
  const handleViewFirstEvent = () => {
    if (events && events.length > 0) {
      navigate('/calendar', {
        state: {
          selectedEventId: events[0].id
        }
      });
    } else {
      // Fallback to add appointment if no events found
      handleAddAppointment();
    }
  };

  return {
    events,
    upcomingEvents,
    handleAddAppointment,
    handleViewEvent,
    handleViewFirstEvent
  };
};
