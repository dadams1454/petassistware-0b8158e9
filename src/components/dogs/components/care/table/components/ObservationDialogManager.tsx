
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ObservationDialog from './observation/ObservationDialog';

interface ObservationDialogManagerProps {
  selectedDog: DogCareStatus | null;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  observations: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>>;
  isMobile: boolean;
}

const ObservationDialogManager: React.FC<ObservationDialogManagerProps> = ({
  selectedDog,
  observationDialogOpen,
  onOpenChange,
  onSubmit,
  observations,
  isMobile
}) => {
  if (!selectedDog) return null;
  
  return (
    <ObservationDialog
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      dogId={selectedDog.dog_id}
      dogName={selectedDog.dog_name}
      onSubmit={onSubmit}
      existingObservations={observations[selectedDog.dog_id]?.map(obs => ({
        observation: obs.observation,
        observation_type: obs.observation_type,
        created_at: obs.created_at
      })) || []}
      isMobile={isMobile}
    />
  );
};

export default ObservationDialogManager;
