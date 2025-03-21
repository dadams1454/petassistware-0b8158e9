
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ObservationDialog from './observation/ObservationDialog';

interface ObservationDialogManagerProps {
  selectedDog: DogCareStatus | null;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    dogId: string, 
    observation: string, 
    observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other',
    timestamp?: Date
  ) => Promise<void>;
  observations: Record<string, any[]>;
  timeSlots: string[];
  isMobile: boolean;
  activeCategory: string;
  selectedTimeSlot: string;
}

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
  
  // Create a dialog title based on the active category
  const dialogTitle = activeCategory === 'feeding' 
    ? `Feeding Observation for ${selectedDog.dog_name}`
    : `Observation for ${selectedDog.dog_name}`;
  
  return (
    <ObservationDialog
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      dogId={selectedDog.dog_id}
      dogName={selectedDog.dog_name}
      onSubmit={(observation, observationType, timestamp) => 
        onSubmit(selectedDog.dog_id, observation, observationType, timestamp)
      }
      existingObservations={observations[selectedDog.dog_id] || []}
      timeSlots={timeSlots}
      isMobile={isMobile}
      activeCategory={activeCategory}
      defaultObservationType={activeCategory === 'feeding' ? 'feeding' : 'other'}
      selectedTimeSlot={selectedTimeSlot}
      dialogTitle={dialogTitle}
    />
  );
};

export default ObservationDialogManager;
