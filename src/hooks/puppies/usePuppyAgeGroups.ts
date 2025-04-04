
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupData } from '@/types/puppyTracking';

// Default puppy age groups
const DEFAULT_AGE_GROUPS: PuppyAgeGroup[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    displayName: 'Newborn Puppies',
    description: 'Puppies that are less than 2 weeks old',
    minDays: 0,
    maxDays: 13,
    unit: 'days',
    color: 'bg-teal-100 text-teal-800',
    startDay: 0,
    endDay: 13,
    minAge: 0,
    maxAge: 13,
    milestones: 'Eyes open, ears begin to open'
  },
  {
    id: 'twoWeek',
    name: 'Two Week',
    displayName: '2-4 Week Puppies',
    description: 'Puppies that are between 2 and 4 weeks old',
    minDays: 14,
    maxDays: 27,
    unit: 'days',
    color: 'bg-blue-100 text-blue-800',
    startDay: 14,
    endDay: 27,
    minAge: 14,
    maxAge: 27,
    milestones: 'Beginning to walk, starting to interact with siblings'
  },
  {
    id: 'fourWeek',
    name: 'Four Week',
    displayName: '4-6 Week Puppies',
    description: 'Puppies that are between 4 and 6 weeks old',
    minDays: 28,
    maxDays: 41,
    unit: 'days',
    color: 'bg-indigo-100 text-indigo-800',
    startDay: 28,
    endDay: 41,
    minAge: 28,
    maxAge: 41,
    milestones: 'Weaning begins, solid food introduction, socialization begins'
  },
  {
    id: 'sixWeek',
    name: 'Six Week',
    displayName: '6-8 Week Puppies',
    description: 'Puppies that are between 6 and 8 weeks old',
    minDays: 42,
    maxDays: 55,
    unit: 'days',
    color: 'bg-purple-100 text-purple-800',
    startDay: 42,
    endDay: 55,
    minAge: 42,
    maxAge: 55,
    milestones: 'Fully weaned, vaccinations, active socialization'
  },
  {
    id: 'eightWeek',
    name: 'Eight Week',
    displayName: '8+ Week Puppies',
    description: 'Puppies that are 8 weeks and older',
    minDays: 56,
    maxDays: 365,
    unit: 'days',
    color: 'bg-pink-100 text-pink-800',
    startDay: 56,
    endDay: 365, 
    minAge: 56,
    maxAge: 365,
    milestones: 'Ready for new homes, continued socialization'
  }
];

/**
 * Hook to group puppies by their age ranges
 * @param puppies List of puppies with age information
 * @param customAgeGroups Optional custom age groups
 * @returns Age groups and puppies organized by groups
 */
export const usePuppyAgeGroups = (
  puppies: PuppyWithAge[],
  customAgeGroups?: PuppyAgeGroup[]
) => {
  const ageGroups = customAgeGroups || DEFAULT_AGE_GROUPS;
  
  // Group puppies by age groups
  const puppiesByAgeGroup = useMemo(() => {
    // Initialize with empty arrays for all defined age groups
    const initialGroups: PuppyAgeGroupData = {
      newborn: [],
      twoWeek: [],
      fourWeek: [],
      sixWeek: [],
      eightWeek: [],
      tenWeek: [],
      twelveWeek: [],
      older: [],
      all: []
    };
    
    // Group puppies by their age
    return puppies.reduce((groups, puppy) => {
      const ageInDays = puppy.ageInDays || puppy.age_days || 0;
      
      // Find the matching age group
      for (const group of ageGroups) {
        const minDays = group.minDays;
        const maxDays = group.maxDays;
        
        if (ageInDays >= minDays && ageInDays <= maxDays) {
          // Add puppy to its appropriate age group
          if (!groups[group.id as keyof PuppyAgeGroupData]) {
            (groups as any)[group.id] = [];
          }
          (groups as any)[group.id].push(puppy);
          break;
        }
      }
      
      return groups;
    }, { ...initialGroups });
  }, [puppies, ageGroups]);

  return {
    ageGroups,
    puppiesByAgeGroup
  };
};
