
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';

// Predefined age groups for puppies
const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    startDay: 0,
    endDay: 14,
    description: 'First two weeks after birth',
    color: 'blue',
    milestones: ['Eyes opening', 'Umbilical healing', 'Weight gain'],
    careChecks: ['Warmth', 'Hydration', 'Weight daily']
  },
  {
    id: 'transitional',
    name: 'Transitional',
    startDay: 15,
    endDay: 21,
    description: 'Eyes and ears open, beginning to walk',
    color: 'purple',
    milestones: ['Full mobility', 'Responding to sound', 'Beginning of play'],
    careChecks: ['Socialization', 'Introduction to sounds', 'Weight 3x/week']
  },
  {
    id: 'socialization',
    name: 'Socialization',
    startDay: 22,
    endDay: 49,
    description: 'Critical period for socialization',
    color: 'green',
    milestones: ['Weaning', 'Play with littermates', 'Environmental enrichment'],
    careChecks: ['Exposure to stimuli', 'Beginning training', 'Weight 2x/week']
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    startDay: 50,
    endDay: 84,
    description: 'Preparing for new homes',
    color: 'amber',
    milestones: ['Vaccinations', 'Microchipping', 'Pre-placement evaluations'],
    careChecks: ['Temperament assessment', 'Health checks', 'Weight weekly']
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    startDay: 85,
    endDay: 365,
    description: 'Growing young dogs',
    color: 'orange',
    milestones: ['Training continuation', 'Growth monitoring', 'Adult behaviors emerging'],
    careChecks: ['Exercise needs', 'Training progress', 'Nutrition assessment']
  }
];

export const usePuppyAgeGroups = (puppies: PuppyWithAge[] = []) => {
  // Use predefined age groups or fetch from system settings/database
  const ageGroups = DEFAULT_AGE_GROUPS;
  
  // Organize puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    const grouped: { [groupId: string]: PuppyWithAge[] } = {};
    
    // Initialize all groups with empty arrays
    ageGroups.forEach(group => {
      grouped[group.id] = [];
    });
    
    // Sort puppies into appropriate age groups
    puppies.forEach(puppy => {
      const ageInDays = puppy.ageInDays;
      
      // Find the right age group for this puppy
      const matchingGroup = ageGroups.find(
        group => ageInDays >= group.startDay && ageInDays <= group.endDay
      );
      
      if (matchingGroup) {
        grouped[matchingGroup.id].push(puppy);
      } else {
        // For puppies older than our defined groups, put in the last group
        if (ageGroups.length > 0 && ageInDays > ageGroups[ageGroups.length - 1].endDay) {
          grouped[ageGroups[ageGroups.length - 1].id].push(puppy);
        }
      }
    });
    
    return grouped;
  }, [puppies, ageGroups]);
  
  return { ageGroups, puppiesByAgeGroup };
};
