
import { SocializationReaction, SocializationReactionObject } from '@/types/puppyTracking';
import { REACTION_OBJECTS } from '@/data/socializationCategories';

/**
 * Gets a reaction object from a reaction string
 * This is a helper function to bridge the string enum type and the UI objects
 */
export const getReactionObject = (reaction: SocializationReaction): SocializationReactionObject => {
  const match = REACTION_OBJECTS.find(r => r.id === reaction);
  return match || {
    id: reaction,
    name: capitalize(reaction),
    color: getDefaultColorForReaction(reaction),
    description: `${capitalize(reaction)} reaction`
  };
};

/**
 * Gets the name property for a reaction
 */
export const getReactionName = (reaction: SocializationReaction): string => {
  return getReactionObject(reaction).name;
};

/**
 * Gets the color property for a reaction
 */
export const getReactionColor = (reaction: SocializationReaction): string => {
  return getReactionObject(reaction).color;
};

/**
 * Gets the ID property for a reaction
 */
export const getReactionId = (reaction: SocializationReaction): string => {
  return getReactionObject(reaction).id;
};

/**
 * Gets a default color based on reaction type
 */
const getDefaultColorForReaction = (reaction: string): string => {
  switch (reaction) {
    case 'positive':
      return '#16a34a';
    case 'negative':
      return '#ef4444';
    case 'neutral':
      return '#3b82f6';
    default:
      return '#9ca3af';
  }
};

/**
 * Capitalize a string
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
