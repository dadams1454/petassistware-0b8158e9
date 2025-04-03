
import { Dog, Litter } from '@/types/litter';

export const calculateWelpingStats = (
  pregnantDogs: Dog[],
  activeWelpings: Litter[],
  recentLitters: Litter[]
) => {
  // Calculate the counts
  const pregnantCount = pregnantDogs.length;
  const activeWelpingsCount = activeWelpings.length;
  
  // Calculate total puppies across all active welpings and recent litters
  const totalPuppiesCount = [...activeWelpings, ...recentLitters].reduce((count, litter) => {
    // Handle potential different field names for puppy count
    const puppyCount = litter.puppy_count || 
                      (litter.male_count && litter.female_count 
                        ? litter.male_count + litter.female_count 
                        : 0);
    
    // Handle puppies array if it exists
    if (Array.isArray(litter.puppies)) {
      return count + litter.puppies.length;
    }
    
    return count + (puppyCount || 0);
  }, 0);
  
  return {
    pregnantCount,
    activeWelpingsCount,
    totalPuppiesCount
  };
};
