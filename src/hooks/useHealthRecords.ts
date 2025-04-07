
/**
 * Re-export the canonical health records hook from the new module
 * This maintains backward compatibility while encouraging use of the new path
 */
import { 
  useHealthRecords as useModuleHealthRecords, 
  HealthRecordOptions 
} from '@/modules/health/hooks/useHealthRecords';

/**
 * @deprecated - Please import from '@/modules/health' instead.
 * This hook will be removed in a future version.
 */
export const useHealthRecords = (options: HealthRecordOptions = {}) => {
  console.warn(
    'Warning: You are using a deprecated version of useHealthRecords. ' +
    'Please update your import to use "@/modules/health" instead.'
  );
  
  return useModuleHealthRecords(options);
};
