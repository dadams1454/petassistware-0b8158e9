
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import EventForm from '@/components/events/EventForm';
import EventList from '@/components/calendar/EventList';
import EventDialog from '@/components/calendar/EventDialog';
import EventTypeFilters from '@/components/calendar/EventTypeFilters';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

// Event types for breeding, vet, etc.
export const EVENT_TYPES = [
  'Vet Appointment',
  'Breeding',
  'Whelping',
  'Vaccination',
  'Grooming',
  'Training',
  'Show',
  'Other'
];

// Type for a new event being created
export interface NewEvent {
  title: string;
  description?: string;
  event_date: string;
  status: 'planned' | 'upcoming' | 'completed' | 'cancelled';
  event_type: string;
  is_recurring?: boolean;
  recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'none' | null;
  recurrence_end_date?: string | null;
}

// Type for an existing event with ID
export interface Event extends NewEvent {
  id: string;
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('calendar');
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Load events on mount and when selectedDate changes
  useEffect(() => {
    loadEvents();
  }, []);

  // Check for state passed via router navigation
  useEffect(() => {
    if (location.state) {
      // If a specific event was selected, open it
      if (location.state.selectedEventId) {
        setOpenEventId(location.state.selectedEventId);
        setIsDialogOpen(true);
      }
      
      // If initial event data was provided, open the form dialog
      if (location.state.initialEventData) {
        setIsDialogOpen(true);
      }
      
      // Clean up the location state after handling
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  // Filter events when filters or events change
  useEffect(() => {
    if (events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];
    
    // Apply type filters if any are active
    if (activeFilters.length > 0) {
      filtered = filtered.filter(event => 
        activeFilters.includes(event.event_type)
      );
    }
    
    // Apply date filter if a date is selected
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(event => 
        event.event_date === formattedSelectedDate
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, activeFilters, selectedDate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventData: NewEvent) => {
    try {
      const newEvent = await createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: 'Event created',
        description: 'Your event has been successfully created.',
      });
      return true;
    } catch (err) {
      console.error('Error creating event:', err);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateEvent = async (eventData: Event) => {
    try {
      const updatedEvent = await updateEvent(eventData);
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      toast({
        title: 'Event updated',
        description: 'Your event has been successfully updated.',
      });
      return true;
    } catch (err) {
      console.error('Error updating event:', err);
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setOpenEventId(null);
      setIsDialogOpen(false);
      toast({
        title: 'Event deleted',
        description: 'Your event has been successfully deleted.',
      });
    } catch (err) {
      console.error('Error deleting event:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (eventType: string) => {
    setActiveFilters(prev => {
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      } else {
        return [...prev, eventType];
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  if (loading) {
    return <LoadingState message="Loading calendar events..." />;
  }

  if (error) {
    return <ErrorState title="Error" message={error} onRetry={loadEvents} />;
  }

  // Get selected event if there is one
  const selectedEvent = openEventId 
    ? events.find(event => event.id === openEventId) 
    : undefined;

  // Get initial data from location state
  const initialEventData = location.state?.initialEventData;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Calendar &amp; Events</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Select Date</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md p-3"
                />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Event Types</h3>
                  <EventTypeFilters 
                    eventTypes={EVENT_TYPES}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  onClick={() => {
                    setOpenEventId(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Add New Event
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">
                  {selectedDate ? (
                    <>Events for {format(selectedDate, 'MMMM d, yyyy')}</>
                  ) : (
                    <>All Events</>
                  )}
                </h3>
                
                <EventList 
                  events={filteredEvents} 
                  onEventClick={(eventId) => {
                    setOpenEventId(eventId);
                    setIsDialogOpen(true);
                  }}
                  selectedDate={selectedDate}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">All Events</h3>
                <Button 
                  onClick={() => {
                    setOpenEventId(null);
                    setIsDialogOpen(true);
                  }}
                  size="sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
              
              <EventList 
                events={events} 
                onEventClick={(eventId) => {
                  setOpenEventId(eventId);
                  setIsDialogOpen(true);
                }}
                showDateHeaders={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EventDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={selectedEvent}
        initialData={initialEventData}
        onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        onClose={() => {
          setOpenEventId(null);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default CalendarPage;
