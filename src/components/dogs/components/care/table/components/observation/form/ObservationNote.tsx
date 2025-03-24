
import React, { memo } from 'react';
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
  const placeholder = activeCategory === 'feeding' 
    ? 'Describe the feeding issue (optional)'
    : 'Add details about your observation (optional)';
    
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Notes</div>
      <Textarea
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        rows={isMobile ? 3 : 4}
      />
      <div className="text-xs text-muted-foreground">
        Leave empty to use the default observation text.
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ObservationNote);
