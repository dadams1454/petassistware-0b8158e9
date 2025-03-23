
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ObservationNoteProps {
  observation: string;
  setObservation: (value: string) => void;
  activeCategory: string;
  isMobile: boolean;
}

const ObservationNote: React.FC<ObservationNoteProps> = ({
  observation,
  setObservation,
  activeCategory,
  isMobile
}) => {
  // Get placeholder text based on observation type and category
  const getPlaceholderText = () => {
    if (activeCategory === 'feeding') {
      return "Optional details about the missed meal or feeding issue";
    }
    
    return "Optional details about the observation";
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="observation">
          {activeCategory === 'feeding' 
            ? 'Feeding Notes (Optional)'
            : 'Observation Notes (Optional)'
          }
        </Label>
      </div>
      <Textarea
        id="observation"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder={getPlaceholderText()}
        className="mt-1"
        rows={isMobile ? 3 : 4}
      />
    </div>
  );
};

export default ObservationNote;
