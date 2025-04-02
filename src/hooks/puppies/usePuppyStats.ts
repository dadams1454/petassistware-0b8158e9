import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats, PuppyWithAge } from '@/types/puppyTracking';

// Default stats state
const defaultStats: PuppyManagementStats = {
  totalPuppies: 0,
  availablePuppies: 0,
  reservedPuppies: 0,
  soldPuppies: 0,
  maleCount: 0,
  femaleCount: 0,
  averageWeight: 0,
  weightUnit: 'oz',
  totalLitters: 0,
  activeLitters: 0,
  upcomingVaccinations: 0,
  recentWeightChecks: 0,
  puppiesByColor: {},
  puppiesByAge: {}
};

export const usePuppyStats = () => {
  const [stats, setStats] = useState<PuppyManagementStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPuppyStats = async () => {
    try {
      setIsLoading(true);
      
      // Get all puppies
      const { data: puppies, error: puppiesError } = await supabase
        .from('puppies')
        .select(`
          *,
          litters(id, birth_date, name)
        `);
      
      if (puppiesError) throw puppiesError;
      
      // Transform the puppies data to include ageInDays
      const typedPuppies: PuppyWithAge[] = (puppies || []).map(puppy => {
        // Calculate age in days
        let ageInDays = 0;
        
        const birthDate = puppy.birth_date || puppy.litters?.birth_date;
        if (birthDate) {
          const birthDateTime = new Date(birthDate).getTime();
          const now = new Date().getTime();
          ageInDays = Math.floor((now - birthDateTime) / (1000 * 60 * 60 * 24));
        }
        
        return {
          ...puppy,
          ageInDays,
          collar_color: puppy.color
        } as PuppyWithAge;
      });
      
      // Get active litters
      const { data: litters, error: littersError } = await supabase
        .from('litters')
        .select('id')
        .eq('status', 'active');
      
      if (littersError) throw littersError;
      
      // Get upcoming vaccinations
      const { data: vaccinations, error: vaccinationsError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('id')
        .gte('due_date', new Date().toISOString().split('T')[0])
        .is('completed', false);
      
      if (vaccinationsError) throw vaccinationsError;
      
      // Get recent weight checks (in the last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: weightChecks, error: weightChecksError } = await supabase
        .from('weight_records')
        .select('id')
        .gte('created_at', sevenDaysAgo.toISOString());
      
      if (weightChecksError) throw weightChecksError;
      
      // Calculate basic stats from the typed puppies
      const totalPuppies = typedPuppies.length;
      const availablePuppies = typedPuppies.filter(p => p.status === 'Available').length;
      const reservedPuppies = typedPuppies.filter(p => p.status === 'Reserved').length;
      const soldPuppies = typedPuppies.filter(p => p.status === 'Sold').length;
      const maleCount = typedPuppies.filter(p => p.gender === 'male' || p.gender === 'Male').length;
      const femaleCount = typedPuppies.filter(p => p.gender === 'female' || p.gender === 'Female').length;
      
      // Calculate average weight
      let totalWeight = 0;
      let weightCount = 0;
      let weightUnit = 'oz';
      
      typedPuppies.forEach(puppy => {
        if (puppy.current_weight) {
          const weightValue = typeof puppy.current_weight === 'string' 
            ? parseFloat(puppy.current_weight) 
            : puppy.current_weight;
          
          if (!isNaN(weightValue)) {
            totalWeight += weightValue;
            weightCount++;
          }
        }
      });
      
      // Group puppies by color
      const puppiesByColor: Record<string, number> = {};
      typedPuppies.forEach(puppy => {
        if (puppy.color) {
          puppiesByColor[puppy.color] = (puppiesByColor[puppy.color] || 0) + 1;
        }
      });
      
      // Group puppies by age (in weeks)
      const puppiesByAge: Record<string, number> = {
        '0-2 weeks': 0,
        '2-4 weeks': 0,
        '4-8 weeks': 0,
        '8-12 weeks': 0,
        '12+ weeks': 0
      };
      
      typedPuppies.forEach(puppy => {
        if (puppy.ageInDays <= 14) {
          puppiesByAge['0-2 weeks']++;
        } else if (puppy.ageInDays <= 28) {
          puppiesByAge['2-4 weeks']++;
        } else if (puppy.ageInDays <= 56) {
          puppiesByAge['4-8 weeks']++;
        } else if (puppy.ageInDays <= 84) {
          puppiesByAge['8-12 weeks']++;
        } else {
          puppiesByAge['12+ weeks']++;
        }
      });
      
      // Update the stats state
      setStats({
        totalPuppies,
        availablePuppies,
        reservedPuppies,
        soldPuppies,
        maleCount,
        femaleCount,
        averageWeight,
        weightUnit,
        puppiesByColor,
        puppiesByAge,
        totalLitters: litters?.length || 0,
        activeLitters: litters?.length || 0,
        upcomingVaccinations: vaccinations?.length || 0,
        recentWeightChecks: weightChecks?.length || 0
      });
    } catch (err) {
      console.error('Error fetching puppy stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch puppy statistics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPuppyStats();
  }, []);

  return { stats, isLoading, error, refreshStats: fetchPuppyStats };
};
