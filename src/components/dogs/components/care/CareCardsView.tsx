
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import DogCareCard from './DogCareCard';
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
  // Display all dogs in the card view
  console.log(`CareCardsView rendering ${dogsStatus.length} dogs with category "${selectedCategory}"`);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {dogsStatus.length > 0 ? (
        dogsStatus.map((dog) => (
          <Dialog key={dog.dog_id} open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div onClick={() => onLogCare(dog.dog_id)}>
                <DogCareCard 
                  dog={dog} 
                  onLogCare={onLogCare}
                  selectedDogId={selectedDogId}
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  onCareLogSuccess={onCareLogSuccess}
                />
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
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center h-[40vh]">
          <p className="text-gray-500">No dogs found</p>
        </div>
      )}
    </div>
  );
};

export default CareCardsView;
