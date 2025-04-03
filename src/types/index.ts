
// Re-export types from various files
export type * from './customer';
export type * from './task';
export type * from './common';

// Re-export from litter with explicit renaming to avoid ambiguity
export type { 
  SimpleDog, 
  Dog, 
  Puppy, 
  // Rename PuppyWithAge to avoid ambiguity with puppyTracking.ts
  PuppyWithAge as LitterPuppyWithAge,
  Litter, 
  LitterWithDogs,
  WeightUnitValue
} from './litter';

// Export puppy tracking types
export type {
  PuppyWithAge,
  PuppyAgeGroupData,
  PuppyManagementStats,
  WeightUnit,
  WeightRecord,
  SocializationCategory,
  SocializationReaction,
  SocializationReactionObject,
  SocializationProgress
} from './puppyTracking';

// Export health types
export type {
  HealthRecord,
  HealthIndicator,
  Medication,
  MedicationAdministration,
  HealthCertificate
} from './health';

// Export enums
export { 
  HealthRecordTypeEnum,
  AppetiteLevelEnum,
  EnergyLevelEnum,
  StoolConsistencyEnum
} from './health';
