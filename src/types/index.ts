// Export standard types from core type definitions
export type { WeightUnit, WeightUnitInfo } from './weight-units';
export { 
  WeightUnitEnum,
  weightUnitInfos, 
  standardizeWeightUnit
} from './weight-units';

// Export weight-related types (only export once)
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

// Export health enums separately to avoid duplicate exports
export {
  HealthRecordTypeEnum, 
  HealthRecordType,
  MedicationStatusEnum, 
  MedicationStatusResult,
  AppetiteLevel, 
  AppetiteEnum,
  EnergyLevel, 
  EnergyEnum,
  StoolConsistency, 
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from './health-enums';

// Export enum helpers
export * from './enums';

// Export dog and puppy types
export * from './dog';
export * from './puppy';
export * from './litter';
export * from './dailyCare';

// Export puppy tracking types
export * from './puppyTracking';

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
