
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import EventForm from '@/components/events/EventForm';
import EventDetails from '@/components/events/EventDetails';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { format } from 'date-fns';

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  status: 'upcoming' | 'planned' | 'completed' | 'cancelled';
  event_type: string;
};

export type NewEvent = Omit<Event, 'id'> & { id?: string };

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
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

  // Get events for the selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const eventsOnSelectedDate = events.filter(
    event => event.event_date.startsWith(selectedDateStr)
  );

  // Find dates that have events
  const eventDates = events.map(event => new Date(event.event_date));
  
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

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Event Calendar</h1>
          <Button 
            onClick={handleCreateEvent} 
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Event
          </Button>
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
            {isLoading ? (
              <div className="py-4 text-center">Loading events...</div>
            ) : eventsOnSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {eventsOnSelectedDate.map(event => (
                  <div 
                    key={event.id}
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => handleViewEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
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
                    <div className="mt-2 text-xs text-slate-500">
                      Type: {event.event_type}
                    </div>
                  </div>
                ))}
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
