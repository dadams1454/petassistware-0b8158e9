
import { SocializationCategoryOption, SocializationReactionOption } from './types';

export const socializationCategories: SocializationCategoryOption[] = [
  {
    value: 'people',
    label: 'People',
    description: 'Interactions with different types of people',
    examples: [
      'Children',
      'Men with beards',
      'People with hats',
      'People in uniforms',
      'People of different ethnicities',
      'People using mobility aids',
      'People wearing glasses'
    ]
  },
  {
    value: 'animals',
    label: 'Animals',
    description: 'Interactions with other animals',
    examples: [
      'Other dogs',
      'Cats',
      'Farm animals',
      'Birds',
      'Small pets (hamsters, guinea pigs)',
      'Wildlife (from a distance)'
    ]
  },
  {
    value: 'environments',
    label: 'Environments',
    description: 'Exposure to different locations and settings',
    examples: [
      'Urban settings',
      'Rural areas',
      'Parks',
      'Pet stores',
      'Vet clinics',
      'Car rides',
      'Water (puddles, pools, etc.)'
    ]
  },
  {
    value: 'sounds',
    label: 'Sounds',
    description: 'Exposure to various noises and sounds',
    examples: [
      'Vacuum cleaner',
      'Doorbell',
      'Thunder',
      'Fireworks (recordings)',
      'Traffic noise',
      'Household appliances',
      'Music'
    ]
  },
  {
    value: 'surfaces',
    label: 'Surfaces',
    description: 'Walking on different textures and surfaces',
    examples: [
      'Grass',
      'Carpet',
      'Hardwood/tile',
      'Gravel',
      'Sand',
      'Metal (grates)',
      'Unstable surfaces',
      'Stairs'
    ]
  },
  {
    value: 'objects',
    label: 'Objects',
    description: 'Interaction with various objects and items',
    examples: [
      'Umbrellas',
      'Bicycles',
      'Skateboards',
      'Balloons',
      'Toys that make noise',
      'Moving objects',
      'Novel items'
    ]
  },
  {
    value: 'handling',
    label: 'Handling',
    description: 'Being handled in different ways',
    examples: [
      'Nail trimming',
      'Ear cleaning',
      'Teeth brushing',
      'Brushing coat',
      'Being picked up',
      'Restraint',
      'Examination'
    ]
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Any other socialization experiences not covered by the categories above',
    examples: [
      'Custom experiences',
      'Special training',
      'Unique situations'
    ]
  }
];

export const reactionOptions: SocializationReactionOption[] = [
  {
    value: 'curious',
    label: 'Curious',
    description: 'Interested and engaged in exploring the experience'
  },
  {
    value: 'confident',
    label: 'Confident',
    description: 'Approached the experience with confidence and ease'
  },
  {
    value: 'cautious',
    label: 'Cautious',
    description: 'Approached carefully but worked through it'
  },
  {
    value: 'nervous',
    label: 'Nervous',
    description: 'Showed signs of concern but did not flee'
  },
  {
    value: 'fearful',
    label: 'Fearful',
    description: 'Displayed clear fear responses (hiding, trembling)'
  },
  {
    value: 'avoidant',
    label: 'Avoidant',
    description: 'Actively tried to avoid or get away from the experience'
  },
  {
    value: 'excited',
    label: 'Excited',
    description: 'Very enthusiastic, possibly over-aroused'
  },
  {
    value: 'neutral',
    label: 'Neutral',
    description: 'Showed minimal reaction, neither positive nor negative'
  },
  {
    value: 'playful',
    label: 'Playful',
    description: 'Engaged with the experience in a playful manner'
  }
];

export const getCategoryInfo = (category: string): SocializationCategoryOption => {
  const cat = socializationCategories.find(c => c.value === category);
  if (!cat) return socializationCategories.find(c => c.value === 'other')!;
  return cat;
};

export const getReactionInfo = (reaction: string): SocializationReactionOption | undefined => {
  return reactionOptions.find(r => r.value === reaction);
};
