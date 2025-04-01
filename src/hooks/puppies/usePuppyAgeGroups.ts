
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { DEFAULT_AGE_GROUPS } from '@/data/puppyAgeGroups';

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  // Use the default age groups for now
  // In the future this could be customized by the breeder
  const ageGroups = DEFAULT_AGE_GROUPS;

  // Calculate which puppies belong to which age group
  const puppiesByAgeGroup = useMemo(() => {
    return puppies.reduce((groups: Record<string, PuppyWithAge[]>, puppy) => {
      const ageGroup = ageGroups.find(
        group => puppy.ageInDays >= group.startDay && puppy.ageInDays <= group.endDay
      );
      
      if (ageGroup) {
        if (!groups[ageGroup.id]) {
          groups[ageGroup.id] = [];
        }
        groups[ageGroup.id].push(puppy);
      }
      
      return groups;
    }, {});
  }, [puppies, ageGroups]);

  return {
    ageGroups,
    puppiesByAgeGroup
  };
};
