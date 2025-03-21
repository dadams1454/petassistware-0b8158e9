
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ObservationForm from './ObservationForm';
import ObservationList from './ObservationList';

export type ObservationType = 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';

interface ObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  dogName: string;
  onSubmit: (observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
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
  const [timestamp, setTimestamp] = useState<string>('');
  const [dialogSelectedTimeSlot, setDialogSelectedTimeSlot] = useState<string>(selectedTimeSlot);

  // Update dialog state when props change
  useEffect(() => {
    if (open) {
      // Set the observation type based on the active category
      setObservationType(activeCategory === 'feeding' ? 'feeding' : defaultObservationType);
      
      // Set the selected time slot if provided
      if (selectedTimeSlot) {
        setDialogSelectedTimeSlot(selectedTimeSlot);
      } else if (timeSlots.length > 0) {
        // Default to first time slot if none selected
        setDialogSelectedTimeSlot(timeSlots[0]);
      }
      
      // Update timestamp
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimestamp(timeString);
    }
  }, [open, activeCategory, defaultObservationType, selectedTimeSlot, timeSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow empty observation text, just use the observation type as the text if needed
    let observationText = observation.trim();
    
    if (!observationText) {
      // Default text based on observation type
      if (observationType === 'feeding') {
        observationText = `Didn't eat ${dialogSelectedTimeSlot} meal`;
      } else {
        observationText = `${observationType.charAt(0).toUpperCase() + observationType.slice(1)} observed`;
      }
    }
    
    setIsSubmitting(true);
    try {
      // Always use current time for the timestamp
      const currentTimestamp = new Date();
      
      await onSubmit(observationText, observationType, currentTimestamp);
      setObservation('');
      // Keep the observation type the same for easier repeated entries
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // The dialog content
  const dialogContent = (
    <>
      {existingObservations.length > 0 && (
        <ObservationList 
          existingObservations={existingObservations} 
          activeCategory={activeCategory}
        />
      )}
      
      <ObservationForm
        observation={observation}
        setObservation={setObservation}
        observationType={observationType}
        setObservationType={setObservationType}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => onOpenChange(false)}
        timestamp={timestamp}
        timeSlot={dialogSelectedTimeSlot}
        timeSlots={timeSlots}
        selectedTimeSlot={dialogSelectedTimeSlot}
        setSelectedTimeSlot={setDialogSelectedTimeSlot}
        isMobile={isMobile}
        activeCategory={activeCategory}
      />
    </>
  );
  
  // Use regular Dialog on desktop, Sheet on mobile
  return isMobile ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-auto pb-10">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <span>{dialogTitle}</span>
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
            <span>{dialogTitle}</span>
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
