
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DogSelector from '@/components/dashboard/DogSelector';
import CareLogForm from '@/components/dogs/components/care/CareLogForm';

interface CareLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDogId: string | null;
  onDogSelected: (dogId: string) => void;
  onSuccess: () => void;
}

const CareLogDialog: React.FC<CareLogDialogProps> = ({
  open,
  onOpenChange,
  selectedDogId,
  onDogSelected,
  onSuccess,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="text-xl font-semibold">
          {selectedDogId ? 'Log Daily Care' : 'Select a Dog'}
        </DialogTitle>
        {!selectedDogId ? (
          <DogSelector onDogSelected={onDogSelected} />
        ) : (
          <CareLogForm dogId={selectedDogId} onSuccess={onSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareLogDialog;
