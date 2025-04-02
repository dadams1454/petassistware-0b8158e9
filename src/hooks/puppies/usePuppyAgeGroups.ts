
import { useMemo } from 'react';
import { DEFAULT_AGE_GROUPS } from '@/data/puppyAgeGroups';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';

export function usePuppyAgeGroups(puppies: PuppyWithAge[] = []) {
  const ageGroups = useMemo(() => {
    return DEFAULT_AGE_GROUPS.map(group => ({
      ...group,
      minAge: group.startDay,
      maxAge: group.endDay,
      count: 0,
      puppies: []
    }));
  }, []);

  const puppiesByAgeGroup = useMemo(() => {
    if (!puppies || !puppies.length) return {};
    
    const groupedPuppies: Record<string, PuppyWithAge[]> = {};
    
    // Initialize groups
    ageGroups.forEach(group => {
      groupedPuppies[group.id] = [];
    });
    
    // Place puppies in appropriate age groups
    puppies.forEach(puppy => {
      // Ensure puppy has ageInDays property
      const ageInDays = puppy.age_days || puppy.ageInDays || 0;
      
      const matchingGroup = ageGroups.find(
        group => ageInDays >= group.startDay && ageInDays <= group.endDay
      );
      
      if (matchingGroup) {
        if (!groupedPuppies[matchingGroup.id]) {
          groupedPuppies[matchingGroup.id] = [];
        }
        groupedPuppies[matchingGroup.id].push(puppy);
      }
    });
    
    return groupedPuppies;
  }, [puppies, ageGroups]);

  return { ageGroups, puppiesByAgeGroup };
}
