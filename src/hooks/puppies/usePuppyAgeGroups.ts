
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupData } from '@/types/puppyTracking';

// Define puppy age groups
const AGE_GROUPS: PuppyAgeGroup[] = [
  {
    id: 'neonatal',
    name: 'Neonatal',
    ageRangeStart: 0,
    ageRangeEnd: 14,
    description: 'Birth to 2 weeks',
    color: 'bg-pink-100'
  },
  {
    id: 'transitional',
    name: 'Transitional',
    ageRangeStart: 15,
    ageRangeEnd: 21,
    description: '2-3 weeks',
    color: 'bg-purple-100'
  },
  {
    id: 'socialization',
    name: 'Socialization',
    ageRangeStart: 22,
    ageRangeEnd: 49,
    description: '3-7 weeks',
    color: 'bg-blue-100'
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    ageRangeStart: 50,
    ageRangeEnd: 84,
    description: '7-12 weeks',
    color: 'bg-green-100'
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    ageRangeStart: 85,
    ageRangeEnd: 365,
    description: '12+ weeks',
    color: 'bg-yellow-100'
  }
];

export const usePuppyAgeGroups = (puppies: PuppyWithAge[] = []) => {
  // Group puppies by age group
  const { ageGroups, puppiesByAgeGroup } = useMemo(() => {
    const groupedPuppies: Record<string, PuppyWithAge[]> = {};
    
    // Initialize with all age groups (even empty ones)
    AGE_GROUPS.forEach(group => {
      groupedPuppies[group.id] = [];
    });
    
    // Sort each puppy into the appropriate age group
    puppies.forEach(puppy => {
      if (puppy.age === undefined) return;
      
      const ageGroup = AGE_GROUPS.find(
        group => puppy.age! >= group.ageRangeStart && puppy.age! <= group.ageRangeEnd
      );
      
      if (ageGroup) {
        puppy.ageGroup = ageGroup.id;
        groupedPuppies[ageGroup.id].push(puppy);
      }
    });
    
    // Convert to array format for easier consumption
    const puppiesByAgeGroup: PuppyAgeGroupData[] = AGE_GROUPS.map(group => ({
      ageGroup: group,
      puppies: groupedPuppies[group.id] || []
    })).filter(group => group.puppies.length > 0);
    
    return {
      ageGroups: AGE_GROUPS,
      puppiesByAgeGroup
    };
  }, [puppies]);
  
  return {
    ageGroups,
    puppiesByAgeGroup
  };
};
