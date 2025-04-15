
import { useQuery } from '@tanstack/react-query';
import { PuppyWithAge, PuppyManagementStats, PuppyTrackingOptions } from '../types';
import { puppyAgeGroups } from '@/data/puppyAgeGroups';
import { fetchPuppies } from '../services/puppyService';

/**
 * Group puppies by their status
 */
function groupPuppiesByStatus(puppies: PuppyWithAge[]): Record<string, PuppyWithAge[]> {
  const result: Record<string, PuppyWithAge[]> = {};
  
  puppies.forEach(puppy => {
    const status = puppy.status || 'Unknown';
    if (!result[status]) {
      result[status] = [];
    }
    result[status].push(puppy);
  });
  
  return result;
}

/**
 * Count puppies by status
 */
function countPuppiesByStatus(puppies: PuppyWithAge[]): Record<string, number> {
  const result: Record<string, number> = {};
  
  puppies.forEach(puppy => {
    const status = puppy.status || 'Unknown';
    if (!result[status]) {
      result[status] = 0;
    }
    result[status]++;
  });
  
  return result;
}

/**
 * Count puppies by gender
 */
function countPuppiesByGender(puppies: PuppyWithAge[]): { male: number; female: number; unknown: number } {
  const result = { male: 0, female: 0, unknown: 0 };
  
  puppies.forEach(puppy => {
    const gender = (puppy.gender || '').toLowerCase();
    if (gender === 'male') {
      result.male++;
    } else if (gender === 'female') {
      result.female++;
    } else {
      result.unknown++;
    }
  });
  
  return result;
}

/**
 * Group puppies by age group
 */
function groupPuppiesByAgeGroup(puppies: PuppyWithAge[]): Record<string, PuppyWithAge[]> {
  const result: Record<string, PuppyWithAge[]> = {};
  
  // Initialize groups
  puppyAgeGroups.forEach(group => {
    result[group.id] = [];
  });
  
  // Default "older" group for puppies that don't fit in other categories
  result.older = [];
  
  puppies.forEach(puppy => {
    // Skip puppies without age
    if (!puppy.ageInDays && puppy.ageInDays !== 0) return;
    
    // Find matching age group
    let matched = false;
    
    for (const group of puppyAgeGroups) {
      if (puppy.ageInDays >= group.minDays && puppy.ageInDays <= group.maxDays) {
        result[group.id].push(puppy);
        matched = true;
        break;
      }
    }
    
    // If no match found, add to "older" group
    if (!matched) {
      result.older.push(puppy);
    }
  });
  
  return result;
}

/**
 * Hook for tracking puppy data with metrics and filtering
 */
export function usePuppyTracking(options: PuppyTrackingOptions = {}): PuppyManagementStats {
  const {
    includeArchived = false,
    filterByStatus = [],
    filterByGender = [],
    filterByAgeGroup = ''
  } = options;
  
  // Query puppies from database
  const { 
    data: puppies = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['puppies', { includeArchived, filterByStatus, filterByGender, filterByAgeGroup }],
    queryFn: async () => {
      // Fetch puppies with filtering
      const puppiesWithAge = await fetchPuppies({
        includeArchived,
        filterByStatus,
        filterByGender
      });
      
      // Filter by age group if specified
      if (filterByAgeGroup) {
        const group = puppyAgeGroups.find(g => g.id === filterByAgeGroup);
        if (group) {
          return puppiesWithAge.filter(
            p => p.ageInDays >= group.minDays && p.ageInDays <= group.maxDays
          );
        }
      }
      
      return puppiesWithAge;
    }
  });
  
  // Process puppies for stats
  const puppiesWithAge = puppies || [];
  const totalPuppies = puppiesWithAge.length;
  
  // Group by status
  const puppiesByStatus = groupPuppiesByStatus(puppiesWithAge);
  
  // Count by status
  const byStatus = countPuppiesByStatus(puppiesWithAge);
  
  // Count by gender
  const byGender = countPuppiesByGender(puppiesWithAge);
  
  // Group by age
  const puppiesByAgeGroup = groupPuppiesByAgeGroup(puppiesWithAge);
  
  // Specific status counts
  const availablePuppies = byStatus['Available'] || 0;
  const reservedPuppies = byStatus['Reserved'] || 0;
  const soldPuppies = byStatus['Sold'] || 0;
  
  // Create the stats object
  const stats: PuppyManagementStats = {
    // Core data
    puppies: puppiesWithAge,
    totalPuppies,
    
    // Age grouping data
    ageGroups: puppyAgeGroups,
    puppiesByAgeGroup,
    byAgeGroup: {
      newborn: puppiesByAgeGroup.newborn || [],
      twoWeek: puppiesByAgeGroup.twoWeek || [],
      fourWeek: puppiesByAgeGroup.fourWeek || [],
      sixWeek: puppiesByAgeGroup.sixWeek || [],
      eightWeek: puppiesByAgeGroup.eightWeek || [],
      tenWeek: puppiesByAgeGroup.tenWeek || [],
      twelveWeek: puppiesByAgeGroup.twelveWeek || [],
      older: puppiesByAgeGroup.older || [],
      all: puppiesWithAge,
      total: totalPuppies
    },
    
    // Status grouping
    byStatus,
    byGender,
    puppiesByStatus,
    
    // Named counts
    activeCount: byStatus['Active'] || 0,
    availableCount: availablePuppies,
    reservedCount: reservedPuppies,
    soldCount: soldPuppies,
    maleCount: byGender.male,
    femaleCount: byGender.female,
    
    // Legacy property names
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    
    // Utility values
    currentWeek: 8, // Default value
    
    // State
    isLoading,
    error,
    refetch
  };
  
  return stats;
}
