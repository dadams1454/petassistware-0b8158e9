
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface DogObservationNoteProps {
  hasObservation: boolean;
  observationText: string;
  observationType: string;
}

const DogObservationNote: React.FC<DogObservationNoteProps> = ({ 
  hasObservation, 
  observationText, 
  observationType 
}) => {
  if (!hasObservation || !observationText) return null;
  
  // Format the observation type for display
  const getObservationTypeLabel = () => {
    switch (observationType) {
      case 'accident':
        return 'Accident';
      case 'heat':
        return 'Heat cycle';
      case 'behavior':
        return 'Behavior';
      case 'other':
        return 'Note';
      default:
        return 'Observation';
    }
  };
  
  return (
    <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 max-w-[140px]">
      <MessageCircle 
        size={12} 
        className="flex-shrink-0 text-amber-500 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30" 
        aria-label="Observation"
      />
      <span className="truncate" title={observationText}>
        <span className="font-medium">{getObservationTypeLabel()}</span>: {observationText}
      </span>
    </div>
  );
};

export default DogObservationNote;
