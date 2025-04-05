
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';
import { usePuppyStats } from '@/hooks/puppies/usePuppyStats';
import { PuppyWithAge, PuppyAgeGroupData, PuppyManagementStats, PuppyAgeGroup, PuppyAgeGroupInfo } from '@/types/puppyTracking';

export const usePuppyTracking = (): PuppyManagementStats => {
  // Fetch puppy data
  const { puppies, isLoading: puppiesLoading, error } = usePuppyData();
  
  // Ensure the puppies have the correct properties
  const processedPuppies = puppies.map(puppy => {
    return {
      ...puppy,
      ageInDays: puppy.ageInDays || puppy.age || 0,
      ageInWeeks: puppy.ageInWeeks || Math.floor((puppy.ageInDays || puppy.age || 0) / 7),
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
    totalPuppies,
    puppies: processedPuppies,
    ageGroups: ageGroupInfos,
    puppiesByAgeGroup,
    byAgeGroup,
    byStatus,
    byGender,
    activeCount: totalPuppies, // Same as total for backward compatibility
    reservedCount: reservedPuppies,
    availableCount: availablePuppies,
    soldCount: soldPuppies,
    currentWeek: Math.ceil(new Date().getTime() / (7 * 24 * 60 * 60 * 1000)),
    
    // Legacy properties
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading: puppiesLoading,
    error,
    
    // Extended statistics
    total: {
      count: totalPuppies,
      male: byGender.male || 0,
      female: byGender.female || 0
    }
  };
};
