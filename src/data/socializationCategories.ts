
import { SocializationCategory, SocializationReaction } from '@/types/puppyTracking';

export const socializationCategories: SocializationCategory[] = [
  {
    id: '1',
    name: 'People',
    description: 'Exposure to different types of people',
    color: 'blue',
    examples: ['Men with beards', 'People with hats', 'Children', 'Elderly'],
    importance: 5
  },
  {
    id: '2',
    name: 'Animals',
    description: 'Exposure to other animals',
    color: 'green',
    examples: ['Other dogs', 'Cats', 'Livestock', 'Wildlife'],
    importance: 5
  },
  {
    id: '3',
    name: 'Environments',
    description: 'Exposure to different environments',
    color: 'amber',
    examples: ['Parks', 'Urban areas', 'Rural areas', 'Bodies of water'],
    importance: 4
  },
  {
    id: '4',
    name: 'Sounds',
    description: 'Exposure to different sounds',
    color: 'purple',
    examples: ['Thunderstorms', 'Fireworks', 'Traffic', 'Construction noise'],
    importance: 4
  },
  {
    id: '5',
    name: 'Surfaces',
    description: 'Walking on different surfaces',
    color: 'stone',
    examples: ['Grass', 'Gravel', 'Wood', 'Metal grates', 'Slippery floors'],
    importance: 3
  },
  {
    id: '6',
    name: 'Objects',
    description: 'Exposure to novel objects',
    color: 'cyan',
    examples: ['Umbrellas', 'Vacuum cleaners', 'Bicycles', 'Skateboards'],
    importance: 3
  },
  {
    id: '7',
    name: 'Handling',
    description: 'Tolerance of different types of handling',
    color: 'pink',
    examples: ['Nail trimming', 'Ear cleaning', 'Bathing', 'Teeth brushing'],
    importance: 4
  }
];

// Export for backward compatibility
export const SOCIALIZATION_CATEGORIES = socializationCategories;

// Export socialization reactions for compatibility
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
