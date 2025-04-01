
import { PuppyAgeGroupData } from '@/types/puppyTracking';

export const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Puppies less than 2 weeks old',
    startDay: 0,
    endDay: 14,
    color: 'bg-pink-100 text-pink-800',
    priority: 1
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: 'Puppies 2-4 weeks old',
    startDay: 15,
    endDay: 28,
    color: 'bg-purple-100 text-purple-800',
    priority: 2
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: 'Puppies 4-8 weeks old',
    startDay: 29,
    endDay: 56,
    color: 'bg-blue-100 text-blue-800',
    priority: 3
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: 'Puppies 8-12 weeks old',
    startDay: 57,
    endDay: 84,
    color: 'bg-green-100 text-green-800',
    priority: 4
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: 'Puppies older than 12 weeks',
    startDay: 85,
    endDay: 730, // 2 years
    color: 'bg-amber-100 text-amber-800',
    priority: 5
  }
];
