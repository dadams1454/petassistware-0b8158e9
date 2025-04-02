
import { SocializationCategory, SocializationReaction } from '@/types/puppyTracking';

// Define socialization categories
export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: '1',
    name: 'People',
    description: 'Social interactions with different types of people',
    importance: 'high',
    age_range: { min: 3, max: 16 },
    examples: ['Children', 'Men with beards', 'People with hats', 'Elderly people']
  },
  {
    id: '2',
    name: 'Animals',
    description: 'Exposure to other animals and pets',
    importance: 'high',
    age_range: { min: 4, max: 16 },
    examples: ['Other dogs', 'Cats', 'Small animals', 'Livestock']
  },
  {
    id: '3',
    name: 'Environments',
    description: 'Different places and settings',
    importance: 'high',
    age_range: { min: 5, max: 20 },
    examples: ['City streets', 'Parks', 'Pet stores', 'Veterinary office']
  },
  {
    id: '4',
    name: 'Surfaces',
    description: 'Walking on different surfaces and textures',
    importance: 'medium',
    age_range: { min: 4, max: 12 },
    examples: ['Grass', 'Carpet', 'Tile', 'Metal grates']
  },
  {
    id: '5',
    name: 'Sounds',
    description: 'Exposure to various sounds and noises',
    importance: 'high',
    age_range: { min: 3, max: 16 },
    examples: ['Vacuum cleaner', 'Thunderstorms', 'Traffic', 'Appliances']
  },
  {
    id: '6',
    name: 'Handling',
    description: 'Being handled in different ways',
    importance: 'high',
    age_range: { min: 2, max: 16 },
    examples: ['Nail trimming', 'Teeth examination', 'Ear cleaning', 'Bathing']
  },
  {
    id: '7',
    name: 'Objects',
    description: 'Exposure to novel objects',
    importance: 'medium',
    age_range: { min: 4, max: 16 },
    examples: ['Umbrellas', 'Balloons', 'Bicycles', 'Skateboards']
  }
];

// Define socialization reactions
export const SOCIALIZATION_REACTIONS: SocializationReaction[] = [
  {
    id: '1',
    name: 'Confident',
    color: 'green',
    description: 'Approaches with confidence, shows interest'
  },
  {
    id: '2',
    name: 'Curious',
    color: 'blue',
    description: 'Shows interest but approaches cautiously'
  },
  {
    id: '3',
    name: 'Neutral',
    color: 'gray',
    description: 'Neither fearful nor particularly interested'
  },
  {
    id: '4',
    name: 'Cautious',
    color: 'yellow',
    description: 'Hesitant, some anxiety but recovers quickly'
  },
  {
    id: '5',
    name: 'Fearful',
    color: 'orange',
    description: 'Shows fear, attempts to retreat or hide'
  },
  {
    id: '6',
    name: 'Very Fearful',
    color: 'red',
    description: 'Strong fear response, trembling, hiding, or freezing'
  }
];
