
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ObservationNoteProps {
  observation: string;
  setObservation: (value: string) => void;
  activeCategory?: string;
  isMobile?: boolean;
}

const ObservationNote: React.FC<ObservationNoteProps> = ({
  observation,
  setObservation,
  activeCategory = 'pottybreaks',
  isMobile = false
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="observation" className="text-sm font-medium">
        Observation Note
      </label>
      <Textarea
        id="observation"
        placeholder="Describe the observation (optional)"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        className={`min-h-[${isMobile ? '80px' : '120px'}] resize-none`}
      />
      <p className="text-xs text-muted-foreground">
        {observation.length === 0 ? 
          "Leave blank to use default observation text" : 
          `Character count: ${observation.length}`
        }
      </p>
    </div>
  );
};

export default ObservationNote;
