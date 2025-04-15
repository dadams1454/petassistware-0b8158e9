
// Export standard types from core type definitions
export type { WeightUnit, WeightUnitInfo } from './weight-units';
export { 
  weightUnitInfos, 
  standardizeWeightUnit,
  getWeightUnitInfo
} from './weight-units';

// Export weight-related types
export type { WeightRecord, GrowthStats } from './weight';

// Export heat cycle related types
export type { HeatIntensityType, HeatCycle, HeatStage } from './heat-cycles';
export { 
  HeatIntensity, 
  HeatIntensityValues,
  mapHeatIntensityToType,
  mapHeatIntensityTypeToDisplay,
  stringToHeatIntensityType
} from './heat-cycles';

// Export health-related types
export type { 
  HealthRecord,
  Medication, 
  MedicationAdministration, 
  HealthIndicator,
  HealthCertificate
} from './health';

// Export health enums and string literal types
export type {
  HealthRecordType,
  MedicationStatusResult,
  AppetiteLevel, 
  EnergyLevel,
  StoolConsistency
} from './health-enums';

// Export health enum objects and utility functions
export {
  HealthRecordTypeEnum, 
  MedicationStatusEnum,
  MedicationStatus,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from './health-enums';

// Export puppy tracking types
export type {
  PuppyAgeGroup,
  PuppyAgeGroupInfo,
  PuppyAgeGroupData,
  PuppyManagementStats,
  PuppyMilestone,
  VaccinationScheduleItem,
  VaccinationRecord,
  PuppyWithAge
} from './puppyTracking';

// Export puppy types
export type { Puppy, PuppyPhoto, PuppyCareLog } from './puppy';

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
  WhelpingLogEntry
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
export type { WelpingLog, WelpingObservation as WelpingObs, PostpartumCare, WelpingLogEntry as WelpingLog2 } from './welping';

// Export socialization types
export type {
  SocializationCategory,
  SocializationCategoryOption,
  SocializationRecord,
  SocializationExperience,
  SocializationProgress,
  SocializationReactionType,
  SocializationReaction,
  SocializationReactionOption
} from './socialization';

// Export enums
export * from './enums';
