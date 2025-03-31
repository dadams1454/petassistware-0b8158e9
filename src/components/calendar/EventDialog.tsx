
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventForm from '@/components/events/EventForm';
import EventDetails from '@/components/events/EventDetails';
import { Event, NewEvent } from '@/pages/Calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
  initialData?: Partial<NewEvent>;
  onSave: (data: any) => Promise<boolean>;
  onDelete?: (id: string) => Promise<void>;
  onClose: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
  initialData,
  onSave,
  onDelete,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>(event ? 'details' : 'edit');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (data: NewEvent | Event) => {
    setIsSaving(true);
    const success = await onSave(data);
    setIsSaving(false);
    
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;
    
    setIsDeleting(true);
    await onDelete(event.id);
    setIsDeleting(false);
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {event ? 'Event Details' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>

          {event ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <EventDetails 
                  event={event} 
                  onEdit={() => setActiveTab('edit')}
                  onDelete={() => setConfirmDeleteOpen(true)}
                />
              </TabsContent>
              
              <TabsContent value="edit" className="mt-4">
                <EventForm 
                  onSubmit={handleSubmit} 
                  initialData={event}
                  defaultDate={new Date(event.event_date)}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <EventForm 
              onSubmit={handleSubmit} 
              initialData={initialData}
              defaultDate={initialData?.event_date ? new Date(initialData.event_date) : undefined}
            />
          )}
          
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventDialog;
