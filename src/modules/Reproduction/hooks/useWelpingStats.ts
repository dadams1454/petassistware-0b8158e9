
import { Litter } from '@/types/litter';
import { Dog } from '@/types/reproductive';

export const calculateWelpingStats = (
  pregnantDogs: Dog[],
  activeWelpings: Litter[],
  recentLitters: Litter[]
) => {
  // Count pregnant dogs
  const pregnantCount = pregnantDogs.length;
  
  // Count active welpings
  const activeWelpingsCount = activeWelpings.length;
  
  // Count total puppies from active welpings and recent litters
  let totalPuppiesCount = 0;
  
  // Add puppies from active welpings
  activeWelpings.forEach(litter => {
    const maleCount = litter.male_count || 0;
    const femaleCount = litter.female_count || 0;
    const puppyCount = litter.puppy_count || 0;
    
    // Use puppy_count if available, otherwise sum male_count and female_count
    totalPuppiesCount += puppyCount > 0 ? puppyCount : (maleCount + femaleCount);
  });
  
  // Add puppies from recent litters
  recentLitters.forEach(litter => {
    const maleCount = litter.male_count || 0;
    const femaleCount = litter.female_count || 0;
    const puppyCount = litter.puppy_count || 0;
    
    // Use puppy_count if available, otherwise sum male_count and female_count
    totalPuppiesCount += puppyCount > 0 ? puppyCount : (maleCount + femaleCount);
  });
  
  return {
    pregnantCount,
    activeWelpingsCount,
    totalPuppiesCount
  };
};
