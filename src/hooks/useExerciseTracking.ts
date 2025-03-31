
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  ExerciseRecord, 
  ExerciseSummary, 
  recordExercise, 
  getDogExerciseHistory, 
  calculateExerciseSummary 
} from '@/services/exerciseService';

export interface ExerciseFormData {
  exercise_type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  location: string;
  weather_conditions?: string;
  notes?: string;
  timestamp: Date;
}

export function useExerciseTracking(dogId: string) {
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseRecord[]>([]);
  const [summary, setSummary] = useState<ExerciseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Load exercise history
  const loadExerciseHistory = useCallback(async (days: number = 30) => {
    setIsLoading(true);
    try {
      const history = await getDogExerciseHistory(dogId, days);
      setExerciseHistory(history);
      setSummary(calculateExerciseSummary(history));
    } catch (error) {
      console.error('Error loading exercise history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load exercise history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dogId, toast]);
  
  // Add new exercise record
  const addExercise = useCallback(async (data: ExerciseFormData) => {
    setIsSubmitting(true);
    try {
      const exerciseData = {
        dog_id: dogId,
        exercise_type: data.exercise_type,
        duration: data.duration,
        intensity: data.intensity,
        location: data.location,
        weather_conditions: data.weather_conditions,
        notes: data.notes,
        timestamp: data.timestamp.toISOString(),
        performed_by: 'user' // This would normally be the actual user ID
      };
      
      await recordExercise(exerciseData);
      
      toast({
        title: 'Exercise logged',
        description: 'Exercise activity has been recorded successfully',
      });
      
      // Reload exercise history
      await loadExerciseHistory();
      
      return true;
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        title: 'Error',
        description: 'Failed to record exercise',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [dogId, loadExerciseHistory, toast]);
  
  // Load exercise history on mount
  useEffect(() => {
    if (dogId) {
      loadExerciseHistory();
    }
  }, [dogId, loadExerciseHistory]);
  
  return {
    exerciseHistory,
    summary,
    isLoading,
    isSubmitting,
    loadExerciseHistory,
    addExercise
  };
}
