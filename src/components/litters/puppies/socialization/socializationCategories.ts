
import { SocializationCategory, SocializationCategoryOption } from '@/types/puppyTracking';

export const socializationCategories: SocializationCategory[] = [
  {
    id: 'sounds',
    name: 'Sounds',
    description: 'Different sounds the puppy might encounter',
    targetCount: 5
  },
  {
    id: 'people',
    name: 'People',
    description: 'Different types of people',
    targetCount: 5
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Other animals the puppy might encounter',
    targetCount: 5
  },
  {
    id: 'environments',
    name: 'Environments',
    description: 'Different places and environments',
    targetCount: 5
  },
  {
    id: 'handling',
    name: 'Handling',
    description: 'Different ways of handling the puppy',
    targetCount: 5
  },
  {
    id: 'objects',
    name: 'Objects',
    description: 'Different objects the puppy might encounter',
    targetCount: 5
  }
];

export const socializationCategoryOptions: SocializationCategoryOption[] = [
  {
    id: 'sounds',
    categoryId: 'sounds',
    name: 'Sounds',
    description: 'Different sounds the puppy might encounter'
  },
  {
    id: 'people',
    categoryId: 'people',
    name: 'People',
    description: 'Different types of people'
  },
  {
    id: 'animals',
    categoryId: 'animals',
    name: 'Animals',
    description: 'Other animals the puppy might encounter'
  },
  {
    id: 'environments',
    categoryId: 'environments',
    name: 'Environments',
    description: 'Different places and environments'
  },
  {
    id: 'handling',
    categoryId: 'handling',
    name: 'Handling',
    description: 'Different ways of handling the puppy'
  },
  {
    id: 'objects',
    categoryId: 'objects',
    name: 'Objects',
    description: 'Different objects the puppy might encounter'
  }
];
