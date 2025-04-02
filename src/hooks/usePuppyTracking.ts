
import { useState, useEffect, useCallback } from 'react';
import { PuppyManagementStats, PuppyWithAge } from '@/types/puppyTracking';
import { supabase } from '@/integrations/supabase/client';
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { usePuppyAgeGroups } from '@/hooks/puppies/usePuppyAgeGroups';

export const usePuppyTracking = () => {
  const [stats, setStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    activeLitters: 0,
    upcomingVaccinations: 0,
    recentWeightChecks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get puppy data and age groups
  const { puppies, isLoading: isPuppiesLoading, error: puppiesError } = usePuppyData();
  const { ageGroups, puppiesByAgeGroup } = usePuppyAgeGroups(puppies || []);
  
  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch total puppies
      const { count: totalPuppies, error: puppiesError } = await supabase
        .from('puppies')
        .select('*', { count: 'exact', head: true });
      
      if (puppiesError) throw puppiesError;
      
      // Fetch active litters
      const { count: activeLitters, error: littersError } = await supabase
        .from('litters')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (littersError) throw littersError;
      
      // Fetch upcoming vaccinations
      const now = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(now.getDate() + 14);
      
      const { count: upcomingVaccinations, error: vaccinationsError } = await supabase
        .from('puppy_vaccinations')
        .select('*', { count: 'exact', head: true })
        .gte('due_date', now.toISOString().split('T')[0])
        .lte('due_date', twoWeeksFromNow.toISOString().split('T')[0])
        .is('vaccination_date', null);
      
      if (vaccinationsError) throw vaccinationsError;
      
      // Fetch recent weight checks in last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      
      const { count: recentWeightChecks, error: weightsError } = await supabase
        .from('weight_records')
        .select('*', { count: 'exact', head: true })
        .gte('date', oneWeekAgo.toISOString().split('T')[0]);
      
      if (weightsError) throw weightsError;
      
      setStats({
        totalPuppies: totalPuppies || 0,
        activeLitters: activeLitters || 0,
        upcomingVaccinations: upcomingVaccinations || 0,
        recentWeightChecks: recentWeightChecks || 0
      });
      
    } catch (err) {
      console.error('Error fetching puppy tracking stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch puppy tracking stats'));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);
  
  // Add refreshStats alias for compatibility
  const refreshStats = refresh;
  
  // Combine loading states
  const isAllLoading = isLoading || isPuppiesLoading;
  // Combine errors
  const combinedError = error || puppiesError;
  
  return { 
    stats, 
    puppies: puppies || [],
    ageGroups: ageGroups || [],
    puppiesByAgeGroup: puppiesByAgeGroup || {},
    isLoading: isAllLoading, 
    error: combinedError, 
    refresh, 
    refreshStats 
  };
};

export default usePuppyTracking;
