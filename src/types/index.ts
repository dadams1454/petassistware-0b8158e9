
/**
 * Main types entry point
 * This file consolidates type exports from across the application
 */

// Export unified type system - preferred way to import types
export * from './unified';

// Legacy type exports for backward compatibility
// These will be gradually phased out in favor of the unified system
export type { WeightUnit, WeightUnitInfo } from './weight-units';
export { 
  weightUnitInfos, 
  standardizeWeightUnit,
  getWeightUnitInfo
} from './weight-units';

// Heat cycle types for compatibility
export type { 
  HeatIntensityType, 
  HeatCycle,
  HeatStage 
} from './heat-cycles';

export { 
  HeatIntensity, 
  HeatIntensityValues,
  mapHeatIntensityToType,
  stringToHeatIntensityType,
  mapHeatIntensityTypeToDisplay
} from './heat-cycles';

// Export additional type guards
export {
  isHeatIntensityType,
  isHeatCycle
} from '../utils/typeGuards';

// Legacy health-related exports
export type { 
  HealthRecord,
  Medication, 
  MedicationAdministration, 
  HealthIndicator,
  HealthCertificate
} from './health';

export type {
  HealthRecordType,
  MedicationStatusResult,
  AppetiteLevel, 
  EnergyLevel,
  StoolConsistency
} from './health-enums';

export {
  HealthRecordTypeEnum, 
  MedicationStatusEnum,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from './health-enums';

// Export for backward compatibility
export { 
  convertWeightToGrams, 
  convertWeight, 
  formatWeight, 
  getAppropriateWeightUnit,
  calculatePercentChange
} from '../utils/weightConversion';

// Legacy animal type exports
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
export type { Puppy, PuppyPhoto, PuppyCareLog } from './puppy';
export type { 
  Litter, 
  LitterWithDogs, 
  SimpleDog, 
  WhelpingRecord, 
  WhelpingObservation, 
  WhelpingLogEntry
} from './litter';

// Export type utilities for working with the unified system
export {
  toDog,
  toPuppy,
  toWeightRecord,
  toHealthRecord
} from '../utils/typeConversion';

export {
  isWeightUnit,
  isAnimalGender,
  isDogStatus,
  isPuppyStatus,
  isDog,
  isPuppy,
  isHealthRecord,
  isAppetiteLevel,
  isEnergyLevel,
  isStoolConsistency,
  isValidDate,
  isValidISODateString,
  isValidUUID
} from '../utils/typeGuards';

