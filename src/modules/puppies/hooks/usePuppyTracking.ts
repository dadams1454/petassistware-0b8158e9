
import { useState, useEffect, useMemo } from 'react';
import { fetchPuppies } from '../services/puppyService';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupInfo, PuppyAgeGroupData, PuppyManagementStats } from '../types';

// Constants for puppy age groups
export const PUPPY_AGE_GROUPS: PuppyAgeGroupInfo[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Birth to 2 weeks',
    ageRange: '0-2 weeks',
    minDays: 0,
    maxDays: 14,
    color: 'bg-pink-100'
  },
  {
    id: 'twoWeek',
    name: '2-4 Weeks',
    description: 'Eyes open & first walk',
    ageRange: '2-4 weeks',
    minDays: 15,
    maxDays: 28,
    color: 'bg-blue-100'
  },
  {
    id: 'fourWeek',
    name: '4-6 Weeks',
    description: 'Starting to wean',
    ageRange: '4-6 weeks',
    minDays: 29,
    maxDays: 42,
    color: 'bg-green-100'
  },
  {
    id: 'sixWeek',
    name: '6-8 Weeks',
    description: 'Socialization period',
    ageRange: '6-8 weeks',
    minDays: 43,
    maxDays: 56,
    color: 'bg-yellow-100'
  },
  {
    id: 'eightWeek',
    name: '8-10 Weeks',
    description: 'Adoption ready',
    ageRange: '8-10 weeks',
    minDays: 57,
    maxDays: 70,
    color: 'bg-orange-100'
  },
  {
    id: 'tenWeek',
    name: '10-12 Weeks',
    description: 'Social confidence',
    ageRange: '10-12 weeks',
    minDays: 71,
    maxDays: 84,
    color: 'bg-red-100'
  },
  {
    id: 'twelveWeek',
    name: '12-16 Weeks',
    description: 'Pre-adolescence',
    ageRange: '12-16 weeks',
    minDays: 85,
    maxDays: 112,
    color: 'bg-purple-100'
  },
  {
    id: 'older',
    name: '16+ Weeks',
    description: 'Older puppies',
    ageRange: '16+ weeks',
    minDays: 113,
    maxDays: 999,
    color: 'bg-gray-100'
  }
];

/**
 * Hook for tracking and organizing puppies by age groups
 */
export function usePuppyTracking(): PuppyManagementStats {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch puppies on mount
  useEffect(() => {
    const loadPuppies = async () => {
      try {
        setIsLoading(true);
        const fetchedPuppies = await fetchPuppies();
        setPuppies(fetchedPuppies);
      } catch (err) {
        console.error('Error fetching puppies:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch puppies'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPuppies();
  }, []);

  // Memoized calculations for puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    const result: Record<string, PuppyWithAge[]> = {};
    
    // Initialize groups
    PUPPY_AGE_GROUPS.forEach(group => {
      result[group.id] = [];
    });
    
    // Add each puppy to appropriate group
    puppies.forEach(puppy => {
      const ageInDays = puppy.ageInDays || 0;
      
      for (const group of PUPPY_AGE_GROUPS) {
        if (ageInDays >= group.minDays && ageInDays <= group.maxDays) {
          result[group.id].push(puppy);
          break;
        }
      }
    });
    
    return result;
  }, [puppies]);

  // Calculate stats about puppies
  const stats = useMemo(() => {
    // Count by status
    const byStatus = {
      available: 0,
      reserved: 0,
      sold: 0,
      unavailable: 0
    };
    
    // Count by gender
    const byGender = {
      male: 0,
      female: 0,
      unknown: 0
    };
    
    // Group by status
    const puppiesByStatus: Record<string, PuppyWithAge[]> = {
      Available: [],
      Reserved: [],
      Sold: [],
      Unavailable: []
    };
    
    // Process each puppy
    puppies.forEach(puppy => {
      // Count by status
      const status = puppy.status || 'Available';
      switch (status) {
        case 'Available':
          byStatus.available++;
          puppiesByStatus.Available.push(puppy);
          break;
        case 'Reserved':
          byStatus.reserved++;
          puppiesByStatus.Reserved.push(puppy);
          break;
        case 'Sold':
          byStatus.sold++;
          puppiesByStatus.Sold.push(puppy);
          break;
        default:
          byStatus.unavailable++;
          puppiesByStatus.Unavailable.push(puppy);
      }
      
      // Count by gender
      switch (puppy.gender) {
        case 'Male':
          byGender.male++;
          break;
        case 'Female':
          byGender.female++;
          break;
        default:
          byGender.unknown++;
      }
    });
    
    // Construct age group data
    const byAgeGroup: PuppyAgeGroupData = {
      newborn: puppiesByAgeGroup.newborn || [],
      twoWeek: puppiesByAgeGroup.twoWeek || [],
      fourWeek: puppiesByAgeGroup.fourWeek || [],
      sixWeek: puppiesByAgeGroup.sixWeek || [],
      eightWeek: puppiesByAgeGroup.eightWeek || [],
      tenWeek: puppiesByAgeGroup.tenWeek || [],
      twelveWeek: puppiesByAgeGroup.twelveWeek || [],
      older: puppiesByAgeGroup.older || [],
      all: puppies,
      total: puppies.length
    };
    
    return {
      byStatus,
      byGender,
      puppiesByStatus,
      byAgeGroup,
      totalPuppies: puppies.length,
      availablePuppies: byStatus.available,
      reservedPuppies: byStatus.reserved,
      soldPuppies: byStatus.sold,
      maleCount: byGender.male,
      femaleCount: byGender.female
    };
  }, [puppies, puppiesByAgeGroup]);

  // Refetch function
  const refetch = async (): Promise<any> => {
    try {
      setIsLoading(true);
      const fetchedPuppies = await fetchPuppies();
      setPuppies(fetchedPuppies);
      return fetchedPuppies;
    } catch (err) {
      console.error('Error refetching puppies:', err);
      setError(err instanceof Error ? err : new Error('Failed to refetch puppies'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Return complete stats
  return {
    puppies,
    ageGroups: PUPPY_AGE_GROUPS,
    puppiesByAgeGroup,
    byAgeGroup: stats.byAgeGroup,
    totalPuppies: stats.totalPuppies,
    availablePuppies: stats.availablePuppies,
    reservedPuppies: stats.reservedPuppies,
    soldPuppies: stats.soldPuppies,
    maleCount: stats.maleCount,
    femaleCount: stats.femaleCount,
    puppiesByStatus: stats.puppiesByStatus,
    byGender: stats.byGender,
    byStatus: stats.byStatus,
    activeCount: stats.availablePuppies,
    reservedCount: stats.reservedPuppies,
    availableCount: stats.availablePuppies,
    soldCount: stats.soldPuppies,
    currentWeek: 0,
    isLoading,
    error,
    refetch
  };
}
