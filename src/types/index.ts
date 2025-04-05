
// Export all types from across the application
// This file functions as a central hub for importing types

// Dog-related types
export type { Dog, DogProfile, Vaccination } from './dog';
export { DogGender, DogStatus, DocumentType } from './dog';

// Health-related types
export type { 
  HealthRecord, 
  Medication, 
  MedicationStatusEnum, // Correctly export as a type
  MedicationStatus,     // Include the type alias
  MedicationStatusResult,
  VaccinationSchedule as HealthVaccinationSchedule,
  GrowthStats,
  HealthIndicator,
  HealthAlert,
  HealthCertificate,
  MedicationAdministration,
  WeightRecord
} from './health';

export { 
  HealthRecordTypeEnum,
  AppetiteEnum, 
  EnergyEnum, 
  StoolConsistencyEnum,
  mapToHealthRecord,
  mapToWeightRecord,
  MedicationStatusEnum as MedicationStatusEnumValue, // Export the enum values separately
  AppetiteLevelEnum,
  EnergyLevelEnum
} from './health';

// Reproductive cycle types
export type { HeatCycle, BreedingRecord, PregnancyRecord, HeatIntensityType, HeatStage } from './reproductive';
export { ReproductiveStatus, normalizeBreedingRecord, HeatIntensity, HeatIntensityValues } from './reproductive';
export type { 
  ReproductiveMilestone, 
  ReproductiveCycleData,
  BreedingChecklistItem,
  BreedingPrepFormData
} from './reproductive';

// Common types
export type { WeightUnitWithLegacy } from './common';
export { standardizeWeightUnit, weightUnits, weightUnitOptions } from './common';
export type { WeightUnit } from './common';  // Explicitly export WeightUnit as a type

// Litter and puppy types
export { type Dog as SimpleDog } from './litter';
export type { 
  Litter, 
  LitterWithDogs, 
  Puppy, 
  PuppyWithAge,
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
  PuppyCareLog,
  SocializationExperience,
  SocializationReaction,
  WeightRecord as PuppyWeightRecord,
  PuppyMilestone as PuppyTrackingMilestone,
  VaccinationSchedule,
  VaccinationRecord,
  PuppyAgeGroup
} from './puppyTracking';

// Daily care types
export type {
  DogCareStatus,
  DailyCareSummary,
  CareLogEntry,
  CareActivityLog,
  DailyCarelog,
  CareLogFormData,
  CareTaskPreset,
  DogFlag,
  DogSpecialCondition
} from './dailyCare';

// Facility types
export * from './facility';

// User and staff types
export * from './user';

// Socialization types
export * from './socialization';

// Weight types
export * from './weight';

// Welping types
export * from './welping';
