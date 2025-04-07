
// Export all types from across the application
// This file functions as a central hub for importing types

// Dog-related types
export type { Dog, DogProfile, Vaccination, DogCareStatus } from './dog';
export { DogGender, DogStatus, DocumentType } from './dog';

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
  HealthRecordTypeEnum,
  MedicationStatusEnum,
  AppetiteLevelEnum, 
  EnergyLevelEnum, 
  StoolConsistencyEnum,
  AppetiteEnum,
  EnergyEnum,
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

// Common types
export type { 
  WeightUnit,
  WeightUnitInfo,
  WeightUnitOption
} from './common';
export { 
  standardizeWeightUnit, 
  weightUnits, 
  weightUnitOptions,
  weightUnitInfos,
  getWeightUnitInfo,
  getWeightUnitName,
  FrequencyTypes
} from './common';

// Puppy-related types
export type {
  Puppy,
  PuppyWithAge,
  PuppyPhoto,
  PuppyCareLog,
  PuppyCareLogProps
} from './puppy';

// Reproductive cycle types
export type { HeatCycle, BreedingRecord, PregnancyRecord, HeatIntensityType, HeatStage } from './reproductive';
export { ReproductiveStatus, normalizeBreedingRecord, HeatIntensity, HeatIntensityValues } from './reproductive';
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
  EventType,
  EventListProps,
  CalendarEvent
} from './events';

// Export utility functions
export { convertWeightToGrams, convertWeight, getAppropriateWeightUnit } from '../utils/weightConversion';
