
import { useState, useEffect, useCallback } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { getLastDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { ObservationType } from '../components/ObservationDialog';
import { formatDistanceToNow, parseISO, differenceInMinutes } from 'date-fns';

export interface DogWithPottyTime {
  dog: DogCareStatus;
  lastBreak: string | null;
  minutesSinceLastBreak?: number;
}

export const usePottyReminder = (dogs: DogCareStatus[]) => {
  const [dogsWithTimes, setDogsWithTimes] = useState<DogWithPottyTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  const [observationNote, setObservationNote] = useState('');
  const [observationType, setObservationType] = useState<ObservationType>('other');
  const { toast } = useToast();

  // Helper to calculate time difference
  const calculateTimeSinceLastBreak = useCallback((lastBreak: string | null): number | undefined => {
    if (!lastBreak) return undefined;
    
    try {
      const lastBreakDate = parseISO(lastBreak);
      return differenceInMinutes(new Date(), lastBreakDate);
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return undefined;
    }
  }, []);

  // Fetch the latest potty break time for each dog when component mounts or dogs change
  useEffect(() => {
    const fetchLastBreakTimes = async () => {
      if (!dogs || dogs.length === 0) {
        setIsLoading(false);
        setDogsWithTimes([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log('🔍 Fetching last potty break times for', dogs.length, 'dogs');
        const promises = dogs.map(async (dog) => {
          try {
            const lastBreak = await getLastDogPottyBreak(dog.dog_id);
            const lastBreakTime = lastBreak ? lastBreak.session_time : null;
            const minutesSinceLastBreak = calculateTimeSinceLastBreak(lastBreakTime);
            
            return { 
              dog, 
              lastBreak: lastBreakTime,
              minutesSinceLastBreak
            };
          } catch (error) {
            console.error(`Error fetching last potty break for ${dog.dog_name}:`, error);
            return { dog, lastBreak: null };
          }
        });

        const results = await Promise.all(promises);
        console.log('✅ Retrieved potty break data for all dogs');
        setDogsWithTimes(results);
      } catch (error) {
        console.error('❌ Error fetching potty break times:', error);
        toast({
          title: "Error",
          description: "Failed to load potty break information.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (dogs.length > 0) {
      fetchLastBreakTimes();
    } else {
      setIsLoading(false);
    }
  }, [dogs, toast, calculateTimeSinceLastBreak]);

  // Filter dogs that need potty breaks (more than 3 hours since last break or threshold from dog settings)
  // Use the dog's custom threshold if available, otherwise default to 180 minutes (3 hours)
  const needsPottyBreak = dogsWithTimes.filter(({ dog, lastBreak, minutesSinceLastBreak }) => {
    // Default threshold (3 hours = 180 minutes)
    const defaultThresholdMinutes = 180;
    
    // Get dog-specific threshold if available (converted from seconds to minutes)
    const dogSpecificThreshold = dog.potty_alert_threshold 
      ? Math.floor(dog.potty_alert_threshold / 60) 
      : defaultThresholdMinutes;
    
    // If no last break recorded, dog definitely needs a potty break
    if (!lastBreak) return true;
    
    // Compare minutes since last break with threshold
    return (minutesSinceLastBreak ?? defaultThresholdMinutes) >= dogSpecificThreshold;
  });

  // Handler for opening the observation dialog
  const handleObservationClick = useCallback((dog: DogCareStatus) => {
    setSelectedDog(dog);
    setObservationNote('');
    setObservationType('other');
    setDialogOpen(true);
  }, []);

  // Handler for submitting an observation
  const handleSubmitObservation = useCallback(async () => {
    if (!selectedDog || !observationNote.trim()) return;
    
    try {
      // Here you would call your API to add the observation
      // For now, we'll just show a toast
      toast({
        title: "Observation Recorded",
        description: `Added ${observationType} observation for ${selectedDog.dog_name}`,
      });
      
      // Close the dialog and reset the state
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
  }, [selectedDog, observationNote, observationType, toast]);

  return {
    isLoading,
    needsPottyBreak,
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
