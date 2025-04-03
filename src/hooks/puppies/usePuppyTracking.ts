
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';
import { usePuppyStats } from '@/hooks/puppies/usePuppyStats';
import { PuppyWithAge, PuppyAgeGroupData, PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyTracking = (): PuppyManagementStats => {
  // Fetch puppy data
  const { puppies, isLoading: puppiesLoading, error } = usePuppyData();
  
  // Ensure the puppies have the correct properties
  const processedPuppies = puppies.map(puppy => {
    return {
      ...puppy,
      ageInDays: puppy.ageInDays || puppy.age_days || puppy.age || 0,
      ageInWeeks: puppy.ageInWeeks || puppy.age_weeks || Math.floor((puppy.age_days || puppy.age || 0) / 7),
    };
  });
  
  // Group puppies by age
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(processedPuppies);
  
  // Get puppy statistics
  const { 
    totalPuppies = 0,
    availablePuppies = 0,
    reservedPuppies = 0,
    soldPuppies = 0,
    byGender = { male: 0, female: 0, unknown: 0 },
    byStatus = {},
    byAgeGroup = {}
  } = usePuppyStats(processedPuppies) || {};

  const isLoading = puppiesLoading;

  // Create the management stats object
  const managementStats: PuppyManagementStats = {
    puppies: processedPuppies,
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
    byAgeGroup,
    // Add stats for compatibility with components that use it
    stats: {
      totalPuppies,
      availablePuppies,
      reservedPuppies,
      soldPuppies,
      byGender,
      byStatus,
      byAgeGroup
    }
  };

  return managementStats;
};
