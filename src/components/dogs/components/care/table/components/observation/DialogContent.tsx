import React from 'react';
import ObservationForm from './ObservationForm';
import ObservationList from './ObservationList';
import { ObservationType } from '../../hooks/pottyBreakHooks/observationTypes';

interface DialogContentProps {
  existingObservations: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  observation: string;
  setObservation: (value: string) => void;
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
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
    </div>
  );
};

export default DialogContent;
