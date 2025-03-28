
import { useState, useEffect } from 'react';

/**
 * Hook to manage dialog states for the time table
 */
export const useDialogState = (activeCategory: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  // Auto-close dialog when changing categories
  useEffect(() => {
    if (isDialogOpen) {
      setIsDialogOpen(false);
    }
    if (observationDialogOpen) {
      setObservationDialogOpen(false);
    }
  }, [activeCategory]);

  return {
    isDialogOpen,
    setIsDialogOpen,
    observationDialogOpen,
    setObservationDialogOpen,
    selectedDogId,
    setSelectedDogId
  };
};
