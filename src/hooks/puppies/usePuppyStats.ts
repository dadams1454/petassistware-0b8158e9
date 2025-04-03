
import { useMemo } from 'react';
import { PuppyWithAge, PuppyManagementStats } from '@/types/puppyTracking';

/**
 * Hook to generate statistics from puppy data
 */
export const usePuppyStats = (puppies: PuppyWithAge[]): PuppyManagementStats => {
  const stats = useMemo(() => {
    // Count total puppies
    const totalCount = puppies.length;
    
    // Count puppies by gender
    const maleCount = puppies.filter(p => 
      p.gender?.toLowerCase() === 'male'
    ).length;
    
    const femaleCount = puppies.filter(p => 
      p.gender?.toLowerCase() === 'female'
    ).length;
    
    const unknownGenderCount = puppies.filter(p => 
      !p.gender
    ).length;
    
    // Count puppies by status
    const byStatus = puppies.reduce((acc, puppy) => {
      const status = puppy.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count puppies by age group (assuming standard age groups)
    const byAgeGroup: Record<string, number> = {
      'newborn': 0,
      'transitional': 0,
      'socialization': 0,
      'juvenile': 0,
      'adolescent': 0,
    };
    
    puppies.forEach(puppy => {
      const ageInDays = puppy.age_days || 0;
      
      if (ageInDays <= 14) {
        byAgeGroup['newborn']++;
      } else if (ageInDays <= 21) {
        byAgeGroup['transitional']++;
      } else if (ageInDays <= 49) {
        byAgeGroup['socialization']++;
      } else if (ageInDays <= 84) {
        byAgeGroup['juvenile']++;
      } else {
        byAgeGroup['adolescent']++;
      }
    });
    
    // Puppies by status - common statuses
    const availablePuppies = byStatus['Available'] || 0;
    const reservedPuppies = byStatus['Reserved'] || 0;
    const soldPuppies = byStatus['Sold'] || 0;
    
    return {
      puppies,
      totalPuppies: totalCount,
      isLoading: false,
      error: null,
      // Puppies by age group (placeholder - will come from puppy tracking)
      puppiesByAgeGroup: {},
      // Age groups (placeholder - will come from puppy tracking)
      ageGroups: [],
      // Common status counts
      availablePuppies,
      reservedPuppies,
      soldPuppies,
      // Additional stats for dashboard
      total: {
        count: totalCount,
        male: maleCount,
        female: femaleCount
      },
      byGender: {
        male: maleCount,
        female: femaleCount,
        unknown: unknownGenderCount
      },
      byStatus,
      byAgeGroup
    };
  }, [puppies]);
  
  return stats;
};
