
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ObservationInputProps {
  value: string;
  onChange: (value: string) => void;
  timeSlot?: string;
  timestamp?: string;
  isMobile?: boolean;
}

const ObservationInput: React.FC<ObservationInputProps> = ({
  value,
  onChange,
  timeSlot,
  timestamp,
  isMobile = false
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="observation">Observation Notes</Label>
        <span className="text-xs text-muted-foreground">
          {timeSlot ? `Time slot: ${timeSlot}` : timestamp ? `Current time: ${timestamp}` : ''}
        </span>
      </div>
      <Textarea
        id="observation"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your observation (e.g., 'Dog had an accident in kennel' or 'Showing early signs of heat')"
        className="mt-1"
        rows={isMobile ? 3 : 4}
      />
    </div>
  );
};

export default ObservationInput;
