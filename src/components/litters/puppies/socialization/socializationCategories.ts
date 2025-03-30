
import { SocializationCategory, SocializationCategoryOption } from '../types';

export const socializationCategories: SocializationCategory[] = [
  {
    id: 'sounds',
    name: 'Sounds'
  },
  {
    id: 'people',
    name: 'People'
  },
  {
    id: 'animals',
    name: 'Animals'
  },
  {
    id: 'environments',
    name: 'Environments'
  },
  {
    id: 'handling',
    name: 'Handling'
  },
  {
    id: 'objects',
    name: 'Objects'
  }
];

export const socializationCategoryOptions: SocializationCategoryOption[] = [
  {
    id: 'sounds',
    name: 'Sounds',
    value: 'sounds',
    label: 'Sounds',
    examples: ['Vacuum cleaner', 'Thunderstorm', 'Doorbell', 'Car engines', 'Music']
  },
  {
    id: 'people',
    name: 'People',
    value: 'people',
    label: 'People',
    examples: ['Children', 'Men with beards', 'People with hats', 'Elderly people', 'Crowds']
  },
  {
    id: 'animals',
    name: 'Animals',
    value: 'animals',
    label: 'Animals',
    examples: ['Other dogs', 'Cats', 'Birds', 'Livestock', 'Small animals']
  },
  {
    id: 'environments',
    name: 'Environments',
    value: 'environments',
    label: 'Environments',
    examples: ['Car rides', 'Pet stores', 'Parks', 'Veterinary clinics', 'Different floor surfaces']
  },
  {
    id: 'handling',
    name: 'Handling',
    value: 'handling',
    label: 'Handling',
    examples: ['Nail trimming', 'Ear cleaning', 'Teeth brushing', 'Grooming', 'Being held']
  },
  {
    id: 'objects',
    name: 'Objects',
    value: 'objects',
    label: 'Objects',
    examples: ['Umbrellas', 'Bicycles', 'Stairs', 'Crates', 'Toys']
  }
];

export default socializationCategoryOptions;
