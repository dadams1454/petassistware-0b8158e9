
// Export all types from across the application
// This file functions as a central hub for importing types

// Dog-related types
export type { Dog, DogProfile, HealthRecord, Vaccination, WeightRecord, Litter, HeatCycle } from './dog';
export { DogGender, HealthRecordTypeEnum, DocumentType } from './dog';

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
  EnergyLevelEnum, 
  StoolConsistencyEnum,
  stringToHealthRecordType,
  mapToHealthRecord,
  mapToWeightRecord
} from './health';

// Breeding and reproductive types
export { 
  ReproductiveStatus, 
  normalizeBreedingRecord
} from './reproductive';
export type { 
  BreedingRecord, 
  PregnancyRecord, 
  ReproductiveMilestone, 
  ReproductiveCycleData,
  BreedingChecklistItem,
  BreedingPrepFormData,
  HeatIntensity,
  HeatStage
} from './reproductive';

// Litter and puppy types
export { Dog } from './litter';
export type { 
  Litter as LitterType, 
  LitterWithDogs, 
  Puppy, 
  PuppyWithAge,
  WhelpingRecord,
  WhelpingLogEntry,
  WhelpingObservation,
  PuppyMilestone,
  SimpleDog
} from './litter';

// Puppy tracking types
export type { 
  PuppyAgeGroup, 
  PuppyAgeGroupData, 
  PuppyManagementStats,
  SocializationRecord,
  SocializationReactionType,
  SocializationCategory,
  SocializationCategoryOption,
  SocializationReactionOption,
  SocializationProgress,
  PuppyCareLog,
  SocializationExperience,
  WeightRecord as PuppyWeightRecord,
  VaccinationScheduleItem,
  VaccinationRecord,
} from './puppyTracking';
export { PuppyWithAge } from './puppyTracking';

// Facility types
export * from './facility';

// User and staff types
export * from './user';

// Socialization types
export * from './socialization';

// Utility type for form values
export type WeightUnitValue = 'lb' | 'kg' | 'g' | 'oz' | 'lbs';
