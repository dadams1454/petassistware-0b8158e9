
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/events/EventForm';
import EventDetails from '@/components/events/EventDetails';
import { Event, NewEvent } from '@/pages/Calendar';

interface EventDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  isCreating: boolean;
  selectedEvent: Event | null;
  selectedDate: Date | undefined;
  onSave: (eventData: NewEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  isCreating,
  selectedEvent,
  selectedDate,
  onSave,
  onEdit,
  onDelete,
  onClose
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isCreating 
              ? (selectedEvent?.id ? 'Edit Event' : 'Create New Event') 
              : 'Event Details'}
          </DialogTitle>
        </DialogHeader>
        
        {isCreating ? (
          <EventForm 
            onSubmit={onSave} 
            initialData={selectedEvent || undefined}
            defaultDate={selectedDate}
          />
        ) : (
          selectedEvent && (
            <EventDetails 
              event={selectedEvent} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        )}
        
        {!isCreating && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
