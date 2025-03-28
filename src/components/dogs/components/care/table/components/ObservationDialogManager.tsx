
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ObservationDialog, { ObservationType } from './observation/ObservationDialog';

interface ObservationDialogManagerProps {
  selectedDog?: DogCareStatus;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dogId: string, observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
  observations: Array<{
    observation: string;
    observation_type: string;
    created_at: string;
    category?: string;
  }>;
  timeSlots: string[];
  isMobile?: boolean;
  activeCategory: string;
}

const ObservationDialogManager: React.FC<ObservationDialogManagerProps> = ({
  selectedDog,
  observationDialogOpen,
  onOpenChange,
  onSubmit,
  observations,
  timeSlots,
  isMobile = false,
  activeCategory
}) => {
  if (!selectedDog) {
    return null;
  }

  // Determine default observation type based on category
  const getDefaultObservationType = (): ObservationType => {
    switch (activeCategory) {
      case 'pottybreaks':
        return 'accident';
      case 'medication':
        return 'other';
      case 'feeding':
        return 'other';
      default:
        return 'other';
    }
  };

  return (
    <ObservationDialog
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      dogId={selectedDog.dog_id}
      dogName={selectedDog.dog_name}
      onSubmit={onSubmit}
      existingObservations={observations}
      timeSlots={timeSlots}
      isMobile={isMobile}
      activeCategory={activeCategory}
      defaultObservationType={getDefaultObservationType()}
      dialogTitle={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Observation`}
    />
  );
};

export default ObservationDialogManager;
