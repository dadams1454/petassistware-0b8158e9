
/**
 * Common types used throughout the application
 */

// Re-export everything from weight-units 
export * from './weight-units';

// Re-export HeatIntensity and HeatIntensityType from heat-cycles
export type { HeatIntensityType, HeatCycle, HeatStage } from './heat-cycles';
export { HeatIntensity, HeatIntensityValues, mapHeatIntensityToType } from './heat-cycles';

// Re-export reproductive status from reproductive
export { ReproductiveStatus } from './reproductive';

// Re-export weight-related types
export type { WeightRecord, GrowthStats } from './weight';

// Re-export health enums
export {
  HealthRecordTypeEnum,
  MedicationStatusEnum,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from './health-enums';

// Re-export health types
export type {
  HealthRecordType,
  MedicationStatusResult,
  AppetiteLevel,
  EnergyLevel,
  StoolConsistency
} from './health-enums';

// Re-export health record interfaces
export type {
  HealthRecord,
  Medication,
  MedicationAdministration,
  HealthIndicator
} from './health';

// Re-export puppy tracking types
export type {
  PuppyAgeGroup,
  PuppyAgeGroupInfo,
  PuppyAgeGroupData,
  PuppyManagementStats
} from './puppyTracking';

// Re-export daily care types
export type {
  DailyCarelog,
  CareLogFormData,
  CareTaskPreset,
  DogCareStatus,
  DogFlag,
  DogCareObservation,
  CareScheduleItem
} from './dailyCare';

// Frequency types for medications and other scheduled events
export enum FrequencyTypes {
  DAILY = 'daily',
  TWICE_DAILY = 'twice daily',
  THREE_TIMES_DAILY = 'three times daily',
  EVERY_OTHER_DAY = 'every other day',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AS_NEEDED = 'as needed',
  ONCE_DAILY = 'once daily'
}

// Re-export the weight calculation utility functions
export { 
  calculatePercentChange 
} from '../utils/weightConversion';

// Re-export weightUnitInfos for backward compatibility
export { weightUnitInfos } from './weight-units';
