
// Export all types from across the application
// This file functions as a central hub for importing types

// Re-export all weight-related types from the weight-units file
export * from './weight-units';

// Re-export health-enums
export * from './health-enums';

// Re-export heat-cycles types
export * from './heat-cycles';

// Dog-related types
export type { Dog, DogProfile, DogCareStatus } from './dog';
export { createMinimalDog, isValidDogGender, isValidDogStatus, normalizeDogGender, normalizeDogStatus } from './dog';

// Health-related types
export type { 
  HealthRecord, 
  Medication, 
  HealthIndicator,
  HealthAlert,
  HealthCertificate,
  MedicationAdministration,
  MedicationStatusResult,
  WeightRecord
} from './health';

export { 
  stringToHealthRecordType,
  mapToHealthRecord,
  mapToWeightRecord
} from './health';

// Weight-related types
export type { 
  GrowthRate,
  WeightDataPoint,
  GrowthStats,
  WeightEntryFormProps,
  WeightTrackerProps,
  WeightRecordsTableProps,
  WeightEntryDialogProps
} from './weight';

export {
  calculatePercentChange
} from './weight';

// Puppy-related types
export type {
  Puppy,
  PuppyWithAge,
  PuppyPhoto,
  PuppyCareLog,
  PuppyCareLogProps
} from './puppy';

// Reproductive cycle types
export type { BreedingRecord, PregnancyRecord } from './reproductive';
export { normalizeBreedingRecord } from './reproductive';
export type { 
  ReproductiveMilestone, 
  ReproductiveCycleData,
  BreedingChecklistItem,
  BreedingPrepFormData
} from './reproductive';

// Litter types 
export type { Dog as SimpleDog } from './litter';
export type { 
  Litter, 
  LitterWithDogs, 
  WhelpingRecord,
  WhelpingLogEntry,
  WhelpingObservation,
  PuppyMilestone,
  Dog as LitterDog
} from './litter';

// Puppy tracking types
export type { 
  PuppyAgeGroupData, 
  PuppyManagementStats,
  SocializationReactionType,
  SocializationCategory,
  SocializationCategoryOption,
  SocializationReactionOption,
  SocializationProgress,
  SocializationExperience,
  SocializationReaction,
  VaccinationSchedule,
  VaccinationRecord,
  PuppyAgeGroup,
  PuppyAgeGroupInfo
} from './puppyTracking';

// Daily care types
export * from './dailyCare';

// Facility types
export * from './facility';

// User and staff types
export * from './user';

// Socialization types
export * from './socialization';

// Welping types
export type {
  WelpingLog,
  WelpingObservation,
  PostpartumCare,
  WelpingLogEntry
} from './welping';

// Events types
export type {
  Event,
  NewEvent,
  CalendarEvent
} from './events';

// Export utility functions from weight-units and heat-cycles
export { 
  convertWeight, 
  getAppropriateWeightUnit, 
  formatWeight,
  standardizeWeightUnit,
  convertWeightToGrams
} from './weight-units';

export { 
  normalizeHeatIntensity 
} from './heat-cycles';

// Export type compatibility helpers 
export { 
  ensureDogType, 
  ensurePuppyType, 
  ensureWeightRecordType, 
  ensureHealthRecordType 
} from '../utils/typeCompatibility';
