
import { PuppyAgeGroupData } from "@/types/puppyTracking";

export const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: "neonatal",
    name: "Neonatal Period",
    startDay: 0,
    endDay: 14,
    description: "Early developmental stage with limited mobility and senses.",
    color: "red-200",
    milestones: "Eyes and ears closed, limited mobility, mainly sleeping and nursing.",
    careChecks: [
      "Weight gain daily",
      "Temperature regulation",
      "Nursing frequency",
      "Dam's attentiveness",
      "Umbilical healing"
    ],
    minAge: 0,
    maxAge: 14,
    count: 0,
    puppies: []
  },
  {
    id: "transitional",
    name: "Transitional Period",
    startDay: 15,
    endDay: 21,
    description: "Puppies begin to open eyes, ears, and explore surroundings.",
    color: "yellow-200",
    milestones: "Eyes and ears opening, improved mobility, beginning interactions with littermates.",
    careChecks: [
      "Full eye opening",
      "Response to sounds",
      "Starting to walk",
      "Beginning environmental exploration",
      "First teeth appearing"
    ],
    minAge: 15,
    maxAge: 21,
    count: 0,
    puppies: []
  },
  {
    id: "socialization-early",
    name: "Early Socialization",
    startDay: 22,
    endDay: 35,
    description: "Puppies develop social skills with siblings and humans.",
    color: "green-200",
    milestones: "Walking confidently, playing with siblings, curiosity about environment, responsive to humans.",
    careChecks: [
      "Social interactions with littermates",
      "Basic play behaviors",
      "Introduction to various surfaces",
      "Response to human handling",
      "Beginning of weaning process"
    ],
    minAge: 22,
    maxAge: 35,
    count: 0,
    puppies: []
  },
  {
    id: "socialization-late",
    name: "Late Socialization",
    startDay: 36,
    endDay: 56,
    description: "Critical period for learning about the world and humans.",
    color: "blue-200",
    milestones: "Fully weaned, more confident exploration, complex play, responsive to training cues.",
    careChecks: [
      "Exposure to new people and experiences",
      "Progress with weaning",
      "Introduction to basic training concepts",
      "Socialization with various stimuli",
      "Development of individual personality traits"
    ],
    minAge: 36,
    maxAge: 56,
    count: 0,
    puppies: []
  },
  {
    id: "juvenile",
    name: "Juvenile Period",
    startDay: 57,
    endDay: 84,
    description: "Preparing for independent life away from littermates.",
    color: "purple-200",
    milestones: "Ready for new homes, developing independence, learning manners and boundaries.",
    careChecks: [
      "Regular vaccinations",
      "Deworming schedule",
      "Housetraining progress",
      "Crate training adaptation",
      "Temperament assessment for placement"
    ],
    minAge: 57,
    maxAge: 84,
    count: 0,
    puppies: []
  }
];
