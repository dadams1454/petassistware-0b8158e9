
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupInfo } from '@/types/puppyTracking';

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  // Define our age groups with all the required properties
  const ageGroups: PuppyAgeGroupInfo[] = useMemo(() => [
    {
      id: 'newborn',
      name: 'newborn',
      displayName: 'Newborn',
      description: 'Birth to 2 weeks',
      minDays: 0,
      maxDays: 14,
      unit: 'days',
      color: 'pink',
      startDay: 0,
      endDay: 14,
      minAge: 0,
      maxAge: 14,
      milestones: ['Eyes closed', 'Requires heat', 'Minimal movement']
    },
    {
      id: 'twoWeek',
      name: 'twoWeek',
      displayName: 'Two Week',
      description: '2-4 weeks',
      minDays: 15,
      maxDays: 28,
      unit: 'days',
      color: 'blue',
      startDay: 15,
      endDay: 28,
      minAge: 15,
      maxAge: 28,
      milestones: ['Eyes open', 'Beginning to walk', 'First socialization']
    },
    {
      id: 'fourWeek',
      name: 'fourWeek',
      displayName: 'Four Week',
      description: '4-6 weeks',
      minDays: 29,
      maxDays: 42,
      unit: 'days',
      color: 'green',
      startDay: 29,
      endDay: 42,
      minAge: 29,
      maxAge: 42,
      milestones: ['Weaning begins', 'Play behavior', 'More stable temperature']
    },
    {
      id: 'sixWeek',
      name: 'sixWeek',
      displayName: 'Six Week',
      description: '6-8 weeks',
      minDays: 43,
      maxDays: 56,
      unit: 'days',
      color: 'yellow',
      startDay: 43,
      endDay: 56,
      minAge: 43,
      maxAge: 56,
      milestones: ['Fully weaned', 'Increased exploration', 'First vaccines']
    },
    {
      id: 'eightWeek',
      name: 'eightWeek',
      displayName: 'Eight Week',
      description: '8-10 weeks',
      minDays: 57,
      maxDays: 70,
      unit: 'days',
      color: 'orange',
      startDay: 57,
      endDay: 70,
      minAge: 57,
      maxAge: 70,
      milestones: ['Ready for homes', 'Structured play', 'Fear period begins']
    },
    {
      id: 'tenWeek',
      name: 'tenWeek',
      displayName: 'Ten Week',
      description: '10-12 weeks',
      minDays: 71,
      maxDays: 84,
      unit: 'days',
      color: 'red',
      startDay: 71,
      endDay: 84,
      minAge: 71,
      maxAge: 84,
      milestones: ['Additional vaccines', 'Continued socialization', 'Training begins']
    },
    {
      id: 'twelveWeek',
      name: 'twelveWeek',
      displayName: 'Twelve Week',
      description: '12-16 weeks',
      minDays: 85,
      maxDays: 112,
      unit: 'days',
      color: 'purple',
      startDay: 85,
      endDay: 112,
      minAge: 85,
      maxAge: 112,
      milestones: ['Final vaccines', 'More independence', 'Increased training']
    },
    {
      id: 'older',
      name: 'older',
      displayName: 'Older Puppy',
      description: '16+ weeks',
      minDays: 113,
      maxDays: 365,
      unit: 'days',
      color: 'gray',
      startDay: 113,
      endDay: 365,
      minAge: 113,
      maxAge: 365,
      milestones: ['Advanced training', 'Full exercise', 'Adult behaviors emerging']
    }
  ], []);

  // Group puppies by age
  const puppiesByAgeGroup = useMemo(() => {
    const groups: Record<string, PuppyWithAge[]> = {};
    
    // Initialize all groups with empty arrays
    ageGroups.forEach(group => {
      groups[group.id] = [];
    });
    
    // Sort puppies into their respective groups
    puppies.forEach(puppy => {
      const ageInDays = puppy.ageInDays || 0;
      
      // Find appropriate age group
      for (const group of ageGroups) {
        if (ageInDays >= group.minDays && ageInDays <= group.maxDays) {
          groups[group.id].push(puppy);
          break;
        }
      }
    });
    
    return groups;
  }, [puppies, ageGroups]);

  return { ageGroups, puppiesByAgeGroup };
};
