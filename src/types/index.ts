
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
  WeightRecord as HealthWeightRecord
} from './health';

// Export reproductive types
export type {
  HeatCycle,
  HeatIntensity,
  BreedingRecord,
  PregnancyRecord,
  ReproductiveMilestone,
  WelpingLog,
  WelpingObservation
} from './reproductive';

// Export reproductive status enum
export { 
  ReproductiveStatus, 
  normalizeBreedingRecord,
  // Legacy constants
  IN_HEAT, 
  NOT_IN_HEAT, 
  PREGNANT, 
  NURSING, 
  RESTING 
} from './reproductive';

// Export enums explicitly
export { 
  HealthRecordTypeEnum,
  AppetiteLevelEnum,
  EnergyLevelEnum,
  StoolConsistencyEnum,
  healthRecordTypeToString,
  stringToHealthRecordType,
  mapToHealthRecord,
  mapToWeightRecord
} from './health';

// Export common weight unit types
export type { 
  WeightUnit,
  WeightUnitWithLegacy,
  WeightUnitOption
} from './common';

// Export common weight utility functions
export { 
  standardizeWeightUnit,
  formatWeightWithUnit,
  getWeightUnitName,
  weightUnits,
  convertWeight
} from './common';

// Export medication utilities
export {
  MedicationStatus,
  MedicationFrequency,
  getMedicationStatus,
  getTimeSlotsForFrequency,
  calculateNextDueDate,
  isComplexStatus,
  getStatusValue,
  getStatusColor
} from '@/utils/medicationUtils';

// Export type for medication status
export type { MedicationStatusResult, StatusWithColor } from '@/utils/medicationUtils';
