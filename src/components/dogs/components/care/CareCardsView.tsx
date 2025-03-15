
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DogCareCard from './DogCareCard';
import { DogCareStatus } from '@/types/dailyCare';

interface CareCardsViewProps {
  dogsStatus: DogCareStatus[];
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
}

const CareCardsView: React.FC<CareCardsViewProps> = ({
  dogsStatus,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess,
}) => {
  return (
    <ScrollArea className="h-[60vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
        {dogsStatus.map((dog) => (
          <DogCareCard
            key={dog.dog_id}
            dog={dog}
            onLogCare={onLogCare}
            selectedDogId={selectedDogId}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            onCareLogSuccess={onCareLogSuccess}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default CareCardsView;
