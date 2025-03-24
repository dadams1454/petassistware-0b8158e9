
import React from 'react';
import ObservationForm from './ObservationForm';
import ObservationList from './ObservationList';

interface DialogContentProps {
  existingObservations: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';
    created_at: string;
    category?: string;
  }>;
  observation: string;
  setObservation: (value: string) => void;
  observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';
  setObservationType: (type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other') => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  observationDate: Date;
  setObservationDate: (date: Date) => void;
  timeSlot?: string;
  timeSlots?: string[];
  selectedTimeSlot?: string;
  setSelectedTimeSlot?: (timeSlot: string) => void;
  isMobile?: boolean;
  activeCategory?: string;
}

const DialogContent: React.FC<DialogContentProps> = ({
  existingObservations,
  observation,
  setObservation,
  observationType,
  setObservationType,
  onSubmit,
  isSubmitting,
  onCancel,
  observationDate,
  setObservationDate,
  timeSlot,
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
  isMobile,
  activeCategory
}) => {
  return (
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
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        observationDate={observationDate}
        setObservationDate={setObservationDate}
        timeSlot={timeSlot}
        timeSlots={timeSlots}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
        isMobile={isMobile}
        activeCategory={activeCategory}
      />
    </>
  );
};

export default DialogContent;
