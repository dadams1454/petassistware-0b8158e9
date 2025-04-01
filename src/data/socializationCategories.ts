
import { SocializationCategory, SocializationReactionType } from '@/types/puppyTracking';

export const socializationCategories: SocializationCategory[] = [
  {
    id: "people",
    name: "People",
    description: "Different types of people and interactions",
    color: "blue",
    targetCount: 20,
    examples: ["Children", "Men with beards", "People with hats", "Elderly people"]
  },
  {
    id: "animals",
    name: "Animals",
    description: "Exposure to various animals",
    color: "green",
    targetCount: 15,
    examples: ["Other dogs", "Cats", "Farm animals", "Small pets"]
  },
  {
    id: "environments",
    name: "Environments",
    description: "Different places and settings",
    color: "purple",
    targetCount: 15,
    examples: ["Urban areas", "Parks", "Car rides", "Veterinary clinic"]
  },
  {
    id: "sounds",
    name: "Sounds",
    description: "Various noises and sounds",
    color: "orange",
    targetCount: 12,
    examples: ["Thunderstorms", "Vacuum cleaners", "Traffic", "Fireworks"]
  },
  {
    id: "surfaces",
    name: "Surfaces",
    description: "Different walking surfaces",
    color: "brown",
    targetCount: 10,
    examples: ["Grass", "Tile", "Carpet", "Metal grates"]
  },
  {
    id: "handling",
    name: "Handling",
    description: "Being touched and handled",
    color: "pink",
    targetCount: 10,
    examples: ["Ear touching", "Paw handling", "Grooming", "Teeth examination"]
  },
  {
    id: "objects",
    name: "Objects",
    description: "Exposure to various objects",
    color: "teal",
    targetCount: 12,
    examples: ["Umbrellas", "Bicycles", "Stairs", "Toys"]
  },
  {
    id: "training",
    name: "Training",
    description: "Basic training experiences",
    color: "indigo",
    targetCount: 8,
    examples: ["Collar/leash", "Crate training", "Basic commands", "Name recognition"]
  }
];

export const socializationReactionTypes: Record<string, SocializationReactionType> = {
  positive: { id: 'positive', name: 'Positive', color: 'green', order: 1 },
  neutral: { id: 'neutral', name: 'Neutral', color: 'gray', order: 2 },
  fearful: { id: 'fearful', name: 'Fearful', color: 'yellow', order: 3 },
  negative: { id: 'negative', name: 'Negative', color: 'red', order: 4 },
  excited: { id: 'excited', name: 'Excited', color: 'blue', order: 5 },
  curious: { id: 'curious', name: 'Curious', color: 'purple', order: 6 }
};
