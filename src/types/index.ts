
// Export all types from across the application
// This file functions as a central hub for importing types

// Dog-related types
export type { Dog, DogProfile, HealthRecord, Vaccination, WeightRecord } from './dog';
export { DogGender, HealthRecordTypeEnum, DocumentType } from './dog';
export type { HeatCycle } from './reproductive';

// Common types
export type { WeightUnit, WeightUnitWithLegacy } from './common';
export { standardizeWeightUnit, weightUnits } from './common';

// Health-related types
export type { 
  Medication, 
  MedicationStatus, 
  MedicationStatusResult,
  VaccinationSchedule,
  GrowthStats,
  HealthIndicator,
  HealthAlert,
  HealthCertificate,
  MedicationAdministration
} from './health';
export { 
  AppetiteEnum, 
  EnergyEnum, 
  StoolConsistencyEnum,
  mapToHealthRecord,
  mapToWeightRecord
} from './health';

// Breeding and reproductive types
export { 
  ReproductiveStatus, 
  normalizeBreedingRecord,
  HeatIntensity
} from './reproductive';
export type { 
  BreedingRecord, 
  PregnancyRecord, 
  ReproductiveMilestone, 
  ReproductiveCycleData,
  BreedingChecklistItem,
  BreedingPrepFormData,
  HeatStage
} from './reproductive';

// Litter and puppy types
export { Dog as SimpleDog } from './litter';
export type { 
  Litter as LitterType, 
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
  WeightRecord as PuppyWeightRecord,
  VaccinationScheduleItem as PuppyVaccinationSchedule,
  VaccinationRecord,
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

// Utility type for form values
export type WeightUnitValue = 'lb' | 'kg' | 'g' | 'oz' | 'lbs';
