
/**
 * Health Module - Provides functionality for tracking and managing health records
 */

// Export all types from the health module
export * from './types/medicationTypes';

// Re-export constants and enums for easier access
export {
  HealthRecordTypeEnum,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from '@/types/health-enums';

// Re-export medication utilities
export {
  MedicationFrequencyConstants,
  ExtendedMedicationStatusEnum,
  getStatusLabel,
  processMedicationLogs,
  calculateMedicationStatus
} from '@/utils/medicationUtils';
