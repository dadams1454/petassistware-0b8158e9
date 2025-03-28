
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
      <DialogContent className="sm:max-w-[550px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>
            {isCreating 
              ? (selectedEvent?.id ? 'Edit Event' : 'Create New Event') 
              : 'Event Details'}
          </DialogTitle>
        </DialogHeader>
        
        {isCreating ? (
          <div className="max-h-[70vh] overflow-y-auto">
            <EventForm 
              onSubmit={onSave} 
              initialData={selectedEvent || undefined}
              defaultDate={selectedDate}
            />
          </div>
        ) : (
          selectedEvent && (
            <div className="max-h-[70vh] overflow-y-auto">
              <EventDetails 
                event={selectedEvent} 
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
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
