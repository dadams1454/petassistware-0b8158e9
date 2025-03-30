
import { SocializationCategoryOption } from './types';

export const socializationCategories: SocializationCategoryOption[] = [
  {
    value: 'people',
    label: 'People',
    description: 'Interactions with different types of people',
    examples: ['Children', 'Men with beards', 'People with hats', 'Elderly people', 'People with disabilities']
  },
  {
    value: 'animals',
    label: 'Animals',
    description: 'Interactions with other animals',
    examples: ['Other dogs', 'Cats', 'Livestock', 'Small pets', 'Wildlife']
  },
  {
    value: 'environments',
    label: 'Environments',
    description: 'Exposure to different locations and settings',
    examples: ['Car rides', 'Veterinary office', 'Pet store', 'Park', 'Urban areas']
  },
  {
    value: 'sounds',
    label: 'Sounds',
    description: 'Exposure to different noises and sounds',
    examples: ['Vacuum cleaner', 'Doorbell', 'Thunderstorms', 'Fireworks', 'Traffic']
  },
  {
    value: 'surfaces',
    label: 'Surfaces',
    description: 'Walking on different types of surfaces',
    examples: ['Grass', 'Carpet', 'Tile', 'Metal grates', 'Slippery surfaces']
  },
  {
    value: 'objects',
    label: 'Objects',
    description: 'Interactions with novel objects',
    examples: ['Umbrellas', 'Bicycles', 'Balloons', 'Stairs', 'Toys']
  },
  {
    value: 'handling',
    label: 'Handling',
    description: 'Different types of physical handling',
    examples: ['Nail trimming', 'Teeth brushing', 'Ear examination', 'Grooming', 'Restraint']
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Any other socialization experiences',
    examples: ['Custom experiences']
  }
];
