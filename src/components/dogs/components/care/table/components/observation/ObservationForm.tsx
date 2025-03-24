
import React from 'react';
import { ObservationType } from './ObservationDialog';
import ObservationTypeSelector from './ObservationTypeSelector';
import DateTimeSelector from './form/DateTimeSelector';
import ObservationNote from './form/ObservationNote';
import FormButtons from './form/FormButtons';

interface ObservationFormProps {
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

const ObservationForm: React.FC<ObservationFormProps> = ({
  observation,
  setObservation,
  observationType,
  setObservationType,
  onSubmit,
  isSubmitting,
  onCancel,
  observationDate,
  setObservationDate,
  timeSlot = '',
  timeSlots = [],
  selectedTimeSlot = '',
  setSelectedTimeSlot = () => {},
  isMobile = false,
  activeCategory = 'pottybreaks'
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        {/* Show type selector only for potty breaks, not for feeding */}
        {activeCategory !== 'feeding' && (
          <ObservationTypeSelector 
            value={observationType} 
            onChange={setObservationType} 
            isMobile={isMobile}
            activeCategory={activeCategory}
          />
        )}
        
        {/* Date selector - simple and minimal */}
        <DateTimeSelector 
          observationDate={observationDate}
          setObservationDate={setObservationDate}
        />
        
        {/* Observation notes */}
        <ObservationNote
          observation={observation}
          setObservation={setObservation}
          activeCategory={activeCategory}
          isMobile={isMobile}
        />
      </div>
      
      {/* Form buttons */}
      <FormButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isMobile={isMobile}
        activeCategory={activeCategory}
      />
    </form>
  );
};

export default ObservationForm;
