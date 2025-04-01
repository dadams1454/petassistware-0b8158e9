
import { useEffect, useMemo } from 'react';
import { usePuppyData } from './puppies/usePuppyData';
import { usePuppyStats } from './puppies/usePuppyStats';
import { usePuppyAgeGroups } from './puppies/usePuppyAgeGroups';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { DEFAULT_AGE_GROUPS } from '@/data/puppyAgeGroups';

export const usePuppyTracking = () => {
  const { puppies, isLoading: puppiesLoading, error: puppiesError } = usePuppyData();
  const { puppyStats, isLoading: statsLoading, error: statsError } = usePuppyStats(puppies);
  const { ageGroups } = usePuppyAgeGroups(puppies);
  
  // Organize puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    const result: Record<string, PuppyWithAge[]> = {};
    
    // Initialize groups with empty arrays
    DEFAULT_AGE_GROUPS.forEach(group => {
      result[group.id] = [];
    });
    
    // Sort puppies into age groups
    puppies.forEach(puppy => {
      const age = puppy.ageInDays;
      const ageGroup = DEFAULT_AGE_GROUPS.find(
        group => age >= group.startDay && age <= group.endDay
      );
      
      if (ageGroup) {
        result[ageGroup.id].push(puppy);
      }
    });
    
    return result;
  }, [puppies]);
  
  return {
    puppies,
    puppyStats,
    ageGroups: DEFAULT_AGE_GROUPS as PuppyAgeGroupData[],
    puppiesByAgeGroup,
    isLoading: puppiesLoading || statsLoading,
    error: puppiesError || statsError
  };
};
