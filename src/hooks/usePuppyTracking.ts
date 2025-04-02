
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyTracking = () => {
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
  const [error, setError] = useState<string | null>(null);
  const [puppies, setPuppies] = useState([]);
  const [ageGroups, setAgeGroups] = useState({});

  useEffect(() => {
    fetchPuppyStats();
  }, []);

  const fetchPuppyStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch puppies count
      const { count: totalPuppies, error: puppiesError } = await supabase
        .from('puppies')
        .select('*', { count: 'exact', head: true });

      if (puppiesError) throw puppiesError;

      // Fetch active litters count
      const { count: activeLitters, error: littersError } = await supabase
        .from('litters')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (littersError) throw littersError;

      // Fetch upcoming vaccinations
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const { count: upcomingVaccinations, error: vaccinationsError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*', { count: 'exact', head: true })
        .gte('due_date', today.toISOString().split('T')[0])
        .lte('due_date', nextWeek.toISOString().split('T')[0]);

      if (vaccinationsError) throw vaccinationsError;

      // Fetch recent weight records
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const { count: recentWeightChecks, error: weightError } = await supabase
        .from('weight_records')
        .select('*', { count: 'exact', head: true })
        .gte('date', yesterday.toISOString().split('T')[0]);

      if (weightError) throw weightError;

      // Update stats
      setStats({
        totalPuppies: totalPuppies || 0,
        totalLitters: 0, // You would need another query to get this
        activeLitters: activeLitters || 0,
        availablePuppies: 0, // Would need to query for available puppies
        reservedPuppies: 0, // Would need to query for reserved puppies
        upcomingVaccinations: upcomingVaccinations || 0,
        recentWeightChecks: recentWeightChecks || 0,
        puppiesByAgeGroup: {}, // Would need additional queries for this
        weightCompletionRate: 0, // Need additional queries
        vaccinationCompletionRate: 0 // Need additional queries
      });
    } catch (err: any) {
      console.error('Error fetching puppy stats:', err);
      setError(err.message || 'An error occurred while fetching puppy statistics');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    puppies,
    ageGroups,
    refreshStats: fetchPuppyStats
  };
};

export default usePuppyTracking;
