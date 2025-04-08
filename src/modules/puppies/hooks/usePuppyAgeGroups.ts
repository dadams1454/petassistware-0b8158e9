
/**
 * Hook for grouping puppies by age
 */
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupInfo } from '../types';

/**
 * Hook to group puppies by development stage based on age
 */
export const usePuppyAgeGroups = (puppies: PuppyWithAge[] = []) => {
  // Define the age groups
  const ageGroups: PuppyAgeGroupInfo[] = useMemo(() => [
    {
      id: 'newborn',
      name: 'newborn',
      groupName: 'Newborn',
      displayName: 'Newborn',
      description: 'Early puppyhood. Primarily sleeping and nursing.',
      minDays: 0,
      maxDays: 14,
      unit: 'days',
      color: 'pink',
      startDay: 0,
      endDay: 14,
      minAge: 0,
      maxAge: 14,
      milestones: ['Eyes closed', 'Ears closed', 'Limited movement', 'Cannot regulate temperature']
    },
    {
      id: 'twoWeek',
      name: 'twoWeek',
      groupName: 'Transitional',
      displayName: 'Two Week',
      description: 'Eyes and ears beginning to open. Starting to crawl.',
      minDays: 15,
      maxDays: 21,
      unit: 'days',
      color: 'red',
      startDay: 15,
      endDay: 21,
      minAge: 15,
      maxAge: 21,
      milestones: ['Eyes opening', 'Ears opening', 'First teeth appearing', 'Better mobility']
    },
    {
      id: 'fourWeek',
      name: 'fourWeek',
      groupName: 'Socialization',
      displayName: 'Four Week',
      description: 'Beginning to play and interact with littermates. Starting to eat solid food.',
      minDays: 22,
      maxDays: 35,
      unit: 'days',
      color: 'orange',
      startDay: 22,
      endDay: 35,
      minAge: 22,
      maxAge: 35,
      milestones: ['Walking well', 'Playing with littermates', 'Starting solid food', 'More alert']
    },
    {
      id: 'sixWeek',
      name: 'sixWeek',
      groupName: 'Socialization',
      displayName: 'Six Week',
      description: 'Fully weaned. More active play. Beginning basic socialization.',
      minDays: 36,
      maxDays: 49,
      unit: 'days',
      color: 'yellow',
      startDay: 36,
      endDay: 49,
      minAge: 36,
      maxAge: 49,
      milestones: ['Fully weaned', 'Active play', 'Curious about environment', 'Developing personality']
    },
    {
      id: 'eightWeek',
      name: 'eightWeek',
      groupName: 'Juvenile',
      displayName: 'Eight Week',
      description: 'Ready for new homes. Learning basic commands and house training.',
      minDays: 50,
      maxDays: 63,
      unit: 'days',
      color: 'green',
      startDay: 50,
      endDay: 63,
      minAge: 50,
      maxAge: 63,
      milestones: ['Ready for adoption', 'Basic commands', 'Beginnings of house training', 'Full set of puppy teeth']
    },
    {
      id: 'tenWeek',
      name: 'tenWeek',
      groupName: 'Juvenile',
      displayName: 'Ten Week',
      description: 'Critical socialization period. Gaining confidence. Training progress.',
      minDays: 64,
      maxDays: 77,
      unit: 'days',
      color: 'teal',
      startDay: 64,
      endDay: 77,
      minAge: 64,
      maxAge: 77,
      milestones: ['Socializing well', 'Developing confidence', 'Training progress', 'Better coordination']
    },
    {
      id: 'twelveWeek',
      name: 'twelveWeek',
      groupName: 'Juvenile',
      displayName: 'Twelve Week',
      description: 'End of primary socialization period. More independent. Improved focus.',
      minDays: 78,
      maxDays: 91,
      unit: 'days',
      color: 'blue',
      startDay: 78,
      endDay: 91,
      minAge: 78,
      maxAge: 91,
      milestones: ['More independent', 'Better focus', 'Can learn more complex commands', 'Improved bladder control']
    },
    {
      id: 'older',
      name: 'older',
      groupName: 'Adolescent',
      displayName: 'Older',
      description: 'Adolescent phase. Beginning adult teeth. Testing boundaries.',
      minDays: 92,
      maxDays: 365,
      unit: 'days',
      color: 'purple',
      startDay: 92,
      endDay: 365,
      minAge: 92,
      maxAge: 365,
      milestones: ['Adult teeth coming in', 'Testing boundaries', 'Longer attention span', 'Physical growth']
    }
  ], []);
  
  // Group puppies by age
  const puppiesByAgeGroup = useMemo(() => {
    const groups: Record<string, PuppyWithAge[]> = {
      newborn: [],
      twoWeek: [],
      fourWeek: [],
      sixWeek: [],
      eightWeek: [],
      tenWeek: [],
      twelveWeek: [],
      older: []
    };
    
    puppies.forEach(puppy => {
      const ageInDays = puppy.ageInDays || puppy.age_days || 0;
      
      // Find the correct age group
      const group = ageGroups.find(
        group => ageInDays >= group.minDays && ageInDays <= group.maxDays
      );
      
      if (group) {
        const groupId = group.id as PuppyAgeGroup;
        groups[groupId] = [...(groups[groupId] || []), puppy];
      } else {
        // If no matching group, put in older
        groups.older = [...(groups.older || []), puppy];
      }
    });
    
    return groups;
  }, [puppies, ageGroups]);
  
  return {
    ageGroups,
    puppiesByAgeGroup
  };
};
