
/**
 * Age group definitions for puppies
 */
import { PuppyAgeGroupInfo } from '@/types/puppyTracking';

export const PUPPY_AGE_GROUPS: PuppyAgeGroupInfo[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    groupName: 'Newborn',
    ageRange: '0-14 days',
    description: 'Brand new puppies requiring intensive care and monitoring',
    startDay: 0,
    endDay: 14,
    color: 'pink',
    milestones: ['Eyes Open', 'Ears Open', 'First Weights'],
    minAge: 0,
    maxAge: 14,
    displayName: 'Newborn (0-14 days)',
    minDays: 0,
    maxDays: 14,
    unit: 'days'
  },
  {
    id: 'twoWeek',
    name: 'Two Week',
    groupName: 'Two Week',
    ageRange: '15-28 days',
    description: 'Starting to explore and interact with environment',
    startDay: 15,
    endDay: 28,
    color: 'blue',
    milestones: ['First Steps', 'First Solid Food', 'Beginning Socialization'],
    minAge: 15,
    maxAge: 28,
    displayName: 'Two Week (15-28 days)',
    minDays: 15,
    maxDays: 28,
    unit: 'days'
  },
  {
    id: 'fourWeek',
    name: 'Four Week',
    groupName: 'Four Week',
    ageRange: '29-42 days',
    description: 'Growing rapidly and becoming more independent',
    startDay: 29,
    endDay: 42,
    color: 'green',
    milestones: ['Weaning', 'Group Play', 'Temp Testing'],
    minAge: 29,
    maxAge: 42,
    displayName: 'Four Week (29-42 days)',
    minDays: 29,
    maxDays: 42,
    unit: 'days'
  },
  {
    id: 'sixWeek',
    name: 'Six Week',
    groupName: 'Six Week',
    ageRange: '43-56 days',
    description: 'Social development and intensive socialization period',
    startDay: 43,
    endDay: 56,
    color: 'purple',
    milestones: ['Deworming', 'First Vaccines', 'Personality Assessment'],
    minAge: 43,
    maxAge: 56,
    displayName: 'Six Week (43-56 days)',
    minDays: 43,
    maxDays: 56,
    unit: 'days'
  },
  {
    id: 'eightWeek',
    name: 'Eight Week',
    groupName: 'Eight Week',
    ageRange: '57-70 days',
    description: 'Preparing for new homes and final assessments',
    startDay: 57,
    endDay: 70,
    color: 'orange',
    milestones: ['Final Vet Check', 'Microchip', 'Go Home Prep'],
    minAge: 57,
    maxAge: 70,
    displayName: 'Eight Week (57-70 days)',
    minDays: 57,
    maxDays: 70,
    unit: 'days'
  }
];
