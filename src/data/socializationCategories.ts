
import { SocializationCategory, SocializationReaction } from '@/types/puppyTracking';

export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: 'people',
    name: 'People Interactions',
    description: 'Exposing puppies to different types of people',
    color: 'blue',
    examples: ['Adults', 'Children', 'Men with beards', 'People wearing hats', 'People with glasses']
  },
  {
    id: 'animals',
    name: 'Other Animals',
    description: 'Introducing puppies to various animals',
    color: 'green',
    examples: ['Other dogs', 'Cats', 'Livestock', 'Small pets', 'Wildlife (from a distance)']
  },
  {
    id: 'environments',
    name: 'Environments',
    description: 'Exposing puppies to different environments',
    color: 'purple',
    examples: ['Car rides', 'Parks', 'Streets', 'Stores', 'Outdoor settings']
  },
  {
    id: 'sounds',
    name: 'Sounds & Noises',
    description: 'Introducing puppies to various sounds',
    color: 'yellow',
    examples: ['Thunderstorms', 'Fireworks', 'Appliances', 'Traffic', 'Music']
  },
  {
    id: 'surfaces',
    name: 'Surface Types',
    description: 'Walking on different surfaces',
    color: 'orange',
    examples: ['Grass', 'Tile', 'Carpet', 'Metal grates', 'Water/puddles']
  },
  {
    id: 'handling',
    name: 'Handling & Grooming',
    description: 'Getting puppies used to being handled',
    color: 'pink',
    examples: ['Nail trimming', 'Ear cleaning', 'Brushing', 'Teeth cleaning', 'Bathing']
  },
  {
    id: 'objects',
    name: 'Objects & Toys',
    description: 'Exposure to different objects',
    color: 'cyan',
    examples: ['Umbrellas', 'Bicycles', 'Strollers', 'Toys', 'Household items']
  },
  {
    id: 'travel',
    name: 'Travel Experiences',
    description: 'Getting puppies comfortable with travel',
    color: 'indigo',
    examples: ['Car rides', 'Crate training', 'Short trips', 'Carriers', 'Public transport']
  }
];

export const SOCIALIZATION_REACTIONS: SocializationReaction[] = [
  { id: 'very_positive', name: 'Very Positive', color: 'green', order: 1 },
  { id: 'positive', name: 'Positive', color: 'emerald', order: 2 },
  { id: 'neutral', name: 'Neutral', color: 'blue', order: 3 },
  { id: 'cautious', name: 'Cautious', color: 'amber', order: 4 },
  { id: 'fearful', name: 'Fearful', color: 'orange', order: 5 },
  { id: 'very_fearful', name: 'Very Fearful', color: 'red', order: 6 }
];

export const RECOMMENDED_EXPERIENCES_BY_AGE = [
  { minAge: 0, maxAge: 21, targetCount: 5 }, // 0-3 weeks: Limited, mostly handling
  { minAge: 22, maxAge: 49, targetCount: 15 }, // 3-7 weeks: Increasing exposure
  { minAge: 50, maxAge: 84, targetCount: 30 }, // 7-12 weeks: Critical socialization period
  { minAge: 85, maxAge: 112, targetCount: 40 }, // 12-16 weeks: Continuing socialization
  { minAge: 113, maxAge: 365, targetCount: 50 } // Beyond 16 weeks: Maintenance
];

export const getSocializationTargetsByAge = (ageInDays: number): number => {
  const ageGroup = RECOMMENDED_EXPERIENCES_BY_AGE.find(
    group => ageInDays >= group.minAge && ageInDays <= group.maxAge
  );
  return ageGroup ? ageGroup.targetCount : 50; // Default to 50 if no age group found
};
