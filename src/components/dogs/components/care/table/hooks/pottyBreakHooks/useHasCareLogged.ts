
import { useCallback } from 'react';
import { CareLog } from './careLogsContext';
import { useTimeSlotMatching } from './useTimeSlotMatching';
import { DogCareStatus } from '@/types/dailyCare';

/**
 * Hook for checking if a dog has logged care for a specific time slot and category
 */
export const useHasCareLogged = (
  careLogs: CareLog[],
  activeCategory: string,
  dogs: DogCareStatus[] = []
) => {
  const { matchTimeSlot } = useTimeSlotMatching();

  // Check if a dog has care logged at a specific time slot and category
  const hasCareLogged = useCallback((dogId: string, timeSlot: string, category: string) => {
    // If category doesn't match active category, return false
    if (category !== activeCategory) return false;
    
    // Skip for potty breaks as they're handled separately
    if (category === 'pottybreaks') return false;
    
    // For debugging
    if (category === 'feeding' && dogId) {
      const dogName = dogs.find(d => d.dog_id === dogId)?.dog_name || dogId;
      const hasRecord = careLogs.some(log => {
        if (log.dog_id === dogId && log.category === category) {
          return matchTimeSlot(log, timeSlot, category);
        }
        return false;
      });
      
      if (hasRecord) {
        console.log(`🍽️ Found feeding record for ${dogName} at ${timeSlot}`);
      }
    }
    
    return careLogs.some(log => {
      // Only consider logs for this dog and category
      if (log.dog_id !== dogId || log.category !== category) return false;
      
      // Use our helper to match the time slot
      return matchTimeSlot(log, timeSlot, category);
    });
  }, [careLogs, activeCategory, dogs, matchTimeSlot]);

  return { hasCareLogged };
};
