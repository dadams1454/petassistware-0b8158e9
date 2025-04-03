
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';
import { usePuppyStats } from '@/hooks/puppies/usePuppyStats';
import { PuppyWithAge, PuppyAgeGroupData, PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyTracking = (): PuppyManagementStats => {
  // Fetch puppy data
  const { puppies, isLoading: puppiesLoading, error } = usePuppyData();
  
  // Group puppies by age
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(puppies);
  
  // Get puppy statistics
  const { 
    totalPuppies = 0,
    availablePuppies = 0,
    reservedPuppies = 0,
    soldPuppies = 0,
    byGender = { male: 0, female: 0, unknown: 0 },
    byStatus = {},
    byAgeGroup = {}
  } = usePuppyStats(puppies) || {};

  const isLoading = puppiesLoading;

  return {
    puppies,
    ageGroups,
    puppiesByAgeGroup,
    totalPuppies,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading,
    error,
    total: {
      count: totalPuppies,
      male: byGender.male || 0,
      female: byGender.female || 0
    },
    byGender,
    byStatus,
    byAgeGroup
  };
};
