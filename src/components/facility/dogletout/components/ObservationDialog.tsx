
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { DogCareStatus } from '@/types/dailyCare';
import DialogContentComponent from './observation/DialogContent';

export type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';

interface ObservationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDog: DogCareStatus | null;
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
  observationNote: string;
  setObservationNote: (note: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedDog,
  observationType,
  setObservationType,
  observationNote,
  setObservationNote,
  onSubmit,
  isLoading = false
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-auto max-h-[85vh] pb-10">
            <SheetHeader className="mb-4">
              <SheetTitle>Observation for {selectedDog?.dog_name}</SheetTitle>
            </SheetHeader>
            <DialogContentComponent 
              selectedDog={selectedDog}
              observationType={observationType}
              setObservationType={setObservationType}
              observationNote={observationNote}
              setObservationNote={setObservationNote}
              onClose={() => setIsOpen(false)}
              onSubmit={onSubmit}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Daily Observation for {selectedDog?.dog_name}</DialogTitle>
            </DialogHeader>
            <DialogContentComponent 
              selectedDog={selectedDog}
              observationType={observationType}
              setObservationType={setObservationType}
              observationNote={observationNote}
              setObservationNote={setObservationNote}
              onClose={() => setIsOpen(false)}
              onSubmit={onSubmit}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ObservationDialog;
