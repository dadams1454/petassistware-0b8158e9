
import React from 'react';
import { ObservationType } from '../../hooks/pottyBreakHooks/observationTypes';
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
    <form onSubmit={onSubmit} className="space-y-6">
      {/* The date selector is now hidden but still functional */}
      <DateTimeSelector 
        observationDate={observationDate}
        setObservationDate={setObservationDate}
      />
      
      {/* Improved type selector with better visual design */}
      <ObservationTypeSelector 
        value={observationType} 
        onChange={setObservationType} 
        isMobile={isMobile}
        activeCategory={activeCategory}
      />
      
      {/* Observation notes */}
      <ObservationNote
        observation={observation}
        setObservation={setObservation}
        activeCategory={activeCategory}
        isMobile={isMobile}
      />
      
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
