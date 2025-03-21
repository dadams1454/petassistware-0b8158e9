
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
  
  return (
    <ObservationDialog
      dog={selectedDog}
      open={observationDialogOpen}
      onOpenChange={onOpenChange}
      onSubmit={(observation, type, timestamp) => 
        onSubmit(selectedDog.dog_id, observation, type, timestamp)
      }
      observations={observations[selectedDog.dog_id] || []}
      timeSlots={timeSlots}
      isMobile={isMobile}
      activeCategory={activeCategory}
      selectedTimeSlot={selectedTimeSlot}
    />
  );
};

export default ObservationDialogManager;
