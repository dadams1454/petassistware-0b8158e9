import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import DialogContentComponent from './DialogContent';

export type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';

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
  activeCategory = 'pottybreaks',
  defaultObservationType = 'other',
  selectedTimeSlot = '',
  dialogTitle = 'Observation'
}) => {
  const [observation, setObservation] = useState('');
  const [observationType, setObservationType] = useState<ObservationType>(defaultObservationType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [observationDate, setObservationDate] = useState<Date>(new Date());
  const [dialogSelectedTimeSlot, setDialogSelectedTimeSlot] = useState<string>(selectedTimeSlot);

  // Always use the current date and time
  const currentDateTime = useMemo(() => new Date(), [open]);

  // Update observation type and reset form when the dialog opens
  useEffect(() => {
    if (open) {
      // Reset the observation type to default
      setObservationType(defaultObservationType);
      
      // Set the selected time slot if provided
      if (selectedTimeSlot) {
        setDialogSelectedTimeSlot(selectedTimeSlot);
      } else if (timeSlots.length > 0) {
        // Default to first time slot if none selected
        setDialogSelectedTimeSlot(timeSlots[0]);
      }
      
      // Always use current date/time when dialog opens
      setObservationDate(currentDateTime);
      
      // Reset observation text
      setObservation('');
    }
  }, [open, activeCategory, defaultObservationType, selectedTimeSlot, timeSlots, currentDateTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow empty observation text, just use the observation type as the text if needed
    let observationText = observation.trim();
    
    if (!observationText) {
      // Default text based on observation type
      observationText = `${observationType.charAt(0).toUpperCase() + observationType.slice(1)} observed`;
    }
    
    setIsSubmitting(true);
    try {
      // Use the observation date that was set
      await onSubmit(dogId, observationText, observationType, observationDate);
      setObservation('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // The dialog content
  const dialogContent = (
    <DialogContentComponent
      existingObservations={existingObservations}
      observation={observation}
      setObservation={setObservation}
      observationType={observationType}
      setObservationType={setObservationType}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={() => onOpenChange(false)}
      observationDate={observationDate}
      setObservationDate={setObservationDate}
      timeSlot={dialogSelectedTimeSlot}
      timeSlots={timeSlots}
      selectedTimeSlot={dialogSelectedTimeSlot}
      setSelectedTimeSlot={setDialogSelectedTimeSlot}
      isMobile={isMobile}
      activeCategory={activeCategory}
    />
  );
  
  // Create a more specific title with the dog's name
  const fullTitle = `${dialogTitle} for ${dogName}`;
  
  // Use regular Dialog on desktop, Sheet on mobile
  return isMobile ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-auto pb-10">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <span>{fullTitle}</span>
          </SheetTitle>
        </SheetHeader>
        {dialogContent}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{fullTitle}</span>
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
