
import React from 'react';
import ObservationDialog, { ObservationType } from './observation/ObservationDialog';
import { DogCareStatus } from '@/types/dailyCare';

interface ObservationDialogManagerProps {
  selectedDog?: DogCareStatus;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dogId: string, observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
  observations?: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  timeSlots?: string[];
  isMobile: boolean;
  activeCategory: string;
}

const ObservationDialogManager: React.FC<ObservationDialogManagerProps> = ({
  selectedDog,
  observationDialogOpen,
  onOpenChange,
  onSubmit,
  observations = [], // Provide default empty array
  timeSlots = [], // Provide default empty array
  isMobile,
  activeCategory
}) => {
  if (!selectedDog) return null;

  // Use safe dog name access
  const dogName = selectedDog.dog_name || 'Unknown Dog';
  const dogId = selectedDog.dog_id;

  // Get appropriate dialog title based on category
  const getDialogTitle = () => {
    switch (activeCategory) {
      case 'pottybreaks':
        return 'Potty Break Observation';
      case 'feeding':
        return 'Feeding Observation';
      case 'medications':
        return 'Medication Observation';
      case 'grooming':
        return 'Grooming Observation';
      default:
        return 'Observation';
    }
  };

  // Get the default observation type based on category
  const getDefaultObservationType = (): ObservationType => {
    switch (activeCategory) {
      case 'pottybreaks':
        return 'accident';
      case 'feeding':
        return 'behavior';
      case 'medications':
        return 'behavior';
      case 'grooming':
        return 'other';
      default:
        return 'other';
    }
  };

  return (
    <ObservationDialog
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      dogId={dogId}
      dogName={dogName}
      onSubmit={onSubmit}
      existingObservations={observations}
      timeSlots={timeSlots}
      isMobile={isMobile}
      activeCategory={activeCategory}
      defaultObservationType={getDefaultObservationType()}
      dialogTitle={getDialogTitle()}
    />
  );
};

export default ObservationDialogManager;
