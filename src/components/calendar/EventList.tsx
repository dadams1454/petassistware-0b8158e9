
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Event } from '@/types/events';
import { format } from 'date-fns';

// Sample data for testing
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Vet Appointment',
    description: 'Regular checkup',
    event_date: new Date().toISOString(),
    event_type: 'examination',
    status: 'planned',
    is_recurring: false,
    breeder_id: '123'
  },
  {
    id: '2',
    title: 'Vaccination Day',
    description: 'Annual vaccinations',
    event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    event_type: 'vaccination',
    status: 'planned',
    is_recurring: false,
    breeder_id: '123'
  }
];

interface EventListProps {
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  onViewEvent?: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({
  onEditEvent,
  onDeleteEvent,
  onViewEvent
}) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const handleEdit = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditEvent) {
      onEditEvent(event);
    }
  };

  const handleDelete = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(eventId);
    } else {
      // Local deletion for testing
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upcoming Events</h3>
      
      {events && events.length > 0 ? (
        events.map(event => (
          <Card 
            key={event.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onViewEvent && onViewEvent(event)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
                    
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{format(new Date(event.event_date), 'h:mm a')}</span>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm mt-2">{event.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleEdit(event, e)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleDelete(event.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p>No events scheduled</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
