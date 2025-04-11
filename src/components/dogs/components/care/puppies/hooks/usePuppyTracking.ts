
import { PuppyManagementStats } from '@/types';
import { usePuppyTracking as useCanonicalPuppyTracking } from '@/modules/puppies/hooks/usePuppyTracking';

/**
 * @deprecated - Please import from '@/modules/puppies' instead.
 * This hook will be removed in a future version.
 */
export const usePuppyTracking = (): PuppyManagementStats => {
  console.warn(
    'Warning: You are using a deprecated version of usePuppyTracking. ' +
    'Please update your import to use "@/modules/puppies" instead.'
  );
  
  const puppyStats = useCanonicalPuppyTracking();
  
  // Add the required properties if they're not present
  return {
    ...puppyStats,
    puppies: puppyStats.puppies || [],
    ageGroups: puppyStats.ageGroups || [],
    puppiesByAgeGroup: puppyStats.puppiesByAgeGroup || {},
    byAgeGroup: puppyStats.byAgeGroup || {
      newborn: [],
      twoWeek: [],
      fourWeek: [],
      sixWeek: [],
      eightWeek: [],
      tenWeek: [],
      twelveWeek: [],
      older: [],
      all: [],
      total: 0
    },
    maleCount: puppyStats.maleCount || puppyStats.byGender?.male || 0,
    femaleCount: puppyStats.femaleCount || puppyStats.byGender?.female || 0,
    puppiesByStatus: puppyStats.puppiesByStatus || {},
    currentWeek: puppyStats.currentWeek || 0,
    total: puppyStats.total || { count: 0, male: 0, female: 0 }
  };
};
