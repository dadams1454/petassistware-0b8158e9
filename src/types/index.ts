
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
  SocializationCategory,
  SocializationReaction,
  SocializationReactionObject,
  SocializationReactionOption,
  SocializationCategoryOption,
  SocializationExperience,
  SocializationRecord,
  SocializationProgress,
  PuppyMilestone,
  VaccinationScheduleItem,
  VaccinationRecord,
  VaccinationSchedule,
  WeightRecord,
  PuppyWeightRecord
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

// Export common functions and types
export {
  WeightUnit,
  WeightUnitWithLegacy,
  standardizeWeightUnit,
  formatWeightWithUnit,
  getWeightUnitName
} from './common';
