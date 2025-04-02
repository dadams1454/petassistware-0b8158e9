
import { SocializationCategory, SocializationReaction } from '@/types/puppyTracking';

export const socializationCategories: SocializationCategory[] = [
  {
    id: '1',
    name: 'People',
    description: 'Exposure to different types of people',
    color: 'blue',
    examples: ['Men with beards', 'People with hats', 'Children', 'Elderly'],
    importance: 'high'
  },
  {
    id: '2',
    name: 'Animals',
    description: 'Exposure to other animals',
    color: 'green',
    examples: ['Other dogs', 'Cats', 'Livestock', 'Wildlife'],
    importance: 'high'
  },
  {
    id: '3',
    name: 'Environments',
    description: 'Exposure to different environments',
    color: 'amber',
    examples: ['Parks', 'Urban areas', 'Rural areas', 'Bodies of water'],
    importance: 'medium'
  },
  {
    id: '4',
    name: 'Sounds',
    description: 'Exposure to different sounds',
    color: 'purple',
    examples: ['Thunderstorms', 'Fireworks', 'Traffic', 'Construction noise'],
    importance: 'medium'
  },
  {
    id: '5',
    name: 'Surfaces',
    description: 'Walking on different surfaces',
    color: 'stone',
    examples: ['Grass', 'Gravel', 'Wood', 'Metal grates', 'Slippery floors'],
    importance: 'low'
  },
  {
    id: '6',
    name: 'Objects',
    description: 'Exposure to novel objects',
    color: 'cyan',
    examples: ['Umbrellas', 'Vacuum cleaners', 'Bicycles', 'Skateboards'],
    importance: 'low'
  },
  {
    id: '7',
    name: 'Handling',
    description: 'Tolerance of different types of handling',
    color: 'pink',
    examples: ['Nail trimming', 'Ear cleaning', 'Bathing', 'Teeth brushing'],
    importance: 'medium'
  }
];

// Export for backward compatibility
export const SOCIALIZATION_CATEGORIES = socializationCategories;

// Update socialization reactions to match the type in puppyTracking.ts
export const SOCIALIZATION_REACTIONS: SocializationReaction[] = [
  {
    id: 'curious',
    name: 'Curious',
    color: 'green',
    description: 'Shows interest and approaches willingly'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    color: 'blue',
    description: 'Neither fearful nor excited'
  },
  {
    id: 'cautious',
    name: 'Cautious',
    color: 'amber',
    description: 'Shows some hesitation'
  },
  {
    id: 'fearful',
    name: 'Fearful',
    color: 'red',
    description: 'Shows fear, tries to retreat'
  },
  {
    id: 'excited',
    name: 'Excited',
    color: 'purple',
    description: 'Shows enthusiasm and excitement'
  }
];
