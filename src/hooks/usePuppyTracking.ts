
import { useEffect, useMemo } from 'react';
import { usePuppyData } from './puppies/usePuppyData';
import { usePuppyStats } from './puppies/usePuppyStats';
import { usePuppyAgeGroups } from './puppies/usePuppyAgeGroups';
import { PuppyWithAge, PuppyAgeGroupData, DEFAULT_AGE_GROUPS } from '@/types/puppyTracking';

export const usePuppyTracking = () => {
  const { puppies, isLoading: puppiesLoading, error: puppiesError } = usePuppyData();
  const { puppyStats, isLoading: statsLoading, error: statsError } = usePuppyStats(puppies);
  const { ageGroups } = usePuppyAgeGroups(puppies);
  
  // Organize puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    const result: Record<string, PuppyWithAge[]> = {};
    
    // Initialize groups with empty arrays
    DEFAULT_AGE_GROUPS.forEach((group, index) => {
      result[`group_${index}`] = [];
    });
    
    // Sort puppies into age groups
    puppies.forEach(puppy => {
      const age = puppy.ageInDays;
      let foundGroup = false;
      
      DEFAULT_AGE_GROUPS.forEach((group, index) => {
        if (age >= group.min && age <= group.max) {
          result[`group_${index}`].push(puppy);
          foundGroup = true;
        }
      });
      
      // If no group found, add to the oldest group
      if (!foundGroup && DEFAULT_AGE_GROUPS.length > 0) {
        const lastGroupIndex = DEFAULT_AGE_GROUPS.length - 1;
        result[`group_${lastGroupIndex}`].push(puppy);
      }
    });
    
    return result;
  }, [puppies]);
  
  return {
    puppies,
    puppyStats,
    ageGroups: DEFAULT_AGE_GROUPS.map((group, index) => ({
      id: `group_${index}`,
      name: group.name,
      startDay: group.min,
      endDay: group.max,
      description: `Puppies between ${group.min} and ${group.max} days old`,
      color: ['pink', 'purple', 'blue', 'green', 'amber', 'orange', 'red', 'gray'][index % 8]
    })) as PuppyAgeGroupData[],
    puppiesByAgeGroup,
    isLoading: puppiesLoading || statsLoading,
    error: puppiesError || statsError
  };
};
