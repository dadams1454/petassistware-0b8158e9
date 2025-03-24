
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ObservationNoteProps {
  observation: string;
  setObservation: (value: string) => void;
  isMobile?: boolean;
  activeCategory?: string;
}

const ObservationNote: React.FC<ObservationNoteProps> = ({
  observation,
  setObservation,
  isMobile = false,
  activeCategory = 'pottybreaks'
}) => {
  const labelText = activeCategory === 'feeding' 
    ? 'Feeding Issue Notes (Optional)' 
    : 'Observation Notes (Optional)';
    
  const placeholder = activeCategory === 'feeding'
    ? 'Optional details about the feeding issue'
    : 'Optional details about the observation';
    
  return (
    <div>
      <Label htmlFor="observation-note">{labelText}</Label>
      <Textarea
        id="observation-note"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder={placeholder}
        className="mt-1"
        rows={4}
      />
    </div>
  );
};

export default ObservationNote;
