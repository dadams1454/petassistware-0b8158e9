
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats, PuppyWithAge } from '@/types/puppyTracking';

export const usePuppyStats = (puppies: PuppyWithAge[]) => {
  const [puppyStats, setPuppyStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    availablePuppies: 0,
    reservedPuppies: 0,
    soldPuppies: 0,
    maleCount: 0,
    femaleCount: 0,
    averageWeight: 0,
    puppiesByColor: {},
    puppiesByAge: {},
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
          [...new Set(weightRecords.filter(r => r.puppy_id || r.dog_id).map(r => r.puppy_id || r.dog_id))] :
          [];
        
        // Update statistics
        setPuppyStats({
          totalPuppies: puppies.length,
          availablePuppies: puppies.filter(p => p.status?.toLowerCase() === 'available').length,
          reservedPuppies: puppies.filter(p => p.status?.toLowerCase() === 'reserved').length,
          soldPuppies: puppies.filter(p => p.status?.toLowerCase() === 'sold').length,
          maleCount: puppies.filter(p => p.gender?.toLowerCase() === 'male').length,
          femaleCount: puppies.filter(p => p.gender?.toLowerCase() === 'female').length,
          averageWeight: calculateAverageWeight(puppies),
          puppiesByColor: calculatePuppiesByColor(puppies),
          puppiesByAge: calculatePuppiesByAge(puppies),
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
        availablePuppies: 0,
        reservedPuppies: 0,
        soldPuppies: 0,
        maleCount: 0,
        femaleCount: 0,
        averageWeight: 0,
        puppiesByColor: {},
        puppiesByAge: {},
        activeLitters: 0,
        upcomingVaccinations: 0,
        recentWeightChecks: 0
      });
      setIsLoading(false);
    }
  }, [puppies]);

  // Helper function to calculate average weight
  const calculateAverageWeight = (puppies: PuppyWithAge[]): number => {
    const puppiesWithWeight = puppies.filter(p => p.current_weight);
    if (puppiesWithWeight.length === 0) return 0;
    
    const weights = puppiesWithWeight.map(p => {
      const weightStr = p.current_weight || '';
      const weightNumber = parseFloat(weightStr.split(' ')[0]);
      return isNaN(weightNumber) ? 0 : weightNumber;
    });
    
    const sum = weights.reduce((acc, weight) => acc + weight, 0);
    return sum / weights.length;
  };

  // Helper function to count puppies by color
  const calculatePuppiesByColor = (puppies: PuppyWithAge[]): Record<string, number> => {
    const result: Record<string, number> = {};
    puppies.forEach(puppy => {
      const color = puppy.color || 'Unknown';
      result[color] = (result[color] || 0) + 1;
    });
    return result;
  };

  // Helper function to count puppies by age group
  const calculatePuppiesByAge = (puppies: PuppyWithAge[]): Record<string, number> => {
    const result: Record<string, number> = {
      'Newborn (0-14 days)': 0,
      'Transitional (15-28 days)': 0,
      'Socialization (29-56 days)': 0,
      'Juvenile (57-84 days)': 0,
      'Adolescent (85+ days)': 0
    };
    
    puppies.forEach(puppy => {
      const age = puppy.ageInDays;
      if (age <= 14) result['Newborn (0-14 days)']++;
      else if (age <= 28) result['Transitional (15-28 days)']++;
      else if (age <= 56) result['Socialization (29-56 days)']++;
      else if (age <= 84) result['Juvenile (57-84 days)']++;
      else result['Adolescent (85+ days)']++;
    });
    
    return result;
  };

  return {
    puppyStats,
    isLoading,
    error
  };
};
