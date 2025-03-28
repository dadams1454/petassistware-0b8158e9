
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import DialogContentComponent from './DialogContent';

export type ObservationType = 'heat' | 'behavior' | 'other';

interface ObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  dogName: string;
  onSubmit: (dogId: string, observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  timeSlots?: string[];
  isMobile?: boolean;
  activeCategory?: string;
  defaultObservationType?: ObservationType;
  selectedTimeSlot?: string;
  dialogTitle?: string;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  dogName,
  onSubmit,
  existingObservations = [],
  timeSlots = [],
  isMobile = false,
  activeCategory = 'feeding',
  defaultObservationType = 'other',
  selectedTimeSlot = '',
  dialogTitle = 'Observation'
}) => {
  // Use mobile sheet for mobile devices, dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{dialogTitle} for {dogName}</SheetTitle>
          </SheetHeader>
          <DialogContentComponent 
            dogId={dogId}
            dogName={dogName}
            onSubmit={onSubmit}
            existingObservations={existingObservations}
            timeSlots={timeSlots}
            activeCategory={activeCategory}
            defaultObservationType={defaultObservationType}
            selectedTimeSlot={selectedTimeSlot}
            onOpenChange={onOpenChange}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle} for {dogName}</DialogTitle>
        </DialogHeader>
        <DialogContentComponent 
          dogId={dogId}
          dogName={dogName}
          onSubmit={onSubmit}
          existingObservations={existingObservations}
          timeSlots={timeSlots}
          activeCategory={activeCategory}
          defaultObservationType={defaultObservationType}
          selectedTimeSlot={selectedTimeSlot}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
