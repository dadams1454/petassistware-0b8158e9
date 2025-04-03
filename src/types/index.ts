
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
  PuppyWeightRecord,
  SocializationReactionType
} from './puppyTracking';

// Export health types
export type {
  HealthRecord,
  HealthIndicator,
  Medication,
  MedicationAdministration,
  HealthCertificate,
  WeightData,
  WeightRecord as HealthWeightRecord,
  WeightUnit
} from './health';

// Export enums explicitly
export { 
  HealthRecordTypeEnum,
  AppetiteLevelEnum,
  EnergyLevelEnum,
  StoolConsistencyEnum,
  healthRecordTypeToString,
  stringToHealthRecordType
} from './health';

// Export common functions and types
export type { 
  WeightUnit as CommonWeightUnit, 
  WeightUnitWithLegacy
} from './common';

export { 
  standardizeWeightUnit,
  formatWeightWithUnit,
  getWeightUnitName,
  weightUnits
} from './common';

// Export medication utilities
export {
  MedicationStatus,
  MedicationFrequency,
  getMedicationStatus,
  getTimeSlotsForFrequency,
  calculateNextDueDate
} from '@/utils/medicationUtils';
