
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import DogCareCard from './DogCareCard';
import { DogCareStatus } from '@/types/dailyCare';
import CareLogForm from './CareLogForm';

interface CareCardsViewProps {
  dogsStatus: DogCareStatus[];
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
  selectedCategory: string;
}

const CareCardsView: React.FC<CareCardsViewProps> = ({
  dogsStatus,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess,
  selectedCategory
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {dogsStatus.map((dog) => (
        <Dialog key={dog.dog_id} open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div onClick={() => onLogCare(dog.dog_id)}>
              <DogCareCard dog={dog} />
            </div>
          </DialogTrigger>
          <DialogContent>
            {selectedDogId === dog.dog_id && (
              <CareLogForm 
                dogId={dog.dog_id} 
                onSuccess={onCareLogSuccess} 
                initialCategory={selectedCategory}
              />
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default CareCardsView;
