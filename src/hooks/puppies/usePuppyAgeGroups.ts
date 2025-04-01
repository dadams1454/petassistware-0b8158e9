
import { useMemo } from 'react';
import { PuppyWithAge } from '@/types/puppyTracking';

interface AgeGroup {
  label: string;
  puppies: PuppyWithAge[];
  minAge: number;
  maxAge: number;
}

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  const ageGroups = useMemo(() => {
    // Define age groups
    const groups: AgeGroup[] = [
      { label: 'Neonatal (0-2 weeks)', puppies: [], minAge: 0, maxAge: 14 },
      { label: 'Transitional (2-3 weeks)', puppies: [], minAge: 15, maxAge: 21 },
      { label: 'Socialization (3-12 weeks)', puppies: [], minAge: 22, maxAge: 84 },
      { label: 'Juvenile (3-6 months)', puppies: [], minAge: 85, maxAge: 180 },
      { label: 'Adolescent (6-18 months)', puppies: [], minAge: 181, maxAge: 540 },
    ];
    
    // Sort puppies into groups
    puppies.forEach(puppy => {
      const ageInDays = puppy.ageInDays;
      
      const matchingGroup = groups.find(
        group => ageInDays >= group.minAge && ageInDays <= group.maxAge
      );
      
      if (matchingGroup) {
        matchingGroup.puppies.push(puppy);
      }
    });
    
    return groups;
  }, [puppies]);
  
  return { ageGroups };
};
