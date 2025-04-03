
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays } from 'date-fns';
import { PuppyWithAge, PuppyAgeGroupData, PuppyManagementStats } from '@/types/puppyTracking';
import { standardizeWeightUnit } from '@/types/common';

// Define default age groups for puppies
const defaultAgeGroups: PuppyAgeGroupData[] = [
  {
    id: 'newborn',
    label: 'Newborn',
    minAge: 0,
    maxAge: 14,
    description: 'Puppies from birth to 2 weeks',
    color: '#AADEA7' // Light green
  },
  {
    id: 'transitional',
    label: 'Transitional',
    minAge: 15,
    maxAge: 21,
    description: 'Puppies from 2-3 weeks',
    color: '#C6E3B9' // Pale green
  },
  {
    id: 'socialization',
    label: 'Socialization',
    minAge: 22,
    maxAge: 49,
    description: 'Puppies from 3-7 weeks',
    color: '#FEE8A0' // Light yellow
  },
  {
    id: 'early-training',
    label: 'Early Training',
    minAge: 50,
    maxAge: 84,
    description: 'Puppies from 7-12 weeks',
    color: '#FDD4B8' // Light orange
  },
  {
    id: 'adolescent',
    label: 'Adolescent',
    minAge: 85,
    maxAge: 365,
    description: 'Puppies from 12 weeks to 1 year',
    color: '#FFB7B7' // Light red
  }
];

/**
 * Hook for tracking and managing puppies with age calculations
 * @returns Puppy management stats and data
 */
export const usePuppyTracking = (): PuppyManagementStats => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchPuppies = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('puppies')
        .select(`
          *,
          litters(id, birth_date)
        `)
        .order('birth_date', { ascending: false });

      if (error) throw error;

      // Fetch weight history for each puppy
      const puppiesWithAge = data.map(puppy => {
        // Calculate age based on birth date
        const birthDate = puppy.birth_date 
          ? new Date(puppy.birth_date) 
          : puppy.litters?.birth_date 
            ? new Date(puppy.litters.birth_date)
            : new Date();
        
        const currentDate = new Date();
        const ageInDays = differenceInDays(currentDate, birthDate);
        
        return {
          ...puppy,
          // Standard age fields
          age_days: ageInDays,
          age_in_weeks: Math.floor(ageInDays / 7),
          // For backward compatibility
          ageInDays: ageInDays,
          age_weeks: Math.floor(ageInDays / 7),
          // Standardize weight unit if present
          weight_unit: puppy.weight_unit ? standardizeWeightUnit(puppy.weight_unit) : 'lb'
        } as PuppyWithAge;
      });
        
      setPuppies(puppiesWithAge);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching puppies:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  // Fetch puppies on component mount
  useEffect(() => {
    fetchPuppies();
  }, [fetchPuppies]);

  // Group puppies by age
  const ageGroups = defaultAgeGroups;
  const puppiesByAgeGroup: Record<string, PuppyWithAge[]> = {};
  
  // Initialize age groups
  ageGroups.forEach(group => {
    puppiesByAgeGroup[group.id] = [];
  });
  
  // Sort puppies into age groups
  puppies.forEach(puppy => {
    const ageGroup = ageGroups.find(
      group => puppy.age_days >= group.minAge && puppy.age_days <= group.maxAge
    );
    
    if (ageGroup) {
      puppiesByAgeGroup[ageGroup.id].push(puppy);
    }
  });
  
  // Calculate statistics
  const totalPuppies = puppies.length;
  
  // Count by status
  const byStatus: Record<string, number> = {};
  
  // Count by gender
  const byGender = {
    male: 0,
    female: 0,
    unknown: 0
  };
  
  // Count by age group
  const byAgeGroup: Record<string, number> = {};
  ageGroups.forEach(group => {
    byAgeGroup[group.id] = puppiesByAgeGroup[group.id].length;
  });
  
  // Process puppies for stats
  puppies.forEach(puppy => {
    // Status counts
    const status = puppy.status || 'Unknown';
    byStatus[status] = (byStatus[status] || 0) + 1;
    
    // Gender counts
    if (puppy.gender === 'Male') {
      byGender.male++;
    } else if (puppy.gender === 'Female') {
      byGender.female++;
    } else {
      byGender.unknown++;
    }
  });
  
  // Calculate available and reserved counts
  const availablePuppies = byStatus['Available'] || 0;
  const reservedPuppies = byStatus['Reserved'] || 0;
  const soldPuppies = byStatus['Sold'] || 0;
  
  return {
    puppies,
    ageGroups,
    puppiesByAgeGroup,
    totalPuppies,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading: loading,
    error,
    stats: {
      totalPuppies,
      availablePuppies,
      reservedPuppies,
      soldPuppies,
      byGender,
      byStatus,
      byAgeGroup
    },
    // Required fields for PuppyManagementStats
    total: {
      count: totalPuppies,
      male: byGender.male || 0,
      female: byGender.female || 0
    },
    byGender,
    byStatus,
    byAgeGroup
  };
};
