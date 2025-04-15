
import { fetchPuppyById } from '../services/puppyService';
import { PuppyWithAge } from '../types';
import { useApiQuery } from '@/api/hooks/useApiQuery';

/**
 * Hook to fetch puppy data with age calculations
 */
export function usePuppyData(puppyId: string) {
  return useApiQuery<PuppyWithAge>(
    ['puppy', puppyId],
    () => fetchPuppyById(puppyId),
    {
      enabled: !!puppyId,
      errorContext: 'Fetching puppy data'
    }
  );
}
