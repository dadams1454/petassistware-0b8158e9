
import { SocializationCategory, SocializationReaction } from "@/types/puppyTracking";

// Export with the names expected by the components
export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: "people",
    name: "People",
    description: "Interactions with different types of people",
    examples: ["Children", "Men with beards", "People in uniforms", "People with hats"]
  },
  {
    id: "animals",
    name: "Animals",
    description: "Interactions with other animals",
    examples: ["Other dogs", "Cats", "Farm animals", "Wildlife"]
  },
  {
    id: "environments",
    name: "Environments",
    description: "Exposure to different environments",
    examples: ["Urban areas", "Countryside", "Beach", "Forest"]
  },
  {
    id: "surfaces",
    name: "Surfaces",
    description: "Walking on different surfaces",
    examples: ["Grass", "Concrete", "Sand", "Metal grates"]
  },
  {
    id: "sounds",
    name: "Sounds",
    description: "Exposure to different sounds",
    examples: ["Thunderstorms", "Fireworks", "Traffic", "Household appliances"]
  },
  {
    id: "handling",
    name: "Handling",
    description: "Getting used to being handled",
    examples: ["Grooming", "Nail trimming", "Ear cleaning", "Teeth brushing"]
  },
  {
    id: "objects",
    name: "Objects",
    description: "Interaction with different objects",
    examples: ["Umbrellas", "Bicycles", "Vacuum cleaners", "Strollers"]
  }
];

// For backward compatibility
export const socializationCategories = SOCIALIZATION_CATEGORIES;

export const SOCIALIZATION_REACTIONS: SocializationReaction[] = [
  {
    id: "curious",
    name: "Curious",
    description: "Shows interest and approaches willingly",
    color: "green"
  },
  {
    id: "neutral",
    name: "Neutral",
    description: "Neither interested nor fearful",
    color: "blue"
  },
  {
    id: "cautious",
    name: "Cautious",
    description: "Hesitant but will approach with encouragement",
    color: "amber"
  },
  {
    id: "fearful",
    name: "Fearful",
    description: "Shows signs of fear but recovers",
    color: "red"
  },
  {
    id: "very_fearful",
    name: "Very Fearful",
    description: "Shows strong fear response",
    color: "purple"
  },
  {
    id: "excited",
    name: "Excited",
    description: "Shows enthusiasm and excitement",
    color: "green"
  }
];

// For backward compatibility
export const socializationReactionTypes = SOCIALIZATION_REACTIONS;
