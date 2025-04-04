
// Export all types from across the application
// This file functions as a central hub for importing types

// Dog-related types
export type { Dog, DogProfile, Vaccination } from './dog';
export { DogGender, DogStatus, DocumentType } from './dog';

// Health-related types
export type { 
  HealthRecord, 
  Medication, 
  MedicationStatusResult,
  GrowthStats,
  HealthIndicator,
  HealthAlert,
  HealthCertificate,
  MedicationAdministration,
  WeightRecord,
} from './health';

export { 
  HealthRecordTypeEnum,
  MedicationStatusEnum,
  AppetiteLevelEnum, 
  EnergyLevelEnum, 
  StoolConsistencyEnum,
  mapToHealthRecord,
  mapToWeightRecord,
  AppetiteEnum,
  EnergyEnum,
  stringToHealthRecordType
} from './health';

// Common types
export type { 
  WeightUnit,
  WeightUnitWithLegacy,
  WeightUnitInfo,
  WeightUnitOption
} from './common';
export { 
  standardizeWeightUnit, 
  weightUnits, 
  weightUnitOptions,
  weightUnitInfos,
  getWeightUnitInfo,
  getWeightUnitName
} from './common';

// Reproductive cycle types
export type { HeatCycle, BreedingRecord, PregnancyRecord, HeatIntensityType, HeatStage } from './reproductive';
export { ReproductiveStatus, normalizeBreedingRecord, HeatIntensity, HeatIntensityValues } from './reproductive';
export type { 
  ReproductiveMilestone, 
  ReproductiveCycleData,
  BreedingChecklistItem,
  BreedingPrepFormData
} from './reproductive';

// Litter and puppy types
export type { Dog as SimpleDog } from './litter';
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

// Weight types
export * from './weight';

// Welping types
export * from './welping';
