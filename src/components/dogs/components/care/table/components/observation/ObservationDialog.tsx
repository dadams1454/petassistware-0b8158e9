
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ObservationForm from './ObservationForm';
import ObservationList from './ObservationList';

interface ObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  dogName: string;
  onSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
  timeSlot?: string;
  isMobile?: boolean;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  dogName,
  onSubmit,
  existingObservations = [],
  timeSlot = '',
  isMobile = false
}) => {
  const [observation, setObservation] = useState('');
  const [observationType, setObservationType] = useState<'accident' | 'heat' | 'behavior' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timestamp, setTimestamp] = useState<string>('');

  // Update the timestamp whenever the dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimestamp(timeString);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation.trim()) return;
    
    // Add timestamp to observation if provided
    const observationWithTimestamp = timestamp 
      ? `[${timestamp}] ${observation}` 
      : observation;
    
    setIsSubmitting(true);
    try {
      await onSubmit(dogId, observationWithTimestamp, observationType);
      setObservation('');
      setObservationType('other');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // The dialog content
  const dialogContent = (
    <>
      {existingObservations.length > 0 && (
        <ObservationList existingObservations={existingObservations} />
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
        timeSlot={timeSlot}
        isMobile={isMobile}
      />
    </>
  );
  
  // Use regular Dialog on desktop, Sheet on mobile
  return isMobile ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-auto pb-10">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <span>Observation for {dogName}</span>
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
            <span>Daily Observation for {dogName}</span>
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
