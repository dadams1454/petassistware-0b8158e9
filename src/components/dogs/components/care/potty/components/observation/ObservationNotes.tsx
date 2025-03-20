
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
      <Label htmlFor="observation">Observation Notes (Optional)</Label>
      <Textarea
        id="observation"
        value={observationNote}
        onChange={(e) => setObservationNote(e.target.value)}
        placeholder="Optional details about the observation"
        className="mt-1"
        rows={4}
      />
    </div>
  );
};

export default ObservationNotes;
