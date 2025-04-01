
import { PuppyAgeGroupData } from '@/types/puppyTracking';

export const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Puppies less than 2 weeks old',
    startDay: 0,
    endDay: 14,
    color: 'bg-pink-100 text-pink-800',
    priority: 1,
    milestones: 'Eyes closed, ears closed, limited mobility, nursing frequently',
    careChecks: [
      'Monitor temperature and humidity',
      'Ensure nursing occurs regularly',
      'Weigh daily to track growth',
      'Check for any signs of distress'
    ]
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: 'Puppies 2-4 weeks old',
    startDay: 15,
    endDay: 28,
    color: 'bg-purple-100 text-purple-800',
    priority: 2,
    milestones: 'Eyes opening, ears opening, beginning to crawl',
    careChecks: [
      'Monitor weight gain',
      'Begin environmental enrichment',
      'Introduce to gentle handling',
      'Monitor temperature regulation'
    ]
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: 'Puppies 4-8 weeks old',
    startDay: 29,
    endDay: 56,
    color: 'bg-blue-100 text-blue-800',
    priority: 3,
    milestones: 'Walking, playing, beginning of socialization period',
    careChecks: [
      'Begin socialization activities',
      'Introduce to various surfaces',
      'Start weaning process',
      'Begin potty training basics'
    ]
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: 'Puppies 8-12 weeks old',
    startDay: 57,
    endDay: 84,
    color: 'bg-green-100 text-green-800',
    priority: 4,
    milestones: 'Fully weaned, increased socialization, beginning training',
    careChecks: [
      'Complete vaccination series',
      'Monitor growth and development',
      'Introduce to basic commands',
      'Prepare for potential rehoming'
    ]
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: 'Puppies older than 12 weeks',
    startDay: 85,
    endDay: 730, // 2 years
    color: 'bg-amber-100 text-amber-800',
    priority: 5,
    milestones: 'Continued training, socialization, and development',
    careChecks: [
      'Continue training reinforcement',
      'Maintain socialization',
      'Regular health checks',
      'Prepare for potential rehoming'
    ]
  }
];
