
/**
 * Weight Module - Provides functionality for tracking and managing weight records
 * 
 * This module centralizes all weight-related functionality to ensure consistency
 * across the application.
 */

// Export all types from the module
export * from './types';

// Export hooks with proper error handling
export * from './hooks/useWeightRecords';
export * from './hooks/useWeightStats';
export * from './hooks/useWeightData';
export * from './hooks/useWeightEntryForm';

// Re-export utility functions from main utils to maintain API consistency
export { 
  convertWeight, 
  calculatePercentChange, 
  formatWeight, 
  getAppropriateWeightUnit,
  convertWeightToGrams
} from '@/utils/weightConversion';
