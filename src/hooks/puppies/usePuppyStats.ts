
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyStats = (): {
  stats: PuppyManagementStats;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
} => {
  const [stats, setStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    totalLitters: 0,
    activeLitters: 0,
    availablePuppies: 0,
    reservedPuppies: 0,
    puppiesByAgeGroup: [],
    recentWeightChecks: 0,
    upcomingVaccinations: 0,
    weightCompletionRate: 0,
    vaccinationCompletionRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch total puppies
      const { data: puppiesData, error: puppiesError } = await supabase
        .from('puppies')
        .select('id, status')
        .order('birth_date', { ascending: false });

      if (puppiesError) throw puppiesError;

      // Fetch active litters
      const { data: littersData, error: littersError } = await supabase
        .from('litters')
        .select('id')
        .eq('status', 'active');

      if (littersError) throw littersError;

      // Fetch upcoming vaccinations
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      const { data: vaccinationsData, error: vaccinationsError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('id')
        .gte('due_date', today)
        .lte('due_date', nextWeekStr);

      if (vaccinationsError) throw vaccinationsError;

      // Fetch recent weight checks (last 48 hours)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString();

      const { data: weightChecksData, error: weightChecksError } = await supabase
        .from('weight_records')
        .select('id')
        .gte('created_at', twoDaysAgoStr)
        .not('puppy_id', 'is', null);

      if (weightChecksError) throw weightChecksError;

      // Calculate counts
      const totalPuppies = puppiesData?.length || 0;
      const availablePuppies = puppiesData?.filter(p => p.status === 'Available')?.length || 0;
      const reservedPuppies = puppiesData?.filter(p => p.status === 'Reserved')?.length || 0;
      const totalLitters = littersData?.length || 0;
      const activeLitters = littersData?.length || 0;
      const upcomingVaccinations = vaccinationsData?.length || 0;
      const recentWeightChecks = weightChecksData?.length || 0;

      // Calculate completion rates (placeholder values for now)
      const weightCompletionRate = 85; // placeholder
      const vaccinationCompletionRate = 90; // placeholder

      setStats({
        totalPuppies,
        totalLitters,
        activeLitters,
        availablePuppies,
        reservedPuppies,
        puppiesByAgeGroup: [], // This would need to be populated from elsewhere
        upcomingVaccinations,
        recentWeightChecks,
        weightCompletionRate,
        vaccinationCompletionRate
      });
    } catch (err) {
      console.error('Error fetching puppy stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch puppy statistics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats
  };
};

export default usePuppyStats;
