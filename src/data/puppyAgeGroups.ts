
import { PuppyAgeGroupInfo } from '@/types/puppyTracking';

/**
 * Puppy age groups - standardized age ranges for different developmental stages
 */
export const puppyAgeGroups: PuppyAgeGroupInfo[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    groupName: 'Neonatal Period',
    displayName: 'Newborn Puppy',
    ageRange: '0-14 days',
    description: 'Newborn puppies that require intensive care',
    startDay: 0,
    endDay: 14,
    minDays: 0,
    maxDays: 14,
    unit: 'days',
    color: 'pink',
    milestones: ['Eyes closed', 'Ears closed', 'Unable to regulate temperature'],
    minAge: 0,
    maxAge: 14
  },
  {
    id: 'twoWeek',
    name: '2-4 Weeks',
    groupName: 'Transitional Period',
    displayName: '2-4 Week Puppy',
    ageRange: '15-28 days',
    description: 'Puppies with eyes and ears open, beginning to move around',
    startDay: 15,
    endDay: 28,
    minDays: 15,
    maxDays: 28,
    unit: 'days',
    color: 'blue',
    milestones: ['Eyes open', 'Ears open', 'Beginning to walk'],
    minAge: 15,
    maxAge: 28
  },
  {
    id: 'fourWeek',
    name: '4-6 Weeks',
    groupName: 'Early Socialization',
    displayName: '4-6 Week Puppy',
    ageRange: '29-42 days',
    description: 'Puppies beginning socialization and weaning',
    startDay: 29,
    endDay: 42,
    minDays: 29,
    maxDays: 42,
    unit: 'days',
    color: 'green',
    milestones: ['Start weaning', 'Begin socialization', 'Play behaviors'],
    minAge: 29,
    maxAge: 42
  },
  {
    id: 'sixWeek',
    name: '6-8 Weeks',
    groupName: 'Socialization Period',
    displayName: '6-8 Week Puppy',
    ageRange: '43-56 days',
    description: 'Puppies ready for intensive socialization',
    startDay: 43,
    endDay: 56,
    minDays: 43,
    maxDays: 56,
    unit: 'days',
    color: 'purple',
    milestones: ['Fully weaned', 'Vaccination begins', 'Ready for adoption prep'],
    minAge: 43,
    maxAge: 56
  },
  {
    id: 'eightWeek',
    name: '8-10 Weeks',
    groupName: 'Socialization Period',
    displayName: '8-10 Week Puppy',
    ageRange: '57-70 days',
    description: 'Puppies ready for adoption in many areas',
    startDay: 57,
    endDay: 70,
    minDays: 57,
    maxDays: 70,
    unit: 'days',
    color: 'orange',
    milestones: ['Vaccination series continues', 'Ready for new homes', 'Critical socialization period'],
    minAge: 57,
    maxAge: 70
  },
  {
    id: 'tenWeek',
    name: '10-12 Weeks',
    groupName: 'Juvenile Period',
    displayName: '10-12 Week Puppy',
    ageRange: '71-84 days',
    description: 'Older puppies preparing for new homes',
    startDay: 71,
    endDay: 84,
    minDays: 71,
    maxDays: 84,
    unit: 'days',
    color: 'yellow',
    milestones: ['Vaccination series continues', 'Advanced socialization', 'Basic training begins'],
    minAge: 71,
    maxAge: 84
  },
  {
    id: 'twelveWeek',
    name: '12-16 Weeks',
    groupName: 'Juvenile Period',
    displayName: '12-16 Week Puppy',
    ageRange: '85-112 days',
    description: 'Older puppies in training',
    startDay: 85,
    endDay: 112,
    minDays: 85,
    maxDays: 112,
    unit: 'days',
    color: 'red',
    milestones: ['Final vaccinations', 'Advanced training', 'Adolescence approaching'],
    minAge: 85,
    maxAge: 112
  },
  {
    id: 'older',
    name: 'Older Puppies',
    groupName: 'Adolescent Period',
    displayName: 'Older Puppy',
    ageRange: '112+ days',
    description: 'Adolescent puppies approaching adult stage',
    startDay: 113,
    endDay: 365,
    minDays: 113,
    maxDays: 365,
    unit: 'days',
    color: 'gray',
    milestones: ['Adolescent behaviors', 'Adult size approaching', 'Ongoing training'],
    minAge: 113,
    maxAge: 365
  }
];

// For backward compatibility
export const PUPPY_AGE_GROUPS = puppyAgeGroups;
