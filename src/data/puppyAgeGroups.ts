
import { AgeGroup } from '@/types/puppyTracking';

export const DEFAULT_AGE_GROUPS: AgeGroup[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Puppies from birth to 2 weeks',
    startDay: 0,
    endDay: 14,
    color: 'pink',
    careChecks: ['weight', 'temperature', 'feeding'],
    milestones: ['eyes_open', 'ears_open']
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: 'Puppies from 2 to 4 weeks',
    startDay: 15,
    endDay: 28,
    color: 'blue',
    careChecks: ['weight', 'socialization', 'elimination'],
    milestones: ['first_walk', 'first_bark']
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: 'Puppies from 4 to 7 weeks',
    startDay: 29,
    endDay: 49,
    color: 'green',
    careChecks: ['weight', 'socialization', 'play', 'deworming'],
    milestones: ['first_solid_food', 'fully_weaned']
  },
  {
    id: 'juvenille',
    name: 'Juvenile',
    description: 'Puppies from 7 to 12 weeks',
    startDay: 50,
    endDay: 84,
    color: 'yellow',
    careChecks: ['vaccination', 'microchipping', 'socialization'],
    milestones: ['first_vaccination', 'microchipped']
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: 'Puppies from 12+ weeks',
    startDay: 85,
    endDay: 365,
    color: 'purple',
    careChecks: ['vaccination', 'training', 'grooming'],
    milestones: ['temperament_test', 'grooming_start']
  }
];
