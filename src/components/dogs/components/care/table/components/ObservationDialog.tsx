
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ObservationTypeSelector from './observationDialog/ObservationTypeSelector';
import ObservationInput from './observationDialog/ObservationInput';
import ObservationHistory from './observationDialog/ObservationHistory';
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
  timeSlot,
  isMobile = false
}) => {
  // State for form
  const [observation, setObservation] = useState<string>('');
  const [observationType, setObservationType] = useState<'accident' | 'heat' | 'behavior' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentTimestamp, setCurrentTimestamp] = useState<string>('');
  
  // Update timestamp every second when dialog is open
  useEffect(() => {
    if (!open) return;
    
    // Initialize timestamp
    setCurrentTimestamp(new Date().toLocaleTimeString());
    
    // Set up interval to update timestamp
    const intervalId = setInterval(() => {
      setCurrentTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    
    // Clear interval on cleanup
    return () => clearInterval(intervalId);
  }, [open]);
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Initialize form
      setObservation('');
      setObservationType('other');
      setIsSubmitting(false);
    }
  }, [open]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!observation.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(dogId, observation.trim(), observationType);
      
      // Close dialog on successful submission
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if form is valid
  const isFormValid = observation.trim().length > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "w-[95vw] max-w-lg rounded-lg p-4" : ""}>
        <DialogHeader>
          <DialogTitle>{dogName} - Observation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show existing observations if any */}
          {existingObservations.length > 0 && (
            <ObservationHistory observations={existingObservations} />
          )}
          
          {/* Observation type selector */}
          <ObservationTypeSelector 
            value={observationType} 
            onChange={setObservationType} 
            isMobile={isMobile} 
          />
          
          {/* Observation input */}
          <ObservationInput 
            value={observation} 
            onChange={setObservation} 
            timeSlot={timeSlot}
            timestamp={currentTimestamp}
            isMobile={isMobile}
          />
          
          {/* Dialog actions */}
          <ObservationDialogActions 
            onCancel={() => onOpenChange(false)} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            isValid={isFormValid}
            isMobile={isMobile}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
