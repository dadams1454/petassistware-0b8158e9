
import React, { useEffect } from 'react';
import { ObservationType } from './ObservationDialog';
import ObservationTypeSelector from './ObservationTypeSelector';
import DateTimeSelector from './form/DateTimeSelector';
import TimeSlotSelector from './form/TimeSlotSelector';
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
  timestamp: string;
  timeSlot?: string;
  timeSlots?: string[];
  selectedTimeSlot?: string;
  setSelectedTimeSlot?: (timeSlot: string) => void;
  isMobile?: boolean;
  activeCategory?: string;
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  observation,
  setObservation,
  observationType,
  setObservationType,
  onSubmit,
  isSubmitting,
  onCancel,
  timestamp,
  timeSlot = '',
  timeSlots = [],
  selectedTimeSlot = '',
  setSelectedTimeSlot = () => {},
  isMobile = false,
  activeCategory = 'pottybreaks',
  observationDate,
  setObservationDate
}) => {
  // Set the "When did this occur?" field to use the current time slot
  useEffect(() => {
    if (timeSlots.length > 0 && !selectedTimeSlot) {
      setSelectedTimeSlot(getTimeSlotText());
    }
  }, [timeSlots, selectedTimeSlot, setSelectedTimeSlot]);
  
  // Generate human-readable time slot text
  const getTimeSlotText = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };
  
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
        
        {/* Time slot selector when available */}
        {timeSlots.length > 0 && setSelectedTimeSlot && (
          <TimeSlotSelector
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
          />
        )}

        {/* Date and Time selector */}
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
