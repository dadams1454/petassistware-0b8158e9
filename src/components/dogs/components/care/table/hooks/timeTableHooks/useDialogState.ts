
import { useState } from 'react';

export const useDialogState = (activeCategory: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [observationDialogOpen, setObservationDialogOpen] = useState<boolean>(false);
  const [selectedDogId, setSelectedDogId] = useState<string>('');

  return {
    isDialogOpen,
    setIsDialogOpen,
    observationDialogOpen,
    setObservationDialogOpen,
    selectedDogId,
    setSelectedDogId
  };
};
