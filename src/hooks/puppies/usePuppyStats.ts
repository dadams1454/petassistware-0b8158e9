
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats } from '@/types/puppyTracking';

export function usePuppyStats() {
  const [stats, setStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    totalLitters: 0,
    activeLitters: 0,
    availablePuppies: 0,
    reservedPuppies: 0,
    upcomingVaccinations: 0,
    recentWeightChecks: 0,
    puppiesByAgeGroup: {},
    weightCompletionRate: 0,
    vaccinationCompletionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPuppyStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch basic puppy counts
      const { data: puppiesData, error: puppiesError } = await supabase
        .from('puppies')
        .select('id, status, birth_date', { count: 'exact' });

      if (puppiesError) throw puppiesError;

      // Fetch litter counts
      const { data: littersData, error: littersError } = await supabase
        .from('litters')
        .select('id, status', { count: 'exact' });

      if (littersError) throw littersError;

      // Calculate statistics
      const totalPuppies = puppiesData?.length || 0;
      const availablePuppies = puppiesData?.filter(p => p.status === 'Available').length || 0;
      const reservedPuppies = puppiesData?.filter(p => p.status === 'Reserved').length || 0;
      const totalLitters = littersData?.length || 0;
      const activeLitters = littersData?.filter(l => l.status === 'active').length || 0;

      // Mock data for now - will be implemented in future
      const upcomingVaccinations = Math.floor(Math.random() * 10);
      const recentWeightChecks = Math.floor(Math.random() * totalPuppies);
      
      // Create empty puppiesByAgeGroup for now
      const puppiesByAgeGroup: Record<string, number> = {};
      
      // Mock completion rates
      const weightCompletionRate = Math.round(Math.random() * 100);
      const vaccinationCompletionRate = Math.round(Math.random() * 100);

      setStats({
        totalPuppies,
        totalLitters,
        activeLitters,
        availablePuppies,
        reservedPuppies,
        upcomingVaccinations,
        recentWeightChecks,
        puppiesByAgeGroup,
        weightCompletionRate,
        vaccinationCompletionRate
      });

    } catch (err) {
      console.error('Error fetching puppy stats:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPuppyStats();
  }, [fetchPuppyStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchPuppyStats
  };
}
