
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// Import refactored components
import ObservationTypeSelector from './observationDialog/ObservationTypeSelector';
import ObservationHistory from './observationDialog/ObservationHistory';
import ObservationInput from './observationDialog/ObservationInput';
import ObservationDialogActions from './observationDialog/ObservationDialogActions';

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
  
  // The form content is the same for both mobile and desktop
  const dialogContent = (
    <>
      <ObservationHistory observations={existingObservations} />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <ObservationTypeSelector
            value={observationType}
            onChange={setObservationType}
            isMobile={isMobile}
          />
          
          <ObservationInput
            value={observation}
            onChange={setObservation}
            timeSlot={timeSlot}
            timestamp={timestamp}
            isMobile={isMobile}
          />
        </div>
        
        <div className="mt-4">
          <ObservationDialogActions
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={observation.trim().length > 0}
            isMobile={isMobile}
          />
        </div>
      </form>
    </>
  );
  
  // Use regular Dialog on desktop, Sheet on mobile
  return isMobile ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-auto pb-10">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
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
            <MessageCircle className="h-5 w-5" />
            <span>Daily Observation for {dogName}</span>
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
