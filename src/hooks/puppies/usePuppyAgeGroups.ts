
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupData } from '@/types/puppyTracking';

// Standard age groups for puppies
const defaultAgeGroups: PuppyAgeGroup[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    displayName: 'Newborn',
    description: 'Birth to 2 weeks',
    minDays: 0,
    maxDays: 14,
    unit: 'days',
    color: 'bg-blue-100'
  },
  {
    id: 'transitional',
    name: 'Transitional', 
    displayName: 'Transitional',
    description: '2-3 weeks',
    minDays: 15,
    maxDays: 21,
    unit: 'days',
    color: 'bg-green-100'
  },
  {
    id: 'socialization',
    name: 'Socialization',
    displayName: 'Socialization',
    description: '3-7 weeks',
    minDays: 22,
    maxDays: 49,
    unit: 'days',
    color: 'bg-yellow-100'
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    displayName: 'Juvenile',
    description: '7-12 weeks',
    minDays: 50,
    maxDays: 84,
    unit: 'days',
    color: 'bg-orange-100'
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    displayName: 'Adolescent',
    description: '12+ weeks',
    minDays: 85,
    maxDays: 999,
    unit: 'days',
    color: 'bg-red-100'
  }
];

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  // Use the standard age groups
  const ageGroups = defaultAgeGroups;
  
  // Group puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    // Create an empty age group data structure
    const groupedPuppies: PuppyAgeGroupData = {
      newborn: [],
      twoWeek: [],
      fourWeek: [],
      sixWeek: [],
      eightWeek: []
    };
    
    // Initialize empty arrays for each age group
    ageGroups.forEach(group => {
      groupedPuppies[group.id] = [];
    });
    
    // Sort puppies into appropriate age groups
    puppies.forEach(puppy => {
      // Calculate age in days if not provided
      const ageInDays = puppy.ageInDays || puppy.age || 0;
      
      // Find the appropriate age group
      const ageGroup = ageGroups.find(
        group => ageInDays >= group.minDays && ageInDays <= group.maxDays
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
