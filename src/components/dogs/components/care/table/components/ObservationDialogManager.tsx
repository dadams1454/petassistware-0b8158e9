
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ObservationDialog from './observation/ObservationDialog';

type ObservationType = 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';

interface ObservationDialogManagerProps {
  selectedDog: DogCareStatus | null;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dogId: string, observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
  observations: Array<{dogId: string, text: string, type: string, timeSlot?: string, category?: string, timestamp?: string}>;
  timeSlots: string[];
  isMobile: boolean;
  activeCategory: string;
  selectedTimeSlot: string;
}

/**
 * Manages the observation dialog for adding/viewing dog observations
 */
const ObservationDialogManager: React.FC<ObservationDialogManagerProps> = ({
  selectedDog,
  observationDialogOpen,
  onOpenChange,
  onSubmit,
  observations,
  timeSlots,
  isMobile,
  activeCategory,
  selectedTimeSlot
}) => {
  if (!selectedDog) return null;
  
  // Filter observations to only show those for the selected dog
  const dogObservations = observations.filter(o => o.dogId === selectedDog.dog_id);
  
  return (
    <ObservationDialog
      dog={selectedDog}
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      onSubmit={(observation, observationType, timestamp) => 
        onSubmit(selectedDog.dog_id, observation, observationType as ObservationType, timestamp)
      }
      observations={dogObservations}
      timeSlots={timeSlots}
      isMobile={isMobile}
      activeCategory={activeCategory}
      selectedTimeSlot={selectedTimeSlot}
    />
  );
};

export default ObservationDialogManager;
