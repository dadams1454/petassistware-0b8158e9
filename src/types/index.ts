
// Re-export all type definitions with proper handling of duplicate names

// Common types
export * from './common';

// Weight related types
export {
  WeightRecord,
  GrowthStats,
  WeightTracking
} from './weight';

// Dog related types
export {
  Dog,
  DogGender,
  DogStatus,
  DogProfile,
  HealthRecord,
  HealthRecordTypeEnum,
  DocumentType
} from './dog';

// Health related types (different from Dog health types)
export {
  Medication,
  MedicationStatus,
  MedicationLog,
  MedicationFrequency,
  MedicationAdministrationRoute,
  MedicationStatusResult
} from './health';

// Reproductive and breeding types
export * from './reproductive';

// Litter and puppy tracking
export * from './litter';
export * from './welping';

// Puppy tracking with all its specialized types
export * from './puppyTracking';

// Socialization tracking
export * from './socialization';
