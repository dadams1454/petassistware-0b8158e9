
/**
 * Re-export the canonical weight records hook from the new module
 * This maintains backward compatibility while encouraging use of the new path
 */
import { 
  useWeightRecords as useModuleWeightRecords
} from '@/modules/health/hooks/useWeightRecords';

/**
 * @deprecated - Please import from '@/modules/health' instead.
 * This hook will be removed in a future version.
 */
export const useWeightTracking = (options: { dogId?: string; puppyId?: string } = {}) => {
  console.warn(
    'Warning: You are using a deprecated version of useWeightTracking. ' +
    'Please update your import to use "@/modules/health" instead.'
  );
  
  return useModuleWeightRecords(options);
};
