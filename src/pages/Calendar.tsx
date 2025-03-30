
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import EventList from '@/components/calendar/EventList';
import EventTypeFilters from '@/components/calendar/EventTypeFilters';
import EventDialog from '@/components/calendar/EventDialog';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/eventService';

// Event type definitions
export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  status: 'upcoming' | 'planned' | 'completed' | 'cancelled';
  event_type: string;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  recurrence_end_date: string | null;
  associated_dog_id?: string | null;
  associated_litter_id?: string | null;
}

export type NewEvent = Omit<Event, 'id'>;

// Event type and color constants
export const EVENT_TYPES = [
  'Heat Cycle',
  'Breeding Date',
  'Pregnancy Confirmation',
  'Whelping Due Date',
  'Whelping Day',
  'Puppy Checkup',
  'Vaccination',
  'Deworming',
  'Microchipping',
  'AKC Registration',
  'Puppy Selection',
  'Puppy Go Home Day',
  'Health Testing',
  'Grooming',
  'Show/Competition',
  'Veterinary Appointment',
  'Training Session',
  'Other'
];

export const EVENT_COLORS: Record<string, { bg: string; text: string }> = {
  'Heat Cycle': { bg: 'bg-red-100', text: 'text-red-800' },
  'Breeding Date': { bg: 'bg-pink-100', text: 'text-pink-800' },
  'Pregnancy Confirmation': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'Whelping Due Date': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  'Whelping Day': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Puppy Checkup': { bg: 'bg-sky-100', text: 'text-sky-800' },
  'Vaccination': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  'Deworming': { bg: 'bg-teal-100', text: 'text-teal-800' },
  'Microchipping': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'AKC Registration': { bg: 'bg-green-100', text: 'text-green-800' },
  'Puppy Selection': { bg: 'bg-lime-100', text: 'text-lime-800' },
  'Puppy Go Home Day': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Health Testing': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Grooming': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Show/Competition': { bg: 'bg-rose-100', text: 'text-rose-800' },
  'Veterinary Appointment': { bg: 'bg-red-100', text: 'text-red-800' },
  'Training Session': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Other': { bg: 'bg-gray-100', text: 'text-gray-800' }
};

const Calendar: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(EVENT_TYPES);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const eventData = await fetchEvents();
        setEvents(eventData);
      } catch (error) {
        console.error('Failed to load events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [toast]);

  // Filter events for the selected date
  const eventsOnSelectedDate = selectedDate
    ? events.filter(event => 
        activeFilters.includes(event.event_type) &&
        isSameDay(parseISO(event.event_date), selectedDate)
      )
    : [];

  // Get all dates that have events for the calendar
  const eventDates = events
    .filter(event => activeFilters.includes(event.event_type))
    .map(event => parseISO(event.event_date));

  // Handle event dialog opening
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsCreating(true);
    setDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsCreating(false);
    setDialogOpen(true);
  };

  const handleEditEvent = () => {
    setIsCreating(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
    setIsCreating(true);
  };

  // Handle filter changes
  const toggleFilter = (eventType: string) => {
    setActiveFilters(prev =>
      prev.includes(eventType)
        ? prev.filter(type => type !== eventType)
        : [...prev, eventType]
    );
  };

  const selectAllFilters = () => {
    setActiveFilters(EVENT_TYPES);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  // Event CRUD operations
  const handleSaveEvent = async (eventData: NewEvent) => {
    try {
      if (selectedEvent?.id) {
        // Update existing event
        const updatedEvent = await updateEvent({
          ...eventData,
          id: selectedEvent.id
        });
        
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id ? updatedEvent : event
          )
        );
        
        toast({
          title: 'Success',
          description: 'Event updated successfully',
        });
      } else {
        // Create new event
        const newEvent = await createEvent(eventData);
        setEvents(prev => [...prev, newEvent]);
        
        toast({
          title: 'Success',
          description: 'Event created successfully',
        });
      }
      
      setDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      await deleteEvent(selectedEvent.id);
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      
      setDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <PageHeader 
            title="Calendar"
            subtitle="Manage your appointments and events"
            className="mb-4 md:mb-0"
          />
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <EventTypeFilters 
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              selectAllFilters={selectAllFilters}
              clearAllFilters={clearAllFilters}
              filterMenuOpen={filterMenuOpen}
              setFilterMenuOpen={setFilterMenuOpen}
            />
            
            <Button 
              onClick={handleCreateEvent}
              className="ml-auto md:ml-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CalendarSidebar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            eventDates={eventDates}
          />
          
          <EventList 
            selectedDate={selectedDate}
            eventsOnSelectedDate={eventsOnSelectedDate}
            activeFilters={activeFilters}
            isLoading={isLoading}
            onEventClick={handleEventClick}
          />
        </div>
        
        <EventDialog 
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          isCreating={isCreating}
          selectedEvent={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onClose={handleCloseDialog}
        />
      </div>
    </PageContainer>
  );
};

export default Calendar;
