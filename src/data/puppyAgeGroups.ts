
import { PuppyAgeGroupInfo } from '@/types/puppyTracking';

// Extended version of DEFAULT_AGE_GROUPS with color property
export const DEFAULT_AGE_GROUPS: PuppyAgeGroupInfo[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    groupName: 'Newborn',
    ageRange: '0-14 days',
    description: 'Newborn puppies need constant care and monitoring.',
    imageUrl: '/images/puppies/newborn.jpg',
    startDay: 0,
    endDay: 14,
    color: 'pink',
    milestones: [
      'Eyes begin to open (10-14 days)',
      'Crawling begins',
      'Needs help with elimination'
    ]
  },
  {
    id: 'transitional',
    name: 'Transitional',
    groupName: 'Transitional',
    ageRange: '15-21 days',
    description: 'Puppies start to become more aware of their surroundings.',
    imageUrl: '/images/puppies/transitional.jpg',
    startDay: 15,
    endDay: 21,
    color: 'purple',
    milestones: [
      'Eyes fully open',
      'Ears begin to open',
      'First teeth appear',
      'Beginning to stand and walk'
    ]
  },
  {
    id: 'socialization',
    name: 'Socialization',
    groupName: 'Socialization',
    ageRange: '22-49 days',
    description: 'Critical period for socialization and learning.',
    imageUrl: '/images/puppies/socialization.jpg',
    startDay: 22,
    endDay: 49,
    color: 'blue',
    milestones: [
      'Playing with littermates',
      'Learning bite inhibition',
      'Beginning to eat solid food',
      'Able to regulate body temperature'
    ]
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    groupName: 'Juvenile',
    ageRange: '50-84 days',
    description: 'Ready for their new homes and further socialization.',
    imageUrl: '/images/puppies/juvenile.jpg',
    startDay: 50,
    endDay: 84,
    color: 'green',
    milestones: [
      'Fully weaned',
      'All puppy vaccinations started',
      'Ready for new home (after 8 weeks)',
      'Continuing socialization with people and other animals'
    ]
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    groupName: 'Adolescent',
    ageRange: '85-180 days',
    description: 'Testing boundaries and requiring consistent training.',
    imageUrl: '/images/puppies/adolescent.jpg',
    startDay: 85,
    endDay: 180,
    color: 'amber',
    milestones: [
      'Adult teeth coming in',
      'Increased energy and playfulness',
      'May begin testing boundaries',
      'Critical time for continued training and socialization'
    ]
  }
];

// Export a function to get age group by puppy age
export const getAgeGroupByDays = (ageInDays: number): PuppyAgeGroupInfo | undefined => {
  return DEFAULT_AGE_GROUPS.find(group => 
    ageInDays >= group.startDay && ageInDays <= group.endDay
  );
};
