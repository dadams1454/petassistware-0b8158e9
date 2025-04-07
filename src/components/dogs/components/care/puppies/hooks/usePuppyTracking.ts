
import { PuppyManagementStats } from '@/types';
import { usePuppyTracking as useCanonicalPuppyTracking } from '@/hooks/puppyTracking/usePuppyTracking';

/**
 * @deprecated - Please import from '@/hooks/puppyTracking/usePuppyTracking' instead.
 * This hook will be removed in a future version.
 */
export const usePuppyTracking = (): PuppyManagementStats => {
  console.warn(
    'Warning: You are using a deprecated version of usePuppyTracking. ' +
    'Please update your import to use "@/hooks/puppyTracking/usePuppyTracking" instead.'
  );
  
  return useCanonicalPuppyTracking();
};
