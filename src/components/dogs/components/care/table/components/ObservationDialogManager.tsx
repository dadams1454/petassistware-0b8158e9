
import React, { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TableDialogContent from './observation/DialogContent';
import { Observation } from '../hooks/useObservations';

// Define observation type
export type ObservationType = 'accident' | 'heat' | 'behavior' | 'feeding' | 'other';

interface ObservationDialogManagerProps {
  selectedDog: DogCareStatus | undefined;
  observationDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    dogId: string,
    dogName: string,
    observation: string,
    observationType: ObservationType,
    observationDate: Date
  ) => Promise<boolean | undefined>;
  observations: Record<string, Observation[]>;
  timeSlots: string[];
  isMobile: boolean;
  activeCategory: string;
}

const ObservationDialogManager: React.FC<ObservationDialogManagerProps> = ({
  selectedDog,
  observationDialogOpen,
  onOpenChange,
  onSubmit,
  observations,
  timeSlots,
  isMobile,
  activeCategory
}) => {
  // State for observation form
  const [observation, setObservation] = useState("");
  const [observationType, setObservationType] = useState<ObservationType>(
    activeCategory === 'feeding' ? 'feeding' : 'accident'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [observationDate, setObservationDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0] || '');
  
  // Get the existing observations for the selected dog
  const existingObservations = selectedDog 
    ? (observations[selectedDog.dog_id] || [])
        .filter(obs => {
          return activeCategory === 'feeding' 
            ? obs.category === 'feeding_observation'
            : obs.category === 'observation';
        })
        .map(obs => ({
          observation: obs.observation,
          observation_type: obs.observation_type,
          created_at: obs.created_at,
          category: obs.category
        }))
    : [];
    
  // Reset form when dialog opens or dog changes
  useEffect(() => {
    if (observationDialogOpen) {
      setObservation("");
      setObservationType(activeCategory === 'feeding' ? 'feeding' : 'accident');
      setObservationDate(new Date());
      setSelectedTimeSlot(timeSlots[0] || '');
    }
  }, [observationDialogOpen, activeCategory, timeSlots]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDog) return;
    
    setIsSubmitting(true);
    
    try {
      // Use the observation date but adjust time based on selected time slot if needed
      const submissionDate = new Date(observationDate);
      
      // Submit the observation
      const success = await onSubmit(
        selectedDog.dog_id,
        selectedDog.dog_name,
        observation,
        observationType,
        submissionDate
      );
      
      // If successful, close the dialog
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get the dialog title based on category
  const getDialogTitle = () => {
    return activeCategory === 'feeding'
      ? `Add Feeding Note for ${selectedDog?.dog_name || ''}`
      : `Add Observation for ${selectedDog?.dog_name || ''}`;
  };
  
  return (
    <Dialog open={observationDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        {selectedDog && (
          <TableDialogContent
            existingObservations={existingObservations}
            observation={observation}
            setObservation={setObservation}
            observationType={observationType}
            setObservationType={setObservationType}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            timestamp={new Date().toISOString()}
            timeSlot={selectedTimeSlot}
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            isMobile={isMobile}
            activeCategory={activeCategory}
            observationDate={observationDate}
            setObservationDate={setObservationDate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialogManager;
