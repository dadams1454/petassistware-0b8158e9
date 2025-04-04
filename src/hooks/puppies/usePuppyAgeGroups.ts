
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupData } from '@/types/puppyTracking';

// Standard age groups for puppies
const defaultAgeGroups: PuppyAgeGroup[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Birth to 2 weeks',
    minAge: 0,
    maxAge: 14,
    unit: 'days'
  },
  {
    id: 'transitional',
    name: 'Transitional', 
    description: '2-3 weeks',
    minAge: 15,
    maxAge: 21,
    unit: 'days'
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: '3-7 weeks',
    minAge: 22,
    maxAge: 49,
    unit: 'days'
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: '7-12 weeks',
    minAge: 50,
    maxAge: 84,
    unit: 'days'
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: '12+ weeks',
    minAge: 85,
    maxAge: 999,
    unit: 'days'
  }
];

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  // Use the standard age groups
  const ageGroups = defaultAgeGroups;
  
  // Group puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    const groupedPuppies: PuppyAgeGroupData = {};
    
    // Initialize empty arrays for each age group
    ageGroups.forEach(group => {
      groupedPuppies[group.id] = [];
    });
    
    // Sort puppies into appropriate age groups
    puppies.forEach(puppy => {
      // Calculate age in days if not provided
      const ageInDays = puppy.ageInDays || puppy.age_days || puppy.age || 0;
      
      // Find the appropriate age group
      const ageGroup = ageGroups.find(
        group => ageInDays >= group.minAge && ageInDays <= group.maxAge
      );
      
      if (ageGroup) {
        if (!groupedPuppies[ageGroup.id]) {
          groupedPuppies[ageGroup.id] = [];
        }
        groupedPuppies[ageGroup.id].push(puppy);
      } else {
        // If no age group found, add to the oldest group as a fallback
        const oldestGroup = ageGroups[ageGroups.length - 1];
        if (!groupedPuppies[oldestGroup.id]) {
          groupedPuppies[oldestGroup.id] = [];
        }
        groupedPuppies[oldestGroup.id].push(puppy);
      }
    });
    
    return groupedPuppies;
  }, [puppies, ageGroups]);
  
  return { ageGroups, puppiesByAgeGroup };
};
