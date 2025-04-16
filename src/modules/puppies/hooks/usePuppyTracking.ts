
import { useQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';
import {
  PuppyWithAge,
  PuppyAgeGroup,
  PuppyAgeGroupData,
  PuppyManagementStats,
  PuppyTrackingOptions
} from '../types';
import { mockData } from '../mockData/puppies';

// Standard puppy age groups
const PUPPY_AGE_GROUPS: PuppyAgeGroup[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    minAge: 0,
    maxAge: 14,
    description: '0-2 weeks: Eyes closed, minimal movement'
  },
  {
    id: 'transitional',
    name: 'Transitional',
    minAge: 15,
    maxAge: 21,
    description: '2-3 weeks: Eyes opening, beginning to walk'
  },
  {
    id: 'socialization',
    name: 'Socialization',
    minAge: 22,
    maxAge: 49,
    description: '3-7 weeks: Learning socialization and play'
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    minAge: 50,
    maxAge: 84,
    description: '7-12 weeks: Ready for new homes'
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    minAge: 85,
    maxAge: 365,
    description: '12+ weeks: Growing quickly'
  }
];

/**
 * Hook for tracking puppy data and statistics, organized by age groups
 */
export const usePuppyTracking = (options?: PuppyTrackingOptions): PuppyManagementStats => {
  // In this mockup version, we'll use mock data but structure it in the same way
  // as the real data would be fetched from Supabase

  const {
    data: puppiesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['puppies', options],
    queryFn: async (): Promise<PuppyWithAge[]> => {
      // In the real implementation, we would fetch from Supabase
      // For now, return the mock data with calculated ages
      return mockData.map(puppy => {
        const birthDate = puppy.birth_date;
        let age = 0;
        
        if (birthDate) {
          age = differenceInDays(new Date(), new Date(birthDate));
        }
        
        return {
          ...puppy,
          age,
          age_days: age,
          age_weeks: Math.floor(age / 7),
          ageInDays: age, // For compatibility
          ageInWeeks: Math.floor(age / 7) // For compatibility
        };
      }).filter(puppy => {
        // Apply filters from options
        if (options?.filterByStatus && options.filterByStatus.length > 0) {
          if (!puppy.status || !options.filterByStatus.includes(puppy.status)) {
            return false;
          }
        }
        
        if (options?.filterByGender && options.filterByGender.length > 0) {
          if (!puppy.gender || !options.filterByGender.includes(puppy.gender)) {
            return false;
          }
        }
        
        if (options?.filterByAgeGroup) {
          const ageGroup = PUPPY_AGE_GROUPS.find(group => group.id === options.filterByAgeGroup);
          if (ageGroup) {
            const puppyAge = puppy.age_days || 0;
            if (puppyAge < ageGroup.minAge || puppyAge > ageGroup.maxAge) {
              return false;
            }
          }
        }
        
        if (!options?.includeArchived && puppy.archived) {
          return false;
        }
        
        return true;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Group puppies by age group
  const byAgeGroup: PuppyAgeGroupData = {};
  const puppies = puppiesData || [];
  
  // Initialize all age groups with empty arrays
  PUPPY_AGE_GROUPS.forEach(group => {
    byAgeGroup[group.id] = [];
  });
  
  // Sort puppies into age groups
  puppies.forEach(puppy => {
    const age = puppy.age_days || 0;
    const group = PUPPY_AGE_GROUPS.find(g => age >= g.minAge && age <= g.maxAge);
    if (group) {
      byAgeGroup[group.id].push(puppy);
    }
  });
  
  // Count puppies by status
  const availablePuppies = puppies.filter(p => p.status?.toLowerCase() === 'available').length;
  const reservedPuppies = puppies.filter(p => p.status?.toLowerCase() === 'reserved').length;
  const soldPuppies = puppies.filter(p => p.status?.toLowerCase() === 'sold').length;
  
  // Count puppies by gender
  const maleCount = puppies.filter(p => p.gender?.toLowerCase() === 'male').length;
  const femaleCount = puppies.filter(p => p.gender?.toLowerCase() === 'female').length;
  const unknownGenderCount = puppies.filter(p => !p.gender).length;
  
  // Generate stats object
  return {
    puppies,
    byAgeGroup,
    ageGroups: PUPPY_AGE_GROUPS,
    totalPuppies: puppies.length,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    
    // For backwards compatibility
    activeCount: puppies.length,
    availableCount: availablePuppies,
    reservedCount: reservedPuppies,
    soldCount: soldPuppies,
    currentWeek: Math.ceil(new Date().getTime() / (7 * 24 * 60 * 60 * 1000)),
    
    // Additional stats for dashboard
    total: {
      count: puppies.length,
      male: maleCount,
      female: femaleCount
    },
    byGender: {
      male: maleCount,
      female: femaleCount,
      unknown: unknownGenderCount
    },
    byStatus: {
      available: availablePuppies,
      reserved: reservedPuppies,
      sold: soldPuppies,
      unavailable: puppies.length - availablePuppies - reservedPuppies - soldPuppies
    },
    isLoading,
    error
  };
};
