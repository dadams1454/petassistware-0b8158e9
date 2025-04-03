
// Export all types from across the application
// This file functions as a central hub for importing types

// Dog-related types
export type { Dog, DogProfile, HealthRecord, Vaccination, WeightRecord, Litter } from './dog';
export { DogGender, HealthRecordTypeEnum, DocumentType } from './dog';

// Common types
export type { WeightUnit, WeightUnitWithLegacy } from './common';
export { standardizeWeightUnit, weightUnits } from './common';

// Health-related types
export type { 
  Medication, 
  MedicationStatus, 
  MedicationStatusResult,
  VaccinationSchedule,
  GrowthStats,
  HealthIndicator,
  HealthAlert
} from './health';
export { AppetiteEnum, stringToHealthRecordType } from './health';

// Breeding and reproductive types
export * from './breeding';
export * from './reproductive';

// Litter and puppy types
export * from './litter';

// Puppy tracking types
export * from './puppyTracking';

// Facility types
export * from './facility';

// User and staff types
export * from './user';

// Utility type for form values
export type WeightUnitValue = 'lb' | 'kg' | 'g' | 'oz' | 'lbs';
