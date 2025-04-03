
import { SocializationCategory } from '@/types/puppyTracking';

export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: 'people',
    name: 'People',
    color: 'blue',
    description: 'Interactions with different types of people',
    examples: [
      'Men with beards',
      'Children',
      'People with hats',
      'People with glasses',
      'People in uniforms',
      'People of different ethnicities'
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    color: 'green',
    description: 'Interactions with other animals',
    examples: [
      'Other dogs',
      'Cats',
      'Small animals',
      'Farm animals',
      'Birds'
    ]
  },
  {
    id: 'environments',
    name: 'Environments',
    color: 'amber',
    description: 'Different environments and locations',
    examples: [
      'Car rides',
      'Parks',
      'Urban areas',
      'Rural areas',
      'Different floor surfaces',
      'Water (puddles, pools)'
    ]
  },
  {
    id: 'sounds',
    name: 'Sounds',
    color: 'purple',
    description: 'Exposure to different sounds and noises',
    examples: [
      'Thunderstorms',
      'Fireworks',
      'Vacuum cleaner',
      'Traffic',
      'Loud music',
      'Appliances'
    ]
  },
  {
    id: 'handling',
    name: 'Handling',
    color: 'pink',
    description: 'Different types of physical handling',
    examples: [
      'Nail trimming',
      'Ear cleaning',
      'Bathing',
      'Grooming',
      'Teeth brushing',
      'Being held in different positions'
    ]
  },
  {
    id: 'objects',
    name: 'Objects',
    color: 'indigo',
    description: 'Interactions with different objects',
    examples: [
      'Umbrellas',
      'Bicycles',
      'Skateboards',
      'Wheelchairs',
      'Strollers',
      'Balloons'
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    color: 'cyan',
    description: 'Different modes of transportation',
    examples: [
      'Car rides',
      'Crate training',
      'Public transportation',
      'Elevators',
      'Boats',
      'Different vehicles'
    ]
  }
];

// Helper function to get a category by ID
export const getCategoryById = (id: string): SocializationCategory | undefined => {
  return SOCIALIZATION_CATEGORIES.find(category => category.id === id);
};

// Helper function to get a category by name
export const getCategoryByName = (name: string): SocializationCategory | undefined => {
  return SOCIALIZATION_CATEGORIES.find(category => 
    category.name.toLowerCase() === name.toLowerCase());
};
