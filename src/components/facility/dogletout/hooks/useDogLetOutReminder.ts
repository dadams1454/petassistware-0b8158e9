
import { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { getLastDogLetOut } from '@/services/dailyCare/dogLetOut/dogLetOutService';
import { ObservationType } from '../components/ObservationDialog';
import { formatDistanceToNow, parseISO } from 'date-fns';

export interface DogWithLetOutTime {
  dog: DogCareStatus;
  lastBreak: string | null;
}

export const useDogLetOutReminder = (dogs: DogCareStatus[]) => {
  const [dogsWithTimes, setDogsWithTimes] = useState<DogWithLetOutTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  const [observationNote, setObservationNote] = useState('');
  const [observationType, setObservationType] = useState<ObservationType>('other');
  const { toast } = useToast();

  // Fetch the latest dog let out time for each dog when component mounts
  useEffect(() => {
    const fetchLastLetOutTimes = async () => {
      setIsLoading(true);
      const promises = dogs.map(async (dog) => {
        try {
          const lastBreak = await getLastDogLetOut(dog.dog_id);
          return { 
            dog, 
            lastBreak: lastBreak ? lastBreak.session_time : null 
          };
        } catch (error) {
          console.error(`Error fetching last dog let out for ${dog.dog_name}:`, error);
          return { dog, lastBreak: null };
        }
      });

      const results = await Promise.all(promises);
      setDogsWithTimes(results);
      setIsLoading(false);
    };

    if (dogs.length > 0) {
      fetchLastLetOutTimes();
    } else {
      setIsLoading(false);
    }
  }, [dogs]);

  // Filter dogs that need to be let out (more than 3 hours since last let out)
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
  
  const needsLetOut = dogsWithTimes.filter(({ lastBreak }) => {
    if (!lastBreak) return true; // No record means they need to be let out
    return parseISO(lastBreak) < threeHoursAgo;
  });

  // Handler for opening the observation dialog
  const handleObservationClick = (dog: DogCareStatus) => {
    setSelectedDog(dog);
    setObservationNote('');
    setObservationType('other');
    setDialogOpen(true);
  };

  // Handler for submitting an observation
  const handleSubmitObservation = async () => {
    if (!selectedDog || !observationNote.trim()) return;
    
    try {
      // Here you would call your API to add the observation
      // For now, we'll just show a toast
      toast({
        title: "Observation Recorded",
        description: `Added ${observationType} observation for ${selectedDog.dog_name}`,
      });
      
      setDialogOpen(false);
      setSelectedDog(null);
      setObservationNote('');
    } catch (error) {
      console.error('Error recording observation:', error);
      toast({
        title: "Error",
        description: "Failed to record observation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    isLoading,
    needsLetOut,
    dialogOpen,
    setDialogOpen,
    selectedDog,
    observationNote,
    setObservationNote,
    observationType,
    setObservationType,
    handleObservationClick,
    handleSubmitObservation
  };
};
