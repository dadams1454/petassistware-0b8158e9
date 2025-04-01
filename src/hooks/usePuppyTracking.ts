
import { usePuppyData } from './puppies/usePuppyData';
import { usePuppyStats } from './puppies/usePuppyStats';
import { usePuppyAgeGroups } from './puppies/usePuppyAgeGroups';

export const usePuppyTracking = () => {
  // Fetch puppy data
  const { puppies, isLoading: isLoadingPuppies, error: puppiesError } = usePuppyData();
  
  // Calculate puppy statistics
  const { puppyStats, isLoading: isLoadingStats, error: statsError } = usePuppyStats(puppies);
  
  // Group puppies by age
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(puppies);

  // Combine loading and error states
  const isLoading = isLoadingPuppies || isLoadingStats;
  const error = puppiesError || statsError;

  return {
    puppies,
    ageGroups,
    puppiesByAgeGroup,
    puppyStats,
    isLoading,
    error
  };
};
