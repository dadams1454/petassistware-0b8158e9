
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { format } from 'date-fns';

// Import the new components
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import EventList from '@/components/calendar/EventList';
import EventTypeFilters from '@/components/calendar/EventTypeFilters';
import EventDialog from '@/components/calendar/EventDialog';

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  status: 'upcoming' | 'planned' | 'completed' | 'cancelled';
  event_type: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string | null;
};

export type NewEvent = Omit<Event, 'id'> & { id?: string };

// Event type options
export const EVENT_TYPES = [
  'Breeding',
  'Whelping',
  'Vaccination',
  'Vet Appointment',
  'Show',
  'Training',
  'Grooming',
  'Puppy Pickup',
  'Other'
];

// Define event colors for different event types
export const EVENT_COLORS: Record<string, { bg: string, text: string }> = {
  'Breeding': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  'Whelping': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
  'Vaccination': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  'Vet Appointment': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-400' },
  'Show': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  'Training': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' },
  'Grooming': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400' },
  'Puppy Pickup': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  'Other': { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-400' }
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(EVENT_TYPES);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
      setDialogOpen(false);
      setSelectedEvent(null);
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
      setDialogOpen(false);
      setSelectedEvent(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => activeFilters.includes(event.event_type));
  }, [events, activeFilters]);

  // Get events for the selected date from filtered events
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const eventsOnSelectedDate = filteredEvents.filter(
    event => event.event_date.startsWith(selectedDateStr)
  );

  // Find dates that have events (for calendar highlighting)
  const eventDates = filteredEvents.map(event => new Date(event.event_date));
  
  const handleCreateEvent = () => {
    setIsCreating(true);
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setIsCreating(false);
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setIsCreating(true);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteMutation.mutate(selectedEvent.id);
    }
  };

  const handleSaveEvent = (eventData: NewEvent) => {
    if (selectedEvent && !isCreating) {
      return;
    }
    
    if (selectedEvent && isCreating) {
      // Update existing event
      updateMutation.mutate({ 
        id: selectedEvent.id, 
        ...eventData 
      });
    } else {
      // Create new event
      createMutation.mutate(eventData);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
    setIsCreating(false);
  };

  const toggleFilter = (eventType: string) => {
    if (activeFilters.includes(eventType)) {
      // Remove the filter if it's already active
      setActiveFilters(activeFilters.filter(type => type !== eventType));
    } else {
      // Add the filter if it's not active
      setActiveFilters([...activeFilters, eventType]);
    }
  };

  const selectAllFilters = () => {
    setActiveFilters([...EVENT_TYPES]);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Event Calendar</h1>
          <div className="flex gap-2">
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
              className="flex items-center gap-2"
            >
              <Plus size={16} />
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
            onEventClick={handleViewEvent}
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
          onClose={closeDialog}
        />
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
