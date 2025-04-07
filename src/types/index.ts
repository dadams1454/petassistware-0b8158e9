
// Export standard types from core type definitions
export type { WeightUnit, WeightUnitInfo } from './weight-units';
export { 
  WeightUnitEnum,
  weightUnitInfos, 
  standardizeWeightUnit
} from './weight-units';

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
  MedicationStatusResult, 
  Medication, 
  MedicationAdministration, 
  HealthIndicator 
} from './health';

export {
  HealthRecordTypeEnum, 
  HealthRecordType,
  MedicationStatus, 
  MedicationStatusEnum,
  AppetiteLevel, 
  AppetiteEnum,
  EnergyLevel, 
  EnergyEnum,
  StoolConsistency, 
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from './health-enums';

// Export weight-related types
export type { WeightRecord, GrowthStats } from './weight';

// Export enum helpers
export * from './enums';

// Export dog and puppy types
export * from './dog';
export * from './puppy';
export * from './litter';
export * from './dailyCare';

// Export weight utilities
export { 
  convertWeightToGrams, 
  convertWeight, 
  formatWeight, 
  getAppropriateWeightUnit 
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
