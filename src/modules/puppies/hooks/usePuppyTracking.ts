
import { useState, useEffect, useCallback } from 'react';
import { mockPuppies } from '@/modules/puppies/mockData/puppies';
import { 
  PuppyWithAge, 
  PuppyAgeGroup, 
  PuppyManagementStats,
  PuppyTrackingOptions
} from '@/modules/puppies/types';

// Default age groups for puppy development
const DEFAULT_AGE_GROUPS: PuppyAgeGroup[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: '0-2 weeks old',
    min_days: 0,
    max_days: 14,
    sort_order: 0
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: '2-4 weeks old',
    min_days: 15,
    max_days: 28,
    sort_order: 1
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: '4-8 weeks old',
    min_days: 29,
    max_days: 56,
    sort_order: 2
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: '8-12 weeks old',
    min_days: 57,
    max_days: 84,
    sort_order: 3
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: '12+ weeks old',
    min_days: 85,
    max_days: 1000,
    sort_order: 4
  }
];

/**
 * Hook for tracking and grouping puppies by age and other criteria
 * 
 * @param options Configuration options for puppy tracking
 * @returns Statistics and grouped data for puppy management
 */
export const usePuppyTracking = (
  options: PuppyTrackingOptions = {}
): PuppyManagementStats => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    byAgeGroup: {},
    byStatus: {},
    byGender: {},
    ageGroups: DEFAULT_AGE_GROUPS,
    allPuppies: []
  });

  const calculateAge = useCallback((birthdate: string): { days: number; weeks: number } => {
    try {
      const birth = new Date(birthdate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      
      return { days: diffDays, weeks: diffWeeks };
    } catch (e) {
      console.error('Error calculating age:', e);
      return { days: 0, weeks: 0 };
    }
  }, []);

  const getAgeDescription = useCallback((days: number): string => {
    if (days < 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    if (remainingDays === 0) return `${weeks} weeks`;
    return `${weeks} weeks, ${remainingDays} days`;
  }, []);

  const calculateStats = useCallback(() => {
    try {
      setLoading(true);
      console.log('🔄 Calculating puppy statistics...');

      // Use mock data initially as specified in project requirements
      const puppiesData = mockPuppies;
      
      // Calculate age for each puppy
      const puppiesWithAge: PuppyWithAge[] = puppiesData.map(puppy => {
        const { days, weeks } = calculateAge(puppy.birthdate);
        return {
          ...puppy,
          age_days: days,
          age_weeks: weeks,
          age_description: getAgeDescription(days)
        };
      });
      
      // Filter puppies if needed based on options
      let filteredPuppies = [...puppiesWithAge];
      
      if (options.filterByStatus && options.filterByStatus.length > 0) {
        filteredPuppies = filteredPuppies.filter(puppy => 
          options.filterByStatus?.includes(puppy.status)
        );
      }
      
      if (options.filterByGender && options.filterByGender.length > 0) {
        filteredPuppies = filteredPuppies.filter(puppy => 
          options.filterByGender?.includes(puppy.gender)
        );
      }
      
      if (!options.includeArchived) {
        filteredPuppies = filteredPuppies.filter(puppy => 
          puppy.status !== 'archived' && puppy.status !== 'deceased'
        );
      }
      
      // Group puppies by age group
      const byAgeGroup: Record<string, PuppyWithAge[]> = {};
      
      DEFAULT_AGE_GROUPS.forEach(group => {
        byAgeGroup[group.id] = filteredPuppies.filter(puppy => {
          const ageDays = puppy.age_days || 0;
          return ageDays >= group.min_days && ageDays <= group.max_days;
        });
      });
      
      // Group puppies by status
      const byStatus: Record<string, PuppyWithAge[]> = {};
      
      filteredPuppies.forEach(puppy => {
        const status = puppy.status || 'unknown';
        if (!byStatus[status]) {
          byStatus[status] = [];
        }
        byStatus[status].push(puppy);
      });
      
      // Group puppies by gender
      const byGender: Record<string, PuppyWithAge[]> = {};
      
      filteredPuppies.forEach(puppy => {
        const gender = puppy.gender || 'unknown';
        if (!byGender[gender]) {
          byGender[gender] = [];
        }
        byGender[gender].push(puppy);
      });
      
      // If filtering by age group, only include puppies in that group
      if (options.filterByAgeGroup) {
        filteredPuppies = byAgeGroup[options.filterByAgeGroup] || [];
      }
      
      setStats({
        totalPuppies: filteredPuppies.length,
        byAgeGroup,
        byStatus,
        byGender,
        ageGroups: DEFAULT_AGE_GROUPS,
        allPuppies: filteredPuppies
      });
      
      console.log('✅ Puppy statistics calculated:', {
        totalPuppies: filteredPuppies.length,
        ageGroups: Object.keys(byAgeGroup).length,
      });
    } catch (e) {
      console.error('❌ Error calculating puppy statistics:', e);
      setError('Failed to calculate puppy statistics');
    } finally {
      setLoading(false);
    }
  }, [calculateAge, getAgeDescription, options]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return {
    ...stats,
    loading,
    error
  };
};

export default usePuppyTracking;
