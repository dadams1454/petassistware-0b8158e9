
/**
 * Main exports for the puppies module
 */

// Re-export types
export type {
  PuppyWithAge,
  PuppyAgeGroup,
  PuppyAgeGroupInfo,
  PuppyAgeGroupData,
  PuppyManagementStats,
  PuppyTrackingOptions
} from './types';

// Re-export hooks
export { usePuppyTracking } from './hooks/usePuppyTracking';
export { usePuppyData } from './hooks/usePuppyData';
export { usePuppyAgeGroups } from './hooks/usePuppyAgeGroups';
export { usePuppyStats } from './hooks/usePuppyStats';

// Re-export utilities
export { calculateAgeInDays, calculateAgeInWeeks } from './utils/puppyAgeCalculator';
