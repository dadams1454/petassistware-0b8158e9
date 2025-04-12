
import { SocializationReactionOption, SocializationReactionType } from '@/types/puppyTracking';

// Define properly typed socialization reactions
export const socializationReactions: SocializationReactionOption[] = [
  {
    id: 'positive',
    label: 'Positive',
    value: 'positive',
    type: 'positive' as SocializationReactionType,
    icon: '😊',
    name: 'Positive'
  },
  {
    id: 'neutral',
    label: 'Neutral',
    value: 'neutral',
    type: 'neutral' as SocializationReactionType,
    icon: '😐',
    name: 'Neutral'
  },
  {
    id: 'fearful',
    label: 'Fearful',
    value: 'fearful',
    type: 'fearful' as SocializationReactionType,
    icon: '😨',
    name: 'Fearful'
  },
  // These need to be of the correct type
  {
    id: 'negative',
    label: 'Negative',
    value: 'negative',
    type: 'fearful' as SocializationReactionType, // Map to a valid type
    icon: '😠',
    name: 'Negative'
  },
  {
    id: 'curious', 
    label: 'Curious',
    value: 'curious',
    type: 'neutral' as SocializationReactionType, // Map to a valid type
    icon: '🧐',
    name: 'Curious'
  }
];

// Add a utility function to convert any reaction to a valid type
export function normalizeReactionType(type: string): SocializationReactionType {
  // Check if the type is one of the valid SocializationReactionType values
  if (type === 'positive' || type === 'neutral' || type === 'fearful') {
    return type as SocializationReactionType;
  }
  
  // Map other types to valid SocializationReactionType values
  if (type === 'negative') return 'fearful';
  if (type === 'curious') return 'neutral';
  
  // Default to neutral
  return 'neutral';
}

export default socializationReactions;
