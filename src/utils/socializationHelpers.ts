
import { SocializationReaction, SocializationReactionType } from '@/types/puppyTracking';

// Define reaction objects for UI display
export const REACTION_OBJECTS: SocializationReaction[] = [
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
    id: 'very_positive',
    name: 'Very Positive',
    color: '#15803d',
    description: 'Extremely comfortable and happy'
  },
  {
    id: 'cautious',
    name: 'Cautious',
    color: '#eab308',
    description: 'Careful, but not fearful'
  },
  {
    id: 'fearful',
    name: 'Fearful',
    color: '#f97316',
    description: 'Shows fear but manageable'
  },
  {
    id: 'very_fearful',
    name: 'Very Fearful',
    color: '#dc2626',
    description: 'Extreme fear response'
  }
];

// Map from reaction IDs to emoji representations for UI display
export const REACTION_EMOJI_MAP: Record<string, string> = {
  'very_positive': '😄',
  'positive': '🙂',
  'neutral': '😐',
  'cautious': '😟',
  'fearful': '😨',
  'very_fearful': '😱',
  'negative': '😔'
};

/**
 * Gets a reaction object from a reaction string
 * This is a helper function to bridge the string enum type and the UI objects
 */
export const getReactionObject = (reaction: string): SocializationReaction => {
  const match = REACTION_OBJECTS.find(r => r.id === reaction);
  return match || {
    id: reaction,
    name: capitalize(reaction),
    color: getDefaultColorForReaction(reaction),
    description: `${capitalize(reaction)} reaction`
  };
};

/**
 * Gets the emoji for a reaction
 */
export const getReactionEmoji = (reaction: string): string => {
  return REACTION_EMOJI_MAP[reaction] || '❓';
};

/**
 * Gets the name property for a reaction
 */
export const getReactionName = (reaction: string): string => {
  return getReactionObject(reaction).name;
};

/**
 * Gets the color property for a reaction
 */
export const getReactionColor = (reaction: string): string => {
  return getReactionObject(reaction).color;
};

/**
 * Gets the ID property for a reaction
 */
export const getReactionId = (reaction: string): string => {
  return getReactionObject(reaction).id;
};

/**
 * Gets a default color based on reaction type
 */
const getDefaultColorForReaction = (reaction: string): string => {
  switch (reaction) {
    case 'positive':
    case 'very_positive':
      return '#16a34a';
    case 'negative':
    case 'very_fearful':
    case 'fearful':
      return '#ef4444';
    case 'neutral':
      return '#3b82f6';
    case 'cautious':
      return '#eab308';
    default:
      return '#9ca3af';
  }
};

/**
 * Gets a reaction object formatted for UI components
 */
export const getReactionObjectForUI = (reaction: string): {id: string, name: string, emoji: string, color: string} => {
  const reactionObj = getReactionObject(reaction);
  return {
    id: reactionObj.id,
    name: reactionObj.name,
    emoji: getReactionEmoji(reaction),
    color: reactionObj.color
  };
};

/**
 * Capitalize a string
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
