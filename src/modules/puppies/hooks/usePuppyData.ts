
import { useQuery } from '@tanstack/react-query';
import { fetchPuppyById } from '../services/puppyService';
import { PuppyWithAge } from '../types';

/**
 * Hook to fetch puppy data with age calculations
 */
export function usePuppyData(puppyId: string) {
  return useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      return await fetchPuppyById(puppyId);
    }
  });
}
