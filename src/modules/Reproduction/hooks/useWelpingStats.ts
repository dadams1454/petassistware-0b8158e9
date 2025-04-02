
import { WelpingStatsResult } from './welpingTypes';

export const calculateWelpingStats = (
  pregnantDogs: any[],
  activeWelpings: any[],
  recentLitters: any[]
): WelpingStatsResult => {
  const pregnantCount = pregnantDogs.length;
  const activeWelpingsCount = activeWelpings.length;
  
  // Calculate total puppies
  const totalPuppiesCount = [...activeWelpings, ...recentLitters].reduce(
    (total, litter: any) => total + (litter.puppy_count || 0), 
    0
  );
  
  return {
    pregnantCount,
    activeWelpingsCount,
    totalPuppiesCount,
  };
};
