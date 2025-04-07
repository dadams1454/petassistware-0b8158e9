
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';
import { usePuppyStats } from '@/hooks/puppies/usePuppyStats';
import { 
  PuppyWithAge, 
  PuppyAgeGroupData, 
  PuppyManagementStats, 
  PuppyAgeGroupInfo 
} from '@/types';

/**
 * Hook for tracking and managing puppy data
 * This is the canonical implementation that should be used throughout the application
 * 
 * @returns PuppyManagementStats containing puppy data, statistics, and age groupings
 */
export const usePuppyTracking = (): PuppyManagementStats => {
  // Fetch puppy data
  const { puppies, isLoading: puppiesLoading, error, refetch } = usePuppyData();
  
  // Ensure the puppies have the correct properties
  const processedPuppies = puppies.map(puppy => ({
    ...puppy,
    ageInDays: puppy.ageInDays || puppy.age_days || puppy.age || 0,
    ageInWeeks: puppy.ageInWeeks || Math.floor((puppy.ageInDays || puppy.age_days || puppy.age || 0) / 7),
    ageDescription: getAgeDescription(puppy.ageInDays || puppy.age_days || puppy.age || 0)
  }));
  
  // Group puppies by age
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(processedPuppies);
  
  // Get puppy statistics
  const { 
    totalPuppies = 0,
    availablePuppies = 0,
    reservedPuppies = 0,
    soldPuppies = 0,
    byGender = { male: 0, female: 0, unknown: 0 },
    byStatus = {
      available: 0,
      reserved: 0,
      sold: 0,
      unavailable: 0
    }
  } = usePuppyStats(processedPuppies) || {};

  // Convert PuppyAgeGroup[] to PuppyAgeGroupInfo[]
  const ageGroupInfos: PuppyAgeGroupInfo[] = ageGroups.map(group => ({
    id: group.id,
    name: group.name,
    groupName: group.displayName,
    ageRange: `${group.minDays}-${group.maxDays} ${group.unit}`,
    description: group.description,
    startDay: group.startDay,
    endDay: group.endDay,
    color: group.color,
    milestones: group.milestones,
    minAge: group.minAge,
    maxAge: group.maxAge
  }));

  // Set up puppy age group data structure with correct typing
  const byAgeGroup: PuppyAgeGroupData = {
    newborn: puppiesByAgeGroup.newborn || [],
    twoWeek: puppiesByAgeGroup.twoWeek || [],
    fourWeek: puppiesByAgeGroup.fourWeek || [],
    sixWeek: puppiesByAgeGroup.sixWeek || [],
    eightWeek: puppiesByAgeGroup.eightWeek || [],
    tenWeek: puppiesByAgeGroup.tenWeek || [],
    twelveWeek: puppiesByAgeGroup.twelveWeek || [],
    older: puppiesByAgeGroup.older || [],
    all: processedPuppies
  };

  // Construct PuppyManagementStats object
  return {
    // Core data
    puppies: processedPuppies,
    totalPuppies,
    
    // Age grouping data
    ageGroups: ageGroupInfos,
    puppiesByAgeGroup,
    byAgeGroup,
    
    // Status counts
    byStatus,
    byGender,
    
    // Named counts for easier access
    activeCount: totalPuppies,
    reservedCount: reservedPuppies,
    availableCount: availablePuppies,
    soldCount: soldPuppies,
    
    // Legacy properties
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    
    // Utility values
    currentWeek: Math.ceil(new Date().getTime() / (7 * 24 * 60 * 60 * 1000)),
    
    // State
    isLoading: puppiesLoading,
    error,
    refetch,
    
    // Extended statistics
    total: {
      count: totalPuppies,
      male: byGender.male || 0,
      female: byGender.female || 0
    }
  };
};

/**
 * Helper function to generate a human-readable age description
 */
function getAgeDescription(ageInDays: number): string {
  if (ageInDays < 7) {
    return `${ageInDays} days old`;
  } else if (ageInDays < 30) {
    const weeks = Math.floor(ageInDays / 7);
    const remainingDays = ageInDays % 7;
    return remainingDays > 0 
      ? `${weeks} weeks, ${remainingDays} days old` 
      : `${weeks} weeks old`;
  } else if (ageInDays < 365) {
    const months = Math.floor(ageInDays / 30);
    return `${months} months old`;
  } else {
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    return months > 0 
      ? `${years} years, ${months} months old` 
      : `${years} years old`;
  }
}
