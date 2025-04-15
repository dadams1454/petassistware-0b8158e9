
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats } from '@/types/puppyTracking';
import { usePuppyTracking } from './usePuppyTracking';

/**
 * Hook that provides summary statistics for puppies
 */
export function usePuppyStats(): Partial<PuppyManagementStats> {
  const {
    puppies,
    totalPuppies,
    puppiesByStatus,
    maleCount,
    femaleCount,
    isLoading,
    error,
    refetch
  } = usePuppyTracking();
  
  // Get counts by status
  const availableCount = puppiesByStatus?.Available?.length || 0;
  const reservedCount = puppiesByStatus?.Reserved?.length || 0;
  const soldCount = puppiesByStatus?.Sold?.length || 0;
  
  return {
    puppies,
    totalPuppies,
    availableCount,
    reservedCount,
    soldCount,
    maleCount,
    femaleCount,
    puppiesByStatus,
    isLoading,
    error,
    refetch
  };
}
