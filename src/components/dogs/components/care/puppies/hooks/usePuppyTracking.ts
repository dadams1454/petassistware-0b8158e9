
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';
import { usePuppyStats } from '@/hooks/puppies/usePuppyStats';
import { PuppyWithAge } from '@/types/puppyTracking';

export const usePuppyTracking = () => {
  // Fetch puppy data
  const { puppies, isLoading: puppiesLoading, error } = usePuppyData();
  
  // Group puppies by age
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(puppies);
  
  // Get puppy statistics
  const { stats, isLoading: statsLoading } = usePuppyStats();

  const isLoading = puppiesLoading || statsLoading;

  return {
    puppies,
    ageGroups,
    puppiesByAgeGroup,
    stats,
    isLoading,
    error
  };
};
