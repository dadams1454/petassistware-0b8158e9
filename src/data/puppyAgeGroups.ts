
import { PuppyAgeGroupData } from '@/types/puppyTracking';

export const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'neonatal',
    name: 'Neonatal Period',
    startDay: 0,
    endDay: 14,
    description: 'Puppies are completely dependent on their mother and require close monitoring.',
    milestones: 'Eyes and ears closed, limited movement, sleeping most of the time, requires mother\'s milk and warmth.',
    careChecks: [
      'Check weight daily',
      'Monitor nursing behavior',
      'Ensure warm environment (85-90°F)',
      'Check for signs of distress or rejection'
    ]
  },
  {
    id: 'transitional',
    name: 'Transitional Period',
    startDay: 15,
    endDay: 21,
    description: 'Puppies begin to open their eyes and ears, starting to become more aware of surroundings.',
    milestones: 'Eyes opening, beginning to hear, crawling, first teeth appearing, beginning to regulate temperature.',
    careChecks: [
      'Monitor weight gain',
      'Check eye opening progress',
      'Observe beginning of social interactions',
      'Begin very gentle handling',
      'Keep area clean'
    ]
  },
  {
    id: 'socialization',
    name: 'Early Socialization',
    startDay: 22,
    endDay: 49,
    description: 'Critical period for socialization and beginning to interact with surroundings and siblings.',
    milestones: 'Walking, playing with littermates, developing bite inhibition, weaning from mother\'s milk, exploring environment.',
    careChecks: [
      'Begin exposure to different surfaces and sounds',
      'Monitor play behavior',
      'Introduce basic handling routines',
      'Begin weaning process',
      'Watch for developmental delays'
    ]
  },
  {
    id: 'juvenile',
    name: 'Juvenile Period',
    startDay: 50,
    endDay: 84,
    description: 'Puppies are increasingly independent and prepare for adoption/new homes.',
    milestones: 'Fully weaned, increased exploratory behavior, developing individual personalities, responding to basic commands.',
    careChecks: [
      'Ensure vaccination schedule is followed',
      'Begin basic training routines',
      'Introduce to various environments',
      'Monitor growth and health',
      'Prepare for adoption assessment'
    ]
  }
];
