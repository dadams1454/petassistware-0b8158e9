
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ObservationNotesProps {
  observationNote: string;
  setObservationNote: (note: string) => void;
}

const ObservationNotes: React.FC<ObservationNotesProps> = ({
  observationNote,
  setObservationNote
}) => {
  return (
    <div>
      <Label htmlFor="observation">Observation Notes</Label>
      <Textarea
        id="observation"
        value={observationNote}
        onChange={(e) => setObservationNote(e.target.value)}
        placeholder="Enter your observation (e.g., 'Dog had an accident in kennel' or 'Showing early signs of heat')"
        className="mt-1"
        rows={4}
      />
    </div>
  );
};

export default ObservationNotes;
