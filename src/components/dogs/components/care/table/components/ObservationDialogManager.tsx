
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ObservationDialog from './observation/ObservationDialog';

interface ObservationDialogManagerProps {
  selectedDog: DogCareStatus | null;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other', timestamp?: Date) => Promise<void>;
  observations: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';
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
  
  // Filter observations based on the current category
  const categoryObservations = observations[selectedDog.dog_id]?.filter(obs => {
    if (activeCategory === 'feeding') {
      return obs.category === 'feeding_observation';
    } else {
      return obs.category !== 'feeding_observation';
    }
  }) || [];
  
  // Set default observation type based on active category
  const defaultObservationType = activeCategory === 'feeding' ? 'feeding' : 'other';
  
  // Get the dialog title based on category
  const dialogTitle = activeCategory === 'feeding' 
    ? `Feeding Observation for ${selectedDog.dog_name}` 
    : `Daily Observation for ${selectedDog.dog_name}`;
  
  return (
    <ObservationDialog
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      dogId={selectedDog.dog_id}
      dogName={selectedDog.dog_name}
      onSubmit={onSubmit}
      existingObservations={categoryObservations?.map(obs => ({
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
      dialogTitle={dialogTitle}
    />
  );
};

export default ObservationDialogManager;
