
import { SocializationCategory, SocializationCategoryOption, SocializationReactionOption, SocializationReactionType } from '@/types/puppyTracking';

export interface SocializationTrackerProps {
  puppyId: string;
  onExperienceAdded?: () => void;
}

export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at: string;
}

export const SOCIALIZATION_CATEGORIES: SocializationCategoryOption[] = [
  { 
    id: 'people', 
    name: 'People Interactions',
    description: 'Interactions with different types of people',
    color: 'blue',
    targetCount: 5,
    examples: ['Adults', 'Children', 'Elderly'],
    categoryId: 'people',
    value: 'people',
    label: 'People Interactions',
    order: 1
  },
  { 
    id: 'animals', 
    name: 'Animal Interactions',
    description: 'Interactions with other animals',
    color: 'green',
    targetCount: 5,
    examples: ['Dogs', 'Cats', 'Farm animals'],
    categoryId: 'animals',
    value: 'animals',
    label: 'Animal Interactions',
    order: 2
  },
  { 
    id: 'environments', 
    name: 'New Environments',
    description: 'Exposure to different environments',
    color: 'purple',
    targetCount: 5,
    examples: ['Parks', 'Urban areas', 'Stores'],
    categoryId: 'environments',
    value: 'environments',
    label: 'New Environments',
    order: 3
  },
  { 
    id: 'sounds', 
    name: 'Sounds & Noises',
    description: 'Exposure to different sounds',
    color: 'yellow',
    targetCount: 5,
    examples: ['Thunder', 'Vacuums', 'Sirens'],
    categoryId: 'sounds',
    value: 'sounds',
    label: 'Sounds & Noises',
    order: 4
  },
  { 
    id: 'surfaces', 
    name: 'Different Surfaces',
    description: 'Walking on various surfaces',
    color: 'orange',
    targetCount: 5,
    examples: ['Grass', 'Tile', 'Carpet'],
    categoryId: 'surfaces',
    value: 'surfaces',
    label: 'Different Surfaces',
    order: 5
  },
  { 
    id: 'handling', 
    name: 'Handling & Grooming',
    description: 'Getting used to being handled',
    color: 'pink',
    targetCount: 5,
    examples: ['Nail trimming', 'Brushing', 'Bathing'],
    categoryId: 'handling',
    value: 'handling',
    label: 'Handling & Grooming',
    order: 6
  },
  { 
    id: 'objects', 
    name: 'Objects & Toys',
    description: 'Exposure to different objects',
    color: 'red',
    targetCount: 5,
    examples: ['Umbrellas', 'Bicycles', 'Toys'],
    categoryId: 'objects',
    value: 'objects',
    label: 'Objects & Toys',
    order: 7
  },
];

export const REACTION_OPTIONS: SocializationReactionOption[] = [
  { 
    id: 'very_positive',
    name: 'Very Positive',
    value: 'very_positive',
    label: 'Very Positive',
    color: 'green',
    type: 'very_positive',
    emoji: '😃'
  },
  { 
    id: 'positive',
    name: 'Positive',
    value: 'positive',
    label: 'Positive',
    color: 'green',
    type: 'positive',
    emoji: '😊'
  },
  { 
    id: 'neutral',
    name: 'Neutral',
    value: 'neutral',
    label: 'Neutral',
    color: 'blue',
    type: 'neutral',
    emoji: '😐'
  },
  { 
    id: 'cautious',
    name: 'Cautious',
    value: 'cautious',
    label: 'Cautious',
    color: 'amber',
    type: 'cautious',
    emoji: '🤔'
  },
  { 
    id: 'fearful',
    name: 'Fearful',
    value: 'fearful',
    label: 'Fearful',
    color: 'red',
    type: 'fearful',
    emoji: '😨'
  },
  { 
    id: 'very_fearful',
    name: 'Very Fearful',
    value: 'very_fearful',
    label: 'Very Fearful',
    color: 'red',
    type: 'very_fearful',
    emoji: '😱'
  },
];
