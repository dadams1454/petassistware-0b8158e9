
import { SocializationCategory, SocializationCategoryOption } from '@/types/puppyTracking';

// Create correctly typed socialization categories
export const socializationCategories: SocializationCategory[] = [
  {
    id: 'sounds',
    category: 'sounds',
    displayName: 'Sounds',
    description: 'Different sounds the puppy might encounter',
    targetCount: 5,
    examples: ['Doorbell', 'Vacuum', 'Thunder'],
    color: 'blue'
  },
  {
    id: 'people',
    category: 'people',
    displayName: 'People',
    description: 'Different types of people',
    targetCount: 5,
    examples: ['Children', 'Men with hats', 'Elderly'],
    color: 'green'
  },
  {
    id: 'animals',
    category: 'animals',
    displayName: 'Animals',
    description: 'Other animals the puppy might encounter',
    targetCount: 5,
    examples: ['Cats', 'Birds', 'Other dogs'],
    color: 'purple'
  },
  {
    id: 'environments',
    category: 'environments',
    displayName: 'Environments',
    description: 'Different places and environments',
    targetCount: 5,
    examples: ['Park', 'Car ride', 'Busy street'],
    color: 'orange'
  },
  {
    id: 'handling',
    category: 'handling',
    displayName: 'Handling',
    description: 'Different ways of handling the puppy',
    targetCount: 5,
    examples: ['Nail trimming', 'Ear cleaning', 'Brushing'],
    color: 'pink'
  },
  {
    id: 'objects',
    category: 'objects',
    displayName: 'Objects',
    description: 'Different objects the puppy might encounter',
    targetCount: 5,
    examples: ['Umbrella', 'Bicycle', 'Stroller'],
    color: 'red'
  }
];

// Create socialization category options with the correct shape
export const socializationCategoryOptions: SocializationCategoryOption[] = [
  {
    id: 'sounds',
    category: 'sounds',
    displayName: 'Sounds',
    description: 'Different sounds the puppy might encounter',
    targetCount: 5,
    examples: ['Doorbell', 'Vacuum', 'Thunder'],
    color: 'blue',
    value: 'sounds',
    label: 'Sounds'
  },
  {
    id: 'people',
    category: 'people',
    displayName: 'People',
    description: 'Different types of people',
    targetCount: 5,
    examples: ['Children', 'Men with hats', 'Elderly'],
    color: 'green',
    value: 'people',
    label: 'People'
  },
  {
    id: 'animals',
    category: 'animals',
    displayName: 'Animals',
    description: 'Other animals the puppy might encounter',
    targetCount: 5,
    examples: ['Cats', 'Birds', 'Other dogs'],
    color: 'purple',
    value: 'animals',
    label: 'Animals'
  },
  {
    id: 'environments',
    category: 'environments',
    displayName: 'Environments',
    description: 'Different places and environments',
    targetCount: 5,
    examples: ['Park', 'Car ride', 'Busy street'],
    color: 'orange',
    value: 'environments',
    label: 'Environments'
  },
  {
    id: 'handling',
    category: 'handling',
    displayName: 'Handling',
    description: 'Different ways of handling the puppy',
    targetCount: 5,
    examples: ['Nail trimming', 'Ear cleaning', 'Brushing'],
    color: 'pink',
    value: 'handling',
    label: 'Handling'
  },
  {
    id: 'objects',
    category: 'objects',
    displayName: 'Objects',
    description: 'Different objects the puppy might encounter',
    targetCount: 5,
    examples: ['Umbrella', 'Bicycle', 'Stroller'],
    color: 'red',
    value: 'objects',
    label: 'Objects'
  }
];

export default socializationCategories;
