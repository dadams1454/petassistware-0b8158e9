
/**
 * Socialization-related type definitions
 */

// Re-export all socialization types from puppyTracking.ts for backward compatibility
// This ensures a clean import path for socialization types
export type {
  SocializationCategory,
  SocializationCategoryOption,
  SocializationReactionType,
  SocializationReaction,
  SocializationExperience,
  SocializationRecord,
  SocializationProgress
} from './puppyTracking';
