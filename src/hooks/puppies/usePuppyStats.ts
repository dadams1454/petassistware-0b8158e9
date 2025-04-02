
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyStats = () => {
  const [stats, setStats] = useState<PuppyManagementStats>({
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
    recentWeightChecks: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const calculateStats = async () => {
    setIsLoading(true);
    try {
      // Get all puppies for basic stats
      const { data: puppies, error: puppiesError } = await supabase
        .from('puppies')
        .select('*');
        
      if (puppiesError) throw puppiesError;
      
      // Get litters for litter stats 
      const { data: litters, error: littersError } = await supabase
        .from('litters')
        .select('id, birth_date, status');
        
      if (littersError) throw littersError;
      
      // Get recent weight records
      const { data: weightRecords, error: weightError } = await supabase
        .from('weight_records')
        .select('*')
        .not('puppy_id', 'is', null)
        .order('date', { ascending: false })
        .limit(50);
        
      if (weightError) throw weightError;
      
      // Get upcoming vaccinations
      const { data: vaccinations, error: vaccinationsError } = await supabase
        .from('puppy_vaccination_schedule')
        .select('*')
        .gte('due_date', new Date().toISOString().slice(0, 10))
        .order('due_date', { ascending: true });
        
      if (vaccinationsError) throw vaccinationsError;
      
      // Calculate basic puppy stats
      const totalPuppies = puppies ? puppies.length : 0;
      const availablePuppies = puppies ? puppies.filter(p => p.status === 'Available').length : 0;
      const reservedPuppies = puppies ? puppies.filter(p => p.status === 'Reserved').length : 0;
      const soldPuppies = puppies ? puppies.filter(p => p.status === 'Sold').length : 0;
      const maleCount = puppies ? puppies.filter(p => p.gender === 'Male').length : 0;
      const femaleCount = puppies ? puppies.filter(p => p.gender === 'Female').length : 0;
      
      // Calculate litter stats
      const totalLitters = litters ? litters.length : 0;
      const activeLitters = litters ? litters.filter(l => l.status === 'active').length : 0;
      
      // Calculate weight stats
      let totalWeight = 0;
      let weightCount = 0;
      let recentWeightChecks = 0;
      
      if (weightRecords && weightRecords.length > 0) {
        // Count unique puppies with recent weight checks
        const recentWeightPuppyIds = new Set();
        
        // Get today's date
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        weightRecords.forEach(record => {
          if (record.puppy_id) {
            // Count for average only if weight and unit exist
            if (record.weight && record.weight_unit) {
              // Convert all weights to oz for averaging
              let weightInOz = record.weight;
              if (record.weight_unit === 'g') {
                weightInOz = record.weight * 0.035274;
              } else if (record.weight_unit === 'lbs') {
                weightInOz = record.weight * 16;
              } else if (record.weight_unit === 'kg') {
                weightInOz = record.weight * 35.274;
              }
              
              totalWeight += weightInOz;
              weightCount++;
            }
            
            // Check if this is a recent weight check
            const recordDate = new Date(record.date);
            if (recordDate >= sevenDaysAgo) {
              recentWeightPuppyIds.add(record.puppy_id);
            }
          }
        });
        
        recentWeightChecks = recentWeightPuppyIds.size;
      }
      
      // Calculate average weight
      const averageWeight = weightCount > 0 ? parseFloat((totalWeight / weightCount).toFixed(2)) : 0;
      
      // Upcoming vaccinations count
      const upcomingVaccinations = vaccinations ? vaccinations.length : 0;
      
      // Compile puppies by color
      const puppiesByColor: Record<string, number> = {};
      if (puppies) {
        puppies.forEach(puppy => {
          if (puppy.color) {
            puppiesByColor[puppy.color] = (puppiesByColor[puppy.color] || 0) + 1;
          }
        });
      }
      
      // Calculate puppies by age group
      const puppiesByAge: Record<string, number> = {
        'Neonatal (0-14 days)': 0,
        'Transitional (15-21 days)': 0,
        'Socialization (22-49 days)': 0, 
        'Juvenile (50-84 days)': 0,
        'Adolescent (85+ days)': 0
      };
      
      if (puppies && litters) {
        puppies.forEach(puppy => {
          // Find puppy's litter to get birth date if not on puppy record
          const birthDate = puppy.birth_date 
            ? new Date(puppy.birth_date)
            : litters.find(l => l.id === puppy.litter_id)?.birth_date 
              ? new Date(litters.find(l => l.id === puppy.litter_id)?.birth_date || '')
              : null;
              
          if (birthDate) {
            const ageInDays = Math.floor((new Date().getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (ageInDays <= 14) {
              puppiesByAge['Neonatal (0-14 days)']++;
            } else if (ageInDays <= 21) {
              puppiesByAge['Transitional (15-21 days)']++;
            } else if (ageInDays <= 49) {
              puppiesByAge['Socialization (22-49 days)']++;
            } else if (ageInDays <= 84) {
              puppiesByAge['Juvenile (50-84 days)']++;
            } else {
              puppiesByAge['Adolescent (85+ days)']++;
            }
          }
        });
      }
      
      // Update stats
      setStats({
        totalPuppies,
        availablePuppies, 
        reservedPuppies,
        soldPuppies,
        maleCount,
        femaleCount,
        averageWeight,
        weightUnit: 'oz',
        totalLitters,
        activeLitters,
        upcomingVaccinations,
        recentWeightChecks,
        puppiesByColor,
        puppiesByAge
      });
      
    } catch (err) {
      console.error('Error fetching puppy stats:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching puppy stats'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    calculateStats();
  }, []);
  
  return {
    stats,
    isLoading,
    error,
    refreshStats: calculateStats
  };
};
