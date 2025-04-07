
/**
 * Puppy Module - Provides functionality for tracking and managing puppies
 * 
 * This module centralizes all puppy-related functionality to ensure consistency
 * across the application.
 */

// Export all types from the puppy module
export * from './types';

// Export hooks with proper error handling
export * from './hooks/usePuppyTracking';
export * from './hooks/usePuppyData';
export * from './hooks/usePuppyAgeGroups';
export * from './hooks/usePuppyStats';

// Export utility functions
export * from './utils/puppyAgeCalculator';
