
import { useMemo } from 'react';
import { PUPPY_AGE_GROUPS } from '@/data/puppyAgeGroups';
import { PuppyAgeGroupInfo } from '@/types/puppyTracking';

/**
 * Hook that provides access to puppy age group definitions
 */
export function usePuppyAgeGroups(): { ageGroups: PuppyAgeGroupInfo[] } {
  const ageGroups = useMemo(() => PUPPY_AGE_GROUPS, []);
  
  return {
    ageGroups
  };
}
