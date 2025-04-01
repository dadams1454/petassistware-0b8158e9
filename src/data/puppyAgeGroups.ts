
import { PuppyAgeGroupData } from '@/types/puppyTracking';

export const puppyAgeGroups: PuppyAgeGroupData[] = [
  {
    id: "neonatal",
    name: "Neonatal",
    startDay: 0,
    endDay: 14,
    description: "Newborn puppies requiring intensive care",
    color: "pink",
    milestones: "Eyes open, ears open, first health check",
    careChecks: [
      "Monitor weight daily",
      "Ensure proper nursing",
      "Keep environment warm (85-90°F)",
      "Stimulate elimination after feeding",
      "Check for umbilical issues"
    ]
  },
  {
    id: "transitional",
    name: "Transitional",
    startDay: 15,
    endDay: 21,
    description: "Development of senses and mobility beginning",
    color: "purple",
    milestones: "Beginning to walk, playing with littermates, first teeth",
    careChecks: [
      "Monitor weight every other day",
      "Introduce shallow water dish",
      "Begin very gentle handling",
      "Introduce different surfaces",
      "Maintain environment temperature (80-85°F)"
    ]
  },
  {
    id: "socialization",
    name: "Socialization",
    startDay: 22,
    endDay: 49,
    description: "Critical period for socialization and learning",
    color: "blue",
    milestones: "Walking well, playing actively, first vaccination, weaning starts",
    careChecks: [
      "Begin weaning process (puppy mush)",
      "Introduce to new people",
      "Start basic potty training",
      "First deworming",
      "Monitor socialization exposure"
    ]
  },
  {
    id: "juvenile",
    name: "Juvenile",
    startDay: 50,
    endDay: 84,
    description: "Growth and training development phase",
    color: "green",
    milestones: "Fully weaned, vaccination series, ready for new homes",
    careChecks: [
      "Regular feeding schedule",
      "Complete vaccination protocol",
      "Microchipping",
      "Pre-adoption health checks",
      "Advanced socialization experiences"
    ]
  },
  {
    id: "adolescent",
    name: "Adolescent",
    startDay: 85,
    endDay: 365,
    description: "Teenage phase with growth spurts and training challenges",
    color: "amber",
    milestones: "Adult teeth coming in, sexual maturity beginning",
    careChecks: [
      "Monitor growth rate",
      "Begin more structured training",
      "Establish exercise routine",
      "Watch for behavioral changes",
      "Evaluate nutrition needs as growth continues"
    ]
  }
];
