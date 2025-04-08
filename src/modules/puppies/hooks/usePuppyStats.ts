
/**
 * Hook for generating statistics from puppy data
 */
import { useMemo } from 'react';
import { PuppyWithAge, PuppyManagementStats } from '../types';

/**
 * Hook to generate statistics from puppy data
 * @param puppies Array of puppies with age information
 * @returns Statistics object derived from puppy data
 */
export const usePuppyStats = (puppies: PuppyWithAge[]): Partial<PuppyManagementStats> => {
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
      const status = puppy.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count puppies by age group (assuming standard age groups)
    const byAgeGroup: Record<string, number> = {
      'newborn': 0,
      'twoWeek': 0,
      'fourWeek': 0, 
      'sixWeek': 0,
      'eightWeek': 0,
      'tenWeek': 0,
      'twelveWeek': 0,
      'older': 0
    };
    
    puppies.forEach(puppy => {
      const ageInDays = puppy.age_days || puppy.ageInDays || 0;
      
      if (ageInDays <= 14) {
        byAgeGroup['newborn']++;
      } else if (ageInDays <= 21) {
        byAgeGroup['twoWeek']++;
      } else if (ageInDays <= 35) {
        byAgeGroup['fourWeek']++;
      } else if (ageInDays <= 49) {
        byAgeGroup['sixWeek']++;
      } else if (ageInDays <= 63) {
        byAgeGroup['eightWeek']++;
      } else if (ageInDays <= 77) {
        byAgeGroup['tenWeek']++;
      } else if (ageInDays <= 91) {
        byAgeGroup['twelveWeek']++;
      } else {
        byAgeGroup['older']++;
      }
    });
    
    // Puppies by status - common statuses
    const availablePuppies = byStatus['available'] || 0;
    const reservedPuppies = byStatus['reserved'] || 0;
    const soldPuppies = byStatus['sold'] || 0;
    const unavailablePuppies = byStatus['unavailable'] || 0;
    
    return {
      puppies,
      totalPuppies: totalCount,
      isLoading: false,
      error: null,
      
      // Common status counts
      availablePuppies,
      reservedPuppies,
      soldPuppies,
      
      // For backwards compatibility 
      activeCount: totalCount,
      availableCount: availablePuppies,
      reservedCount: reservedPuppies,
      soldCount: soldPuppies,
      currentWeek: Math.ceil(new Date().getTime() / (7 * 24 * 60 * 60 * 1000)),
      
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
      byStatus: {
        available: availablePuppies,
        reserved: reservedPuppies,
        sold: soldPuppies,
        unavailable: unavailablePuppies
      },
      byAgeGroup
    };
  }, [puppies]);
  
  return stats;
};
