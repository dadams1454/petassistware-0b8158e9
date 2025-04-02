
import { SocializationCategory, SocializationReactionObject } from '@/types/puppyTracking';

export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: 'people',
    name: 'People',
    description: 'Exposure to different types of people',
    recommended_experiences: 10,
    priority: 'high',
    age_start_days: 21,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#2563eb',
    examples: ['Children', 'People with hats', 'People with beards', 'People in uniforms']
  },
  {
    id: 'surfaces',
    name: 'Surfaces',
    description: 'Walking on different surfaces and textures',
    recommended_experiences: 8,
    priority: 'medium',
    age_start_days: 28,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#16a34a',
    examples: ['Carpet', 'Tile', 'Grass', 'Gravel', 'Wood floors']
  },
  {
    id: 'sounds',
    name: 'Sounds',
    description: 'Exposure to different sounds',
    recommended_experiences: 8,
    priority: 'high',
    age_start_days: 21,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#9333ea',
    examples: ['Vacuum cleaner', 'Doorbell', 'Traffic', 'Thunder recording']
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Interaction with other animals',
    recommended_experiences: 6,
    priority: 'medium',
    age_start_days: 42,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#ea580c',
    examples: ['Other dogs', 'Cats', 'Birds', 'Livestock (if relevant)']
  },
  {
    id: 'environments',
    name: 'Environments',
    description: 'Visits to different locations',
    recommended_experiences: 6,
    priority: 'medium',
    age_start_days: 49,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#ca8a04',
    examples: ['Car rides', 'Pet-friendly store', 'Park', 'Outdoor cafe']
  },
  {
    id: 'handling',
    name: 'Handling',
    description: 'Getting used to being handled',
    recommended_experiences: 10,
    priority: 'high',
    age_start_days: 14,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#0891b2',
    examples: ['Ears touched', 'Paws handled', 'Grooming', 'Teeth checking']
  },
  {
    id: 'objects',
    name: 'Objects',
    description: 'Exposure to novel objects',
    recommended_experiences: 8,
    priority: 'low',
    age_start_days: 28,
    age_end_days: 84,
    created_at: new Date().toISOString(),
    color: '#4f46e5',
    examples: ['Umbrella', 'Rolling suitcase', 'Bicycle', 'Skateboard']
  }
];

// Export reaction objects for use in the UI
export const SOCIALIZATION_REACTIONS: SocializationReactionObject[] = [
  {
    id: 'positive',
    name: 'Positive',
    color: '#16a34a',
    description: 'Comfortable, happy, engaged'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    color: '#3b82f6',
    description: 'Neither positive nor negative'
  },
  {
    id: 'negative',
    name: 'Negative',
    color: '#ef4444',
    description: 'Fearful, anxious, stressed'
  },
  {
    id: 'mixed',
    name: 'Mixed',
    color: '#a16207',
    description: 'Mixed reaction, both positive and negative elements'
  },
  {
    id: 'curious',
    name: 'Curious',
    color: '#7c3aed',
    description: 'Interested and exploring but cautious'
  }
];
