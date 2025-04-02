
import { SocializationCategory, SocializationReactionObject } from '@/types/puppyTracking';

export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: 'people',
    name: 'People Interactions',
    description: 'Expose puppies to different types of people',
    priority: 'high',
    recommended_experiences: 10,
    age_start_days: 21,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#2563eb',
    examples: ['children', 'adults', 'elderly', 'people with hats', 'people with glasses']
  },
  {
    id: 'animals',
    name: 'Animal Interactions',
    description: 'Expose puppies to different types of animals',
    priority: 'high',
    recommended_experiences: 8,
    age_start_days: 28,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#16a34a',
    examples: ['other dogs', 'cats', 'small animals']
  },
  {
    id: 'environments',
    name: 'New Environments',
    description: 'Expose puppies to different environments',
    priority: 'medium',
    recommended_experiences: 8,
    age_start_days: 35,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#ea580c',
    examples: ['outdoors', 'car rides', 'different flooring']
  },
  {
    id: 'sounds',
    name: 'Sounds & Noises',
    description: 'Expose puppies to different sounds',
    priority: 'medium',
    recommended_experiences: 6,
    age_start_days: 28,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#9333ea',
    examples: ['vacuum', 'thunderstorms', 'music', 'traffic']
  },
  {
    id: 'surfaces',
    name: 'Different Surfaces',
    description: 'Expose puppies to different surfaces',
    priority: 'medium',
    recommended_experiences: 6,
    age_start_days: 35,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#ca8a04',
    examples: ['grass', 'carpet', 'tile', 'wood', 'metal']
  },
  {
    id: 'handling',
    name: 'Handling & Grooming',
    description: 'Get puppies used to being handled',
    priority: 'high',
    recommended_experiences: 10,
    age_start_days: 14,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#0891b2',
    examples: ['nail trimming', 'brushing', 'teeth cleaning', 'ear cleaning']
  },
  {
    id: 'objects',
    name: 'Objects & Toys',
    description: 'Expose puppies to different objects',
    priority: 'low',
    recommended_experiences: 5,
    age_start_days: 28,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#4f46e5',
    examples: ['toys', 'common household items', 'moving objects']
  }
];

// These will be used for UI purposes but don't represent the actual reaction type values
export const REACTION_OBJECTS: SocializationReactionObject[] = [
  {
    id: 'positive',
    name: 'Positive',
    color: '#16a34a',
    description: 'Puppy showed curiosity, engagement, playfulness, or comfort'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    color: '#3b82f6',
    description: 'Puppy showed neither positive nor negative reaction'
  },
  {
    id: 'negative',
    name: 'Negative',
    color: '#ef4444',
    description: 'Puppy showed fear, anxiety, avoidance, or aggression'
  },
  {
    id: 'cautious',
    name: 'Cautious',
    color: '#f59e0b',
    description: 'Puppy showed hesitation but not outright fear'
  },
  {
    id: 'very_positive',
    name: 'Very Positive',
    color: '#059669',
    description: 'Puppy showed exceptional enthusiasm and comfort'
  }
];

// Helper function to get reaction object from reaction value
export const getReactionObject = (reaction: string): SocializationReactionObject => {
  const reactionObj = REACTION_OBJECTS.find(r => r.id === reaction);
  return reactionObj || REACTION_OBJECTS[0]; // Default to positive if not found
};
