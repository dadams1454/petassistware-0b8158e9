
import React, { useState } from 'react';
import ObservationForm from './ObservationForm';
import ObservationList from './ObservationList';
import { ObservationType } from './ObservationDialog';

interface DialogContentProps {
  dogId: string;
  dogName: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  existingObservations: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  timeSlots?: string[];
  selectedTimeSlot?: string;
  onOpenChange: (open: boolean) => void;
  activeCategory?: string;
  defaultObservationType?: ObservationType;
  originalOnSubmit: (dogId: string, observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
}

const DialogContent: React.FC<DialogContentProps> = ({
  dogId,
  dogName,
  onSubmit,
  existingObservations,
  timeSlots = [],
  selectedTimeSlot = '',
  onOpenChange,
  activeCategory = 'feeding',
  defaultObservationType = 'other',
  originalOnSubmit
}) => {
  const [observation, setObservation] = useState('');
  const [observationType, setObservationType] = useState<ObservationType>(defaultObservationType);
  const [observationDate, setObservationDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlot, setSelectedTimeSlot] = useState(selectedTimeSlot);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the original onSubmit function with the form values
      await originalOnSubmit(dogId, observation, observationType, observationDate);
      
      // Reset form and close dialog on success
      setObservation('');
      setObservationType(defaultObservationType);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <div className="space-y-1">
      {/* Display existing observations if any */}
      {existingObservations.length > 0 && (
        <ObservationList 
          existingObservations={existingObservations} 
          activeCategory={activeCategory}
        />
      )}
      
      {/* Observation Form */}
      <ObservationForm
        observation={observation}
        setObservation={setObservation}
        observationType={observationType}
        setObservationType={setObservationType}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        observationDate={observationDate}
        setObservationDate={setObservationDate}
        timeSlot={timeSlot}
        timeSlots={timeSlots}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
        isMobile={false}
        activeCategory={activeCategory}
      />
    </div>
  );
};

export default DialogContent;
