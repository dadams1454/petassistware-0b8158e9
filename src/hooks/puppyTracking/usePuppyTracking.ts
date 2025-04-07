
/**
 * Re-export the canonical puppy tracking hook from the new module
 * This maintains backward compatibility while encouraging use of the new path
 */
import { usePuppyTracking as useModulePuppyTracking, PuppyTrackingOptions } from '@/modules/puppies/hooks/usePuppyTracking';
import { PuppyManagementStats } from '@/types/puppyTracking';

/**
 * Hook for tracking and managing puppy data (compatible with existing code)
 * This is the canonical implementation that should be used throughout the application
 * 
 * @param options Optional configuration options
 * @returns PuppyManagementStats containing puppy data, statistics, and age groupings
 */
export const usePuppyTracking = (options?: PuppyTrackingOptions): PuppyManagementStats => {
  return useModulePuppyTracking(options);
};
