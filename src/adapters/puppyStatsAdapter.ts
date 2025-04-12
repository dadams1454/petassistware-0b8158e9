
import { PuppyWithAge, PuppyAgeGroupInfo, PuppyManagementStats } from '@/types/puppyTracking';
import { puppyAgeGroups } from '@/data/puppyAgeGroups';

/**
 * Adapts legacy puppy stats data to conform to the PuppyManagementStats interface
 */
export function adaptPuppyStats(
  data: {
    puppies: PuppyWithAge[];
    totalPuppies: number;
    availablePuppies?: number;
    reservedPuppies?: number;
    soldPuppies?: number;
    puppiesByStatus?: Record<string, PuppyWithAge[]>;
    byGender?: Record<string, number>;
    byStatus?: Record<string, number>;
  },
  loading = false,
  error: any = null
): PuppyManagementStats {
  // Create a new object that conforms to PuppyManagementStats
  const adaptedStats: PuppyManagementStats = {
    // Core data
    puppies: data.puppies || [],
    totalPuppies: data.totalPuppies || 0,
    
    // Age grouping data
    ageGroups: puppyAgeGroups,
    puppiesByAgeGroup: groupPuppiesByAge(data.puppies || []),
    byAgeGroup: createAgeGroupData(data.puppies || []),
    
    // Status counts - ensure they exist
    byStatus: data.byStatus || {},
    byGender: {
      male: data.byGender?.male || 0,
      female: data.byGender?.female || 0,
      unknown: data.byGender?.unknown || 0
    },
    
    // Named counts - ensure both legacy and new property names
    activeCount: 
      data.byStatus?.Active || 
      data.puppies?.filter(p => p.status === 'Active').length || 
      0,
    reservedCount: 
      data.byStatus?.Reserved || 
      data.reservedPuppies || 
      data.puppies?.filter(p => p.status === 'Reserved').length || 
      0,
    availableCount: 
      data.byStatus?.Available || 
      data.availablePuppies || 
      data.puppies?.filter(p => p.status === 'Available').length || 
      0,
    soldCount: 
      data.byStatus?.Sold || 
      data.soldPuppies || 
      data.puppies?.filter(p => p.status === 'Sold').length || 
      0,
    
    // Gender counts
    maleCount: data.byGender?.male || data.puppies?.filter(p => p.gender === 'Male').length || 0,
    femaleCount: data.byGender?.female || data.puppies?.filter(p => p.gender === 'Female').length || 0,
    
    // Ensure puppiesByStatus exists
    puppiesByStatus: data.puppiesByStatus || {},
    
    // Legacy property names for backward compatibility
    availablePuppies: 
      data.availablePuppies || 
      data.byStatus?.Available || 
      data.puppies?.filter(p => p.status === 'Available').length || 
      0,
    reservedPuppies: 
      data.reservedPuppies || 
      data.byStatus?.Reserved || 
      data.puppies?.filter(p => p.status === 'Reserved').length || 
      0,
    soldPuppies: 
      data.soldPuppies || 
      data.byStatus?.Sold || 
      data.puppies?.filter(p => p.status === 'Sold').length || 
      0,
    
    // Utility values
    currentWeek: getCurrentWeek(),
    
    // State
    isLoading: loading,
    error: error,
    refetch: async () => {
      // This is a placeholder refetch function
      console.log('Refetch called from adapted stats');
      return;
    },
    
    // Extended statistics
    total: {
      count: data.totalPuppies || 0,
      male: data.byGender?.male || 0,
      female: data.byGender?.female || 0
    }
  };
  
  return adaptedStats;
}

/**
 * Groups puppies by age group
 */
function groupPuppiesByAge(puppies: PuppyWithAge[]): Record<string, PuppyWithAge[]> {
  const result: Record<string, PuppyWithAge[]> = {};
  
  // Initialize empty arrays for each age group
  puppyAgeGroups.forEach(group => {
    result[group.id] = [];
  });
  
  // Group puppies by age
  puppies.forEach(puppy => {
    const ageInDays = puppy.ageInDays || puppy.age_days || 0;
    
    // Find the appropriate age group
    const ageGroup = puppyAgeGroups.find(
      group => ageInDays >= group.minDays && ageInDays <= group.maxDays
    );
    
    if (ageGroup) {
      result[ageGroup.id].push(puppy);
    } else {
      // If no matching age group, put in 'older'
      result.older = result.older || [];
      result.older.push(puppy);
    }
  });
  
  return result;
}

/**
 * Creates a PuppyAgeGroupData object
 */
function createAgeGroupData(puppies: PuppyWithAge[]): any {
  const groupedPuppies = groupPuppiesByAge(puppies);
  
  return {
    newborn: groupedPuppies.newborn || [],
    twoWeek: groupedPuppies.twoWeek || [],
    fourWeek: groupedPuppies.fourWeek || [],
    sixWeek: groupedPuppies.sixWeek || [],
    eightWeek: groupedPuppies.eightWeek || [],
    tenWeek: groupedPuppies.tenWeek || [],
    twelveWeek: groupedPuppies.twelveWeek || [],
    older: groupedPuppies.older || [],
    all: puppies,
    total: puppies.length
  };
}

/**
 * Gets the current week for the litter
 */
function getCurrentWeek(): number {
  // This is a placeholder that returns a reasonable value
  return 8;
}
