
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ObservationDialog from './observation/ObservationDialog';

interface ObservationDialogManagerProps {
  selectedDog: DogCareStatus | null;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other', timestamp?: Date) => Promise<void>;
  observations: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
    category?: string;
  }>>;
  timeSlots: string[];
  isMobile: boolean;
  activeCategory?: string;
  selectedTimeSlot?: string;
}

const ObservationDialogManager: React.FC<ObservationDialogManagerProps> = ({
  selectedDog,
  observationDialogOpen,
  onOpenChange,
  onSubmit,
  observations,
  timeSlots,
  isMobile,
  activeCategory = 'pottybreaks',
  selectedTimeSlot = ''
}) => {
  if (!selectedDog) return null;
  
  // Get all observations for this dog
  const dogObservations = observations[selectedDog.dog_id] || [];
  
  // Set default observation type as 'other'
  const defaultObservationType = 'other';
  
  return (
    <ObservationDialog
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      dogId={selectedDog.dog_id}
      dogName={selectedDog.dog_name}
      onSubmit={onSubmit}
      existingObservations={dogObservations?.map(obs => ({
        observation: obs.observation,
        observation_type: obs.observation_type,
        created_at: obs.created_at,
        category: obs.category
      })) || []}
      timeSlots={timeSlots}
      isMobile={isMobile}
      activeCategory={activeCategory}
      defaultObservationType={defaultObservationType}
      selectedTimeSlot={selectedTimeSlot}
      dialogTitle="Daily Observation"
    />
  );
};

export default ObservationDialogManager;
