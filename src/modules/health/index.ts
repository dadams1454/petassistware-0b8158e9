
/**
 * Health Module - Provides functionality for tracking and managing health records
 * 
 * This module centralizes all health-related functionality to ensure consistency
 * across the application.
 */

// Export all types from the health module
export * from './types';

// Export hooks with proper error handling
export * from './hooks/useHealthRecords';
export * from './hooks/useWeightRecords';

// Export utility functions
export * from './utils/healthRecordUtils';

// Re-export constants and enums for easier access
export {
  HealthRecordTypeEnum,
  AppetiteEnum,
  EnergyEnum,
  StoolConsistencyEnum,
  stringToHealthRecordType,
  getHealthRecordTypeDisplay
} from '@/types/health-enums';
