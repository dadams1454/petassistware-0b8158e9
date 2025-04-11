
/**
 * Socialization-related type definitions
 */

// Import and re-export all socialization types from puppyTracking.ts
// This ensures all types referenced in the index.ts file are available
import type {
  SocializationCategory,
  SocializationCategoryOption,
  SocializationReactionType,
  SocializationReaction,
  SocializationReactionOption,
  SocializationExperience,
  SocializationProgress
} from './puppyTracking';

// Re-export all imported types
export type {
  SocializationCategory,
  SocializationCategoryOption,
  SocializationReactionType,
  SocializationReaction,
  SocializationReactionOption,
  SocializationExperience,
  SocializationProgress
};

// Define SocializationRecord which wasn't in the error message but is exported
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory | { id: string; name: string };
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType | string;
  notes?: string;
  created_at: string;
}
