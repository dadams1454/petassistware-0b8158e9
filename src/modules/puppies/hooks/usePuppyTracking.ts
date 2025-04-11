
/**
 * Main hook for tracking and managing puppy data
 */
import { usePuppyData } from './usePuppyData';
import { usePuppyAgeGroups } from './usePuppyAgeGroups';
import { usePuppyStats } from './usePuppyStats';
import { 
  PuppyManagementStats, 
  PuppyWithAge, 
  PuppyTrackingOptions,
  PuppyAgeGroupData
} from '../types';

/**
 * Hook for tracking and managing puppy data
 * This is the canonical implementation that should be used throughout the application
 * 
 * @param options Optional configuration options
 * @returns PuppyManagementStats containing puppy data, statistics, and age groupings
 */
export const usePuppyTracking = (options?: PuppyTrackingOptions): PuppyManagementStats => {
  // Fetch puppy data
  const { puppies, isLoading, error, refetch } = usePuppyData();
  
  // Apply filters if provided in options
  const filteredPuppies = options ? 
    puppies.filter(puppy => {
      // Filter by status if specified
      if (options.filterByStatus?.length) {
        if (!puppy.status || !options.filterByStatus.includes(puppy.status)) {
          return false;
        }
      }
      
      // Filter by gender if specified
      if (options.filterByGender?.length) {
        if (!puppy.gender || !options.filterByGender.includes(puppy.gender)) {
          return false;
        }
      }
      
      // Include archived puppies if specified
      if (!options.includeArchived && puppy.status?.toLowerCase() === 'archived') {
        return false;
      }
      
      return true;
    }) : puppies;
  
  // Ensure the puppies have the correct age properties
  const processedPuppies = filteredPuppies.map(puppy => ({
    ...puppy,
    ageInDays: puppy.ageInDays || puppy.age_days || puppy.age || 0,
    ageInWeeks: puppy.ageInWeeks || Math.floor((puppy.ageInDays || puppy.age_days || puppy.age || 0) / 7),
    ageDescription: getAgeDescription(puppy.ageInDays || puppy.age_days || puppy.age || 0)
  }));
  
  // Group puppies by age
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(processedPuppies);
  
  // Group puppies by status
  const puppiesByStatus: Record<string, PuppyWithAge[]> = {};
  processedPuppies.forEach(puppy => {
    const status = puppy.status?.toLowerCase() || 'unknown';
    if (!puppiesByStatus[status]) {
      puppiesByStatus[status] = [];
    }
    puppiesByStatus[status].push(puppy);
  });
  
  // Get puppy statistics
  const statsResult = usePuppyStats(processedPuppies);
  
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
    },
    byAgeGroup = {} as Record<string, number>
  } = statsResult;

  // Set male and female counts
  const maleCount = byGender.male || 0;
  const femaleCount = byGender.female || 0;

  // Convert PuppyAgeGroup[] to PuppyAgeGroupInfo[]
  const ageGroupInfos = ageGroups;

  // Set up puppy age group data structure with correct typing
  const byAgeGroupData: PuppyAgeGroupData = {
    newborn: puppiesByAgeGroup.newborn || [],
    twoWeek: puppiesByAgeGroup.twoWeek || [],
    fourWeek: puppiesByAgeGroup.fourWeek || [],
    sixWeek: puppiesByAgeGroup.sixWeek || [],
    eightWeek: puppiesByAgeGroup.eightWeek || [],
    tenWeek: puppiesByAgeGroup.tenWeek || [],
    twelveWeek: puppiesByAgeGroup.twelveWeek || [],
    older: puppiesByAgeGroup.older || [],
    all: processedPuppies,
    total: processedPuppies.length
  };

  // Construct PuppyManagementStats object
  return {
    // Core data
    puppies: processedPuppies,
    totalPuppies,
    
    // Age grouping data
    ageGroups: ageGroupInfos,
    puppiesByAgeGroup,
    byAgeGroup: byAgeGroupData,
    
    // Status counts
    byStatus,
    byGender,
    
    // Named counts for easier access
    activeCount: totalPuppies,
    reservedCount: reservedPuppies,
    availableCount: availablePuppies,
    soldCount: soldPuppies,
    
    // Added properties that were missing
    maleCount,
    femaleCount,
    puppiesByStatus,
    
    // Legacy properties
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    
    // Utility values
    currentWeek: Math.ceil(new Date().getTime() / (7 * 24 * 60 * 60 * 1000)),
    
    // State
    isLoading,
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
