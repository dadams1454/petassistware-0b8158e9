
// Export all types from across the application
// This file functions as a central hub for importing types

// Re-export all the enums from the central enums file
export * from './enums';

// Re-export all weight-units
export * from './weight-units';

// Re-export all health-enums
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
  MedicationStatusResult
} from './health';

export { 
  stringToHealthRecordType,
  mapToHealthRecord,
  mapToWeightRecord
} from './health';

// Weight-related types
export type { 
  WeightRecord,
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

// Export utility functions
export { convertWeightToGrams, convertWeight, getAppropriateWeightUnit, formatWeight } from '../utils/weightConversion';
export { ensureDogType, ensurePuppyType, ensureWeightRecordType, ensureHealthRecordType } from '../utils/typeCompatibility';
