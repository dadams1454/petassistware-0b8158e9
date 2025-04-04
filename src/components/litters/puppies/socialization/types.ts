
import { SocializationCategory as AppSocializationCategory, SocializationCategoryOption, SocializationReactionOption } from '@/types/puppyTracking';

export interface SocializationTrackerProps {
  puppyId: string;
  onExperienceAdded?: () => void;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: AppSocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export const SOCIALIZATION_CATEGORIES: SocializationCategoryOption[] = [
  { 
    id: 'people', 
    name: 'People Interactions',
    description: 'Interactions with different types of people',
    color: 'blue',
    examples: ['Adults', 'Children', 'Elderly']
  },
  { 
    id: 'animals', 
    name: 'Animal Interactions',
    description: 'Interactions with other animals',
    color: 'green',
    examples: ['Dogs', 'Cats', 'Farm animals']
  },
  { 
    id: 'environments', 
    name: 'New Environments',
    description: 'Exposure to different environments',
    color: 'purple',
    examples: ['Parks', 'Urban areas', 'Stores']
  },
  { 
    id: 'sounds', 
    name: 'Sounds & Noises',
    description: 'Exposure to different sounds',
    color: 'yellow',
    examples: ['Thunder', 'Vacuums', 'Sirens']
  },
  { 
    id: 'surfaces', 
    name: 'Different Surfaces',
    description: 'Walking on various surfaces',
    color: 'orange',
    examples: ['Grass', 'Tile', 'Carpet']
  },
  { 
    id: 'handling', 
    name: 'Handling & Grooming',
    description: 'Getting used to being handled',
    color: 'pink',
    examples: ['Nail trimming', 'Brushing', 'Bathing']
  },
  { 
    id: 'objects', 
    name: 'Objects & Toys',
    description: 'Exposure to different objects',
    color: 'red',
    examples: ['Umbrellas', 'Bicycles', 'Toys']
  },
];

export const REACTION_OPTIONS: SocializationReactionOption[] = [
  { value: 'very_positive', label: 'Very Positive' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'cautious', label: 'Cautious' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'very_fearful', label: 'Very Fearful' },
];
