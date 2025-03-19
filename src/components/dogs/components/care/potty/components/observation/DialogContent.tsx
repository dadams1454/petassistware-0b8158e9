
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { ObservationType } from '../ObservationDialog';
import RadioGroupOptions from './RadioGroupOptions';
import ObservationNotes from './ObservationNotes';
import DialogActions from './DialogActions';

interface DialogContentProps {
  selectedDog: DogCareStatus | null;
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
  observationNote: string;
  setObservationNote: (note: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isMobile: boolean;
}

const DialogContent: React.FC<DialogContentProps> = ({
  selectedDog,
  observationType,
  setObservationType,
  observationNote,
  setObservationNote,
  onClose,
  onSubmit,
  isLoading = false,
  isMobile
}) => {
  return (
    <>
      <div className="space-y-4 mt-2">
        <div>
          <RadioGroupOptions 
            observationType={observationType}
            setObservationType={setObservationType}
          />
        </div>
        
        <ObservationNotes 
          observationNote={observationNote}
          setObservationNote={setObservationNote}
        />
      </div>
      
      <div className={`mt-4 ${isMobile ? 'flex justify-end gap-2' : ''}`}>
        <DialogActions 
          onClose={onClose}
          onSubmit={onSubmit}
          isValid={observationNote.trim().length > 0}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      </div>
    </>
  );
};

export default DialogContent;
