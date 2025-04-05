
import { SocializationCategory, SocializationCategoryOption } from '@/types/puppyTracking';

export const socializationCategories: SocializationCategory[] = [
  {
    id: 'sounds',
    name: 'Sounds',
    description: 'Different sounds the puppy might encounter',
    targetCount: 5,
    color: 'blue',
    examples: ['Doorbell', 'Vacuum', 'Thunder']
  },
  {
    id: 'people',
    name: 'People',
    description: 'Different types of people',
    targetCount: 5,
    color: 'green',
    examples: ['Children', 'Men with hats', 'Elderly']
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Other animals the puppy might encounter',
    targetCount: 5,
    color: 'purple',
    examples: ['Cats', 'Birds', 'Other dogs']
  },
  {
    id: 'environments',
    name: 'Environments',
    description: 'Different places and environments',
    targetCount: 5,
    color: 'orange',
    examples: ['Park', 'Car ride', 'Busy street']
  },
  {
    id: 'handling',
    name: 'Handling',
    description: 'Different ways of handling the puppy',
    targetCount: 5,
    color: 'pink',
    examples: ['Nail trimming', 'Ear cleaning', 'Brushing']
  },
  {
    id: 'objects',
    name: 'Objects',
    description: 'Different objects the puppy might encounter',
    targetCount: 5,
    color: 'red',
    examples: ['Umbrella', 'Bicycle', 'Stroller']
  }
];

export const socializationCategoryOptions: SocializationCategoryOption[] = [
  {
    id: 'sounds',
    categoryId: 'sounds',
    name: 'Sounds',
    description: 'Different sounds the puppy might encounter',
    targetCount: 5,
    color: 'blue',
    value: 'sounds',
    label: 'Sounds',
    examples: ['Doorbell', 'Vacuum', 'Thunder']
  },
  {
    id: 'people',
    categoryId: 'people',
    name: 'People',
    description: 'Different types of people',
    targetCount: 5,
    color: 'green',
    value: 'people',
    label: 'People',
    examples: ['Children', 'Men with hats', 'Elderly']
  },
  {
    id: 'animals',
    categoryId: 'animals',
    name: 'Animals',
    description: 'Other animals the puppy might encounter',
    targetCount: 5,
    color: 'purple',
    value: 'animals',
    label: 'Animals',
    examples: ['Cats', 'Birds', 'Other dogs']
  },
  {
    id: 'environments',
    categoryId: 'environments',
    name: 'Environments',
    description: 'Different places and environments',
    targetCount: 5,
    color: 'orange',
    value: 'environments',
    label: 'Environments',
    examples: ['Park', 'Car ride', 'Busy street']
  },
  {
    id: 'handling',
    categoryId: 'handling',
    name: 'Handling',
    description: 'Different ways of handling the puppy',
    targetCount: 5,
    color: 'pink',
    value: 'handling',
    label: 'Handling',
    examples: ['Nail trimming', 'Ear cleaning', 'Brushing']
  },
  {
    id: 'objects',
    categoryId: 'objects',
    name: 'Objects',
    description: 'Different objects the puppy might encounter',
    targetCount: 5,
    color: 'red',
    value: 'objects',
    label: 'Objects',
    examples: ['Umbrella', 'Bicycle', 'Stroller']
  }
];
