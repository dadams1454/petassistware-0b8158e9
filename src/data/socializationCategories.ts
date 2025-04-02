
import { SocializationCategory, SocializationReaction } from "@/types/puppyTracking";

export const SOCIALIZATION_CATEGORIES: SocializationCategory[] = [
  {
    id: "people",
    name: "People & Handling",
    description: "Exposing puppies to different types of people and handling experiences",
    color: "#4f46e5",
    examples: ["Children", "Men with beards", "People with hats", "Gentle handling", "Nail trimming"],
    importance: "high"
  },
  {
    id: "sounds",
    name: "Sounds & Noises",
    description: "Introducing various sounds from quiet to loud",
    color: "#06b6d4",
    examples: ["Thunder", "Vacuum cleaner", "Doorbell", "Traffic", "Appliances"],
    importance: "high"
  },
  {
    id: "surfaces",
    name: "Surfaces & Textures",
    description: "Walking on different surfaces and textures",
    color: "#10b981",
    examples: ["Grass", "Tile", "Carpet", "Metal", "Wood", "Uneven surfaces"],
    importance: "medium"
  },
  {
    id: "objects",
    name: "Objects & Toys",
    description: "Interaction with various objects, toys and puzzles",
    color: "#f59e0b",
    examples: ["Umbrellas", "Balloons", "Novel toys", "Moving objects", "Plastic bags"],
    importance: "medium"
  },
  {
    id: "animals",
    name: "Other Animals",
    description: "Safe exposure to other animals and species",
    color: "#ef4444",
    examples: ["Adult dogs", "Cats", "Small animals", "Livestock", "Birds"],
    importance: "high"
  },
  {
    id: "environments",
    name: "Environments",
    description: "Visiting different places and environments",
    color: "#8b5cf6",
    examples: ["Car rides", "Park visits", "Urban areas", "Rural settings", "Water exposure"],
    importance: "high"
  },
  {
    id: "handling",
    name: "Body Handling",
    description: "Getting puppies used to being handled for grooming and veterinary care",
    color: "#ec4899",
    examples: ["Ear cleaning", "Teeth examination", "Paw handling", "Brushing", "Being held"],
    importance: "medium"
  }
];

export const SOCIALIZATION_REACTIONS: SocializationReaction[] = [
  {
    id: "curious",
    name: "Curious",
    color: "#10b981",
    description: "Shows interest and approaches without fear"
  },
  {
    id: "neutral",
    name: "Neutral",
    color: "#6b7280",
    description: "Neither interested nor fearful"
  },
  {
    id: "cautious",
    name: "Cautious",
    color: "#f59e0b",
    description: "Initially hesitant but recovers quickly"
  },
  {
    id: "fearful",
    name: "Fearful",
    color: "#ef4444",
    description: "Shows fear, tries to retreat or hide"
  },
  {
    id: "excited",
    name: "Excited",
    color: "#3b82f6",
    description: "Very enthusiastic, possibly overexcited"
  }
];
