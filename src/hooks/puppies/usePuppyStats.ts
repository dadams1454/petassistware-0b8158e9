
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats, PuppyWithAge } from '@/types/puppyTracking';

export const usePuppyStats = (puppies: PuppyWithAge[]) => {
  const [puppyStats, setPuppyStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    activeLitters: 0,
    upcomingVaccinations: 0,
    recentWeightChecks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        // Get unique litter IDs
        const litterIds = [...new Set(puppies.map(puppy => puppy.litter_id))];
        
        // Fetch recent weight records
        const now = new Date();
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);
        
        const { data: weightRecords, error: weightError } = await supabase
          .from('weight_records')
          .select('*')
          .gt('created_at', threeDaysAgo.toISOString());
        
        if (weightError) throw weightError;
        
        // Count unique puppies with weight records
        const puppiesWithWeightRecords = weightRecords ? 
          [...new Set(weightRecords.filter(r => r.puppy_id).map(r => r.puppy_id))] :
          [];
        
        // Update statistics
        setPuppyStats({
          totalPuppies: puppies.length,
          activeLitters: litterIds.length,
          upcomingVaccinations: Math.floor(Math.random() * 5), // Placeholder - would need actual vaccination data
          recentWeightChecks: puppiesWithWeightRecords.length
        });
      } catch (err) {
        console.error('Error fetching puppy statistics:', err);
        setError('Failed to load puppy statistics');
      } finally {
        setIsLoading(false);
      }
    };

    if (puppies.length > 0) {
      fetchStatistics();
    } else {
      setPuppyStats({
        totalPuppies: 0,
        activeLitters: 0,
        upcomingVaccinations: 0,
        recentWeightChecks: 0
      });
      setIsLoading(false);
    }
  }, [puppies]);

  return {
    puppyStats,
    isLoading,
    error
  };
};
