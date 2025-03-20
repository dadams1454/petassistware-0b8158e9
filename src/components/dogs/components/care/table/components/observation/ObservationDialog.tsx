
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
  onSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other', timestamp?: Date) => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
  timeSlot?: string;
  timeSlots?: string[];
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
  timeSlots = [],
  isMobile = false
}) => {
  const [observation, setObservation] = useState('');
  const [observationType, setObservationType] = useState<'accident' | 'heat' | 'behavior' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timestamp, setTimestamp] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Update the timestamp whenever the dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimestamp(timeString);
      
      // Default to current time slot if available
      if (timeSlots.length > 0) {
        // Find current hour
        const currentHour = now.getHours();
        const isPM = currentHour >= 12;
        let hour12 = currentHour % 12;
        if (hour12 === 0) hour12 = 12;
        
        // Create a time slot string in the expected format (e.g. "1:00 PM")
        const currentTimeSlot = `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
        
        // Find the closest match in timeSlots
        const closestSlot = timeSlots.find(slot => slot === currentTimeSlot) || timeSlots[0];
        setSelectedTimeSlot(closestSlot);
      }
    }
  }, [open, timeSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow empty observation text, just use the observation type as the text if needed
    const observationText = observation.trim() || `${observationType.charAt(0).toUpperCase() + observationType.slice(1)} observed`;
    
    setIsSubmitting(true);
    try {
      // Create a date object for the selected time slot if one was selected
      let timestampDate: Date | undefined;
      
      if (selectedTimeSlot) {
        // Parse the time slot (e.g., "2:00 PM")
        const [hourMinute, period] = selectedTimeSlot.split(' ');
        const [hour, minute] = hourMinute.split(':').map(Number);
        
        // Create a new date object for today
        timestampDate = new Date();
        
        // Set the hours and minutes
        let hour24 = hour;
        if (period === 'PM' && hour !== 12) hour24 += 12;
        if (period === 'AM' && hour === 12) hour24 = 0;
        
        timestampDate.setHours(hour24, minute, 0, 0);
      }
      
      await onSubmit(dogId, observationText, observationType, timestampDate);
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
        timeSlots={timeSlots}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
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
