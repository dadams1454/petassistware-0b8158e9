
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';

export const usePuppyTracking = () => {
  // Fetch puppy data
  const { puppies, isLoading, error } = usePuppyData();
  
  // Group puppies by age
  const { ageGroups } = usePuppyAgeGroups(puppies);

  return {
    puppies,
    ageGroups,
    isLoading,
    error
  };
};
