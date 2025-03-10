
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Filter, Plus, Repeat } from 'lucide-react';
import EventForm from '@/components/events/EventForm';
import EventDetails from '@/components/events/EventDetails';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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

  // Function to get color styling for an event type
  const getEventTypeStyle = (eventType: string) => {
    return EVENT_COLORS[eventType] || EVENT_COLORS['Other'];
  };

  // Format recurrence pattern for display
  const formatRecurrencePattern = (pattern: string) => {
    const patterns: Record<string, string> = {
      'daily': 'Daily',
      'weekly': 'Weekly',
      'biweekly': 'Every two weeks',
      'monthly': 'Monthly',
      'quarterly': 'Every three months',
      'yearly': 'Yearly'
    };
    return patterns[pattern] || pattern;
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Event Calendar</h1>
          <div className="flex gap-2">
            <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filter
                  {activeFilters.length < EVENT_TYPES.length && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filter By Event Type</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs px-2"
                        onClick={selectAllFilters}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs px-2"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {EVENT_TYPES.map(eventType => {
                      const { bg, text } = getEventTypeStyle(eventType);
                      return (
                        <div key={eventType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-${eventType}`}
                            checked={activeFilters.includes(eventType)}
                            onCheckedChange={() => toggleFilter(eventType)}
                          />
                          <Label htmlFor={`filter-${eventType}`} className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                              {eventType}
                            </span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
          <DashboardCard className="md:col-span-1" noPadding={false}>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full pointer-events-auto"
              modifiers={{
                hasEvent: (date) => 
                  eventDates.some(eventDate => 
                    eventDate.getDate() === date.getDate() && 
                    eventDate.getMonth() === date.getMonth() && 
                    eventDate.getFullYear() === date.getFullYear()
                  )
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgb(243 244 246)',
                  color: 'rgb(79 70 229)'
                }
              }}
            />
          </DashboardCard>

          <DashboardCard 
            className="md:col-span-2"
            title={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            icon={<CalendarIcon size={18} />}
          >
            {activeFilters.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No event types selected. Use the filter to display events.
              </div>
            ) : isLoading ? (
              <div className="py-4 text-center">Loading events...</div>
            ) : eventsOnSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {eventsOnSelectedDate.map(event => {
                  const { bg, text } = getEventTypeStyle(event.event_type);
                  return (
                    <div 
                      key={event.id}
                      className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleViewEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{event.title}</h3>
                            {event.is_recurring && (
                              <Repeat size={16} className="text-slate-400" aria-label="Recurring Event" />
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                          )}
                          {event.is_recurring && (
                            <p className="text-xs text-slate-500 mt-1">
                              Recurs: {formatRecurrencePattern(event.recurrence_pattern || 'none')}
                            </p>
                          )}
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          event.status === 'upcoming' 
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                            : event.status === 'completed'
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : event.status === 'cancelled'
                                ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No events scheduled for this day
              </div>
            )}
          </DashboardCard>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {isCreating 
                  ? (selectedEvent ? 'Edit Event' : 'Create New Event') 
                  : 'Event Details'}
              </DialogTitle>
            </DialogHeader>
            
            {isCreating ? (
              <EventForm 
                onSubmit={handleSaveEvent} 
                initialData={selectedEvent || undefined}
                defaultDate={selectedDate}
              />
            ) : (
              selectedEvent && (
                <EventDetails 
                  event={selectedEvent} 
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              )
            )}
            
            {!isCreating && (
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
