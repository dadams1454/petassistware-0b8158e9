
import { SocializationReaction, SocializationReactionType } from '@/types/socialization';

// Define reactions with their colors and properties
export const socializationReactions: Record<SocializationReactionType, SocializationReaction> = {
  'very_positive': {
    id: 'very_positive',
    name: 'Very Positive',
    color: 'green',
    emoji: '😄',
    value: 'very_positive'
  },
  'positive': {
    id: 'positive',
    name: 'Positive',
    color: 'emerald',
    emoji: '🙂',
    value: 'positive'
  },
  'neutral': {
    id: 'neutral',
    name: 'Neutral',
    color: 'blue',
    emoji: '😐',
    value: 'neutral'
  },
  'cautious': {
    id: 'cautious',
    name: 'Cautious',
    color: 'amber',
    emoji: '😟',
    value: 'cautious'
  },
  'fearful': {
    id: 'fearful',
    name: 'Fearful',
    color: 'orange',
    emoji: '😨',
    value: 'fearful'
  },
  'very_fearful': {
    id: 'very_fearful',
    name: 'Very Fearful',
    color: 'red',
    emoji: '😱',
    value: 'very_fearful'
  },
  'no_reaction': {
    id: 'no_reaction',
    name: 'No Reaction',
    color: 'gray',
    emoji: '❓',
    value: 'no_reaction'
  }
};

// Get reaction by ID
export const getReactionById = (reactionId: string): SocializationReaction => {
  const reactionType = reactionId as SocializationReactionType;
  
  if (socializationReactions[reactionType]) {
    return socializationReactions[reactionType];
  }
  
  // Return a default reaction if not found
  return socializationReactions.neutral;
};

// Get reaction display name
export const getReactionName = (reactionId: string): string => {
  const reaction = getReactionById(reactionId);
  return reaction.name;
};

// Get reaction color
export const getReactionColor = (reactionId: string): string => {
  const reaction = getReactionById(reactionId);
  return reaction.color;
};

// Get reaction emoji
export const getReactionEmoji = (reactionId: string): string => {
  const reaction = getReactionById(reactionId);
  return reaction.emoji || '❓';
};
