
// Export standard types from core type definitions
export type { WeightUnit, WeightUnitInfo } from './weight-units';
export { 
  WeightUnitEnum,
  weightUnitInfos, 
  standardizeWeightUnit
} from './weight-units';

// Export weight-related types
export type { WeightRecord, GrowthStats } from './weight';

// Export heat cycle related types
export type { HeatIntensityType, HeatCycle, HeatStage } from './heat-cycles';
export { 
  HeatIntensity, 
  HeatIntensityValues,
  mapHeatIntensityToType,
  mapHeatIntensityTypeToDisplay
} from './heat-cycles';

// Export health-related types and enums
export type { 
  HealthRecord,
  Medication, 
  MedicationAdministration, 
  HealthIndicator 
} from './health';

// Export health enums
export {
  HealthRecordTypeEnum, 
  MedicationStatusEnum, 
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from './health-enums';

// Export health type definitions using export type
export type {
  HealthRecordType,
  MedicationStatusResult,
  AppetiteLevel, 
  EnergyLevel,
  StoolConsistency
} from './health-enums';

// Export puppy tracking types with explicit naming to avoid conflicts
export type {
  PuppyAgeGroup,
  PuppyAgeGroupInfo,
  PuppyAgeGroupData,
  PuppyManagementStats
} from './puppyTracking';

// Export puppy types
export type { Puppy, PuppyWithAge, PuppyPhoto, PuppyCareLog } from './puppy';

// Export dog types and helpers
export { 
  DogGender, 
  DogStatus, 
  isValidDogGender, 
  normalizeDogGender, 
  isValidDogStatus, 
  normalizeDogStatus, 
  createMinimalDog 
} from './dog';
export type { Dog, DogProfile, DogCareStatus, Vaccination } from './dog';

// Export litter types
export type { 
  Litter, 
  LitterWithDogs, 
  SimpleDog, 
  WhelpingRecord, 
  WhelpingObservation, 
  WhelpingLogEntry, 
  PuppyMilestone 
} from './litter';

// Export daily care types
export type {
  DailyCarelog,
  CareLogFormData,
  CareTaskPreset,
  DogFlag,
  DogCareObservation,
  CareScheduleItem
} from './dailyCare';

// Export weight utilities
export { 
  convertWeightToGrams, 
  convertWeight, 
  formatWeight, 
  getAppropriateWeightUnit,
  calculatePercentChange
} from '../utils/weightConversion';

// Export welping types
export type { WelpingLog, WelpingObservation, PostpartumCare, WelpingLogEntry } from './welping';

// Export socialization types
export type {
  SocializationCategory,
  SocializationCategoryOption,
  SocializationRecord,
  SocializationExperience,
  SocializationProgress,
  SocializationReactionType,
  SocializationReaction
} from './socialization';

// Export the central enum types
export * from './enums';
