
import { PuppyAgeGroupInfo } from '@/types/puppyTracking';

export const puppyAgeGroups: PuppyAgeGroupInfo[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    groupName: 'Newborn',
    displayName: 'Newborn',
    description: 'Newborn puppies require intensive care and monitoring. Focus on ensuring they're nursing, maintaining body temperature, and monitoring weight gain.',
    ageRange: '0-14 days',
    startDay: 0,
    endDay: 14,
    minDays: 0,
    maxDays: 14,
    unit: 'days',
    color: 'pink',
    minAge: 0,
    maxAge: 14,
    milestones: 'Eyes closed, ears folded, crawling only, sleeping 90% of time, needs help eliminating'
  },
  {
    id: 'twoWeek',
    name: '2-Week',
    groupName: 'Two-Week',
    displayName: '2-Week Old',
    description: 'Eyes opening, beginning to hear sounds, and starting to show personality. Still need temperature monitoring and dam assistance.',
    ageRange: '15-28 days',
    startDay: 15,
    endDay: 28,
    minDays: 15,
    maxDays: 28,
    unit: 'days',
    color: 'blue',
    minAge: 15,
    maxAge: 28,
    milestones: 'Eyes opening, beginning to hear, first teeth, wobbling around, starting to play'
  },
  {
    id: 'fourWeek',
    name: '4-Week',
    groupName: 'Four-Week',
    displayName: '4-Week Old',
    description: 'Starting to eat solid food, playing more actively. Beginning simple training and socialization activities.',
    ageRange: '29-42 days',
    startDay: 29,
    endDay: 42,
    minDays: 29,
    maxDays: 42,
    unit: 'days',
    color: 'green',
    minAge: 29,
    maxAge: 42,
    milestones: 'Weaning begins, more steady walking, playing with littermates, exploring environment'
  },
  {
    id: 'sixWeek',
    name: '6-Week',
    groupName: 'Six-Week',
    displayName: '6-Week Old',
    description: 'Fully weaned, active play, developing social skills with littermates and people. Starting structured training.',
    ageRange: '43-56 days',
    startDay: 43,
    endDay: 56,
    minDays: 43,
    maxDays: 56,
    unit: 'days',
    color: 'yellow',
    minAge: 43,
    maxAge: 56,
    milestones: 'Fully weaned, active play, first vaccinations, learning bite inhibition, early training'
  },
  {
    id: 'eightWeek',
    name: '8-Week',
    groupName: 'Eight-Week',
    displayName: '8-Week Old',
    description: 'Ready for new homes, continued socialization, house training, and basic commands. Critical socialization period.',
    ageRange: '57-70 days',
    startDay: 57,
    endDay: 70,
    minDays: 57,
    maxDays: 70,
    unit: 'days',
    color: 'orange',
    minAge: 57,
    maxAge: 70,
    milestones: 'Go-home ready, continued vaccinations, basic training, critical socialization period'
  }
];

export default puppyAgeGroups;
