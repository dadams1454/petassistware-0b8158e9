
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';

// Define default puppy age groups
const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'neonatal',
    name: 'Neonatal',
    description: 'Birth to 2 weeks',
    startDay: 0,
    endDay: 14,
    careChecks: ['weight', 'temperature', 'feeding'],
    milestones: ['Eyes open around day 10-14', 'Beginning to hear sounds']
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: '2-3 weeks',
    startDay: 15,
    endDay: 21,
    careChecks: ['weight', 'temperature', 'deworming'],
    milestones: ['First steps', 'Beginning to socialize', 'Teeth starting to emerge']
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: '3-7 weeks',
    startDay: 22,
    endDay: 49,
    careChecks: ['weight', 'socialization', 'vaccination'],
    milestones: ['Start weaning', 'Active play', 'Sensitive period for socialization']
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: '7-12 weeks',
    startDay: 50,
    endDay: 84,
    careChecks: ['weight', 'vaccination', 'training'],
    milestones: ['Most vaccinations done', 'Ready for adoption', 'Initial training']
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: '12+ weeks',
    startDay: 85,
    endDay: 365,
    careChecks: ['weight', 'health check', 'training'],
    milestones: ['Adult teeth coming in', 'May test boundaries', 'Growth spurts']
  }
];

export const usePuppyAgeGroups = (puppies: PuppyWithAge[] = []) => {
  // Group puppies by age group
  const { ageGroups, puppiesByAgeGroup } = useMemo(() => {
    const groupedPuppies: Record<string, PuppyWithAge[]> = {};
    
    // Initialize with all age groups (even empty ones)
    DEFAULT_AGE_GROUPS.forEach(group => {
      groupedPuppies[group.id] = [];
    });
    
    // Sort each puppy into the appropriate age group
    puppies.forEach(puppy => {
      // Use age_days for compatibility with the standardized PuppyWithAge type
      const ageDays = puppy.age_days;
      
      if (ageDays === undefined) return;
      
      const ageGroup = DEFAULT_AGE_GROUPS.find(
        group => ageDays >= group.startDay && ageDays <= group.endDay
      );
      
      if (ageGroup) {
        groupedPuppies[ageGroup.id].push({
          ...puppy,
          // For backward compatibility
          ageGroup: ageGroup.id
        });
      }
    });
    
    return {
      ageGroups: DEFAULT_AGE_GROUPS,
      puppiesByAgeGroup: groupedPuppies
    };
  }, [puppies]);
  
  return {
    ageGroups,
    puppiesByAgeGroup
  };
};
