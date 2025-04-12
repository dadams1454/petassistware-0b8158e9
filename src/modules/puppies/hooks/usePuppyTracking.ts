
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge, PuppyManagementStats } from '@/types/puppyTracking';
import { puppyAgeGroups } from '@/data/puppyAgeGroups';
import { calculateAgeInDays } from '@/utils/dateUtils';
import { adaptPuppyStats } from '@/adapters/puppyStatsAdapter';

/**
 * Options for the puppy tracking hook
 */
export interface PuppyTrackingOptions {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  filterByAgeGroup?: string;
}

/**
 * Calculate the age for a puppy
 */
function calculatePuppyAge(puppy: any): PuppyWithAge {
  const birthDate = puppy.birth_date;
  
  // Skip if no birth date
  if (!birthDate) {
    return {
      ...puppy,
      ageInDays: 0,
      ageInWeeks: 0,
      ageDescription: 'Unknown'
    };
  }
  
  // Calculate age in days
  const ageInDays = calculateAgeInDays(birthDate) || 0;
  const ageInWeeks = Math.floor(ageInDays / 7);
  
  // Determine age description
  let ageDescription = '';
  if (ageInDays < 7) {
    ageDescription = `${ageInDays} days`;
  } else if (ageInDays < 14) {
    ageDescription = `1 week, ${ageInDays % 7} days`;
  } else {
    ageDescription = `${ageInWeeks} weeks`;
    const remainingDays = ageInDays % 7;
    if (remainingDays > 0) {
      ageDescription += `, ${remainingDays} days`;
    }
  }
  
  return {
    ...puppy,
    ageInDays,
    ageInWeeks,
    ageDescription
  };
}

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
      let query = supabase
        .from('puppies')
        .select('*');
      
      // Apply filters
      if (!includeArchived) {
        query = query.eq('archived', false);
      }
      
      if (filterByStatus.length > 0) {
        query = query.in('status', filterByStatus);
      }
      
      if (filterByGender.length > 0) {
        query = query.in('gender', filterByGender);
      }
      
      const { data, error } = await query.order('birth_date', { ascending: false });
      
      if (error) throw error;
      
      // Calculate age for each puppy
      const puppiesWithAge = data.map(calculatePuppyAge);
      
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
