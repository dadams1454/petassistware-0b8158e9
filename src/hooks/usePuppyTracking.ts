
import { useState, useEffect } from 'react';
import { usePuppyStats } from './puppies/usePuppyStats';
import { PuppyManagementStats, PuppyWithAge, PuppyAgeGroup } from '@/types/puppyTracking';
import { DEFAULT_AGE_GROUPS } from '@/types/puppyTracking';

export const usePuppyTracking = () => {
  // Use the existing stats hook
  const { stats, isLoading, error, refreshStats } = usePuppyStats();
  
  // Mock data for development - in a real app this would come from API
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [puppiesByAgeGroup, setPuppiesByAgeGroup] = useState<Record<string, PuppyWithAge[]>>({});
  const [ageGroups] = useState<PuppyAgeGroup[]>(DEFAULT_AGE_GROUPS);
  
  // Initialize mock data on first load
  useEffect(() => {
    const mockPuppies: PuppyWithAge[] = [];
    const mockPuppiesByAgeGroup: Record<string, PuppyWithAge[]> = {};
    
    // Initialize empty arrays for each age group
    ageGroups.forEach(group => {
      mockPuppiesByAgeGroup[group.id] = [];
    });
    
    setPuppies(mockPuppies);
    setPuppiesByAgeGroup(mockPuppiesByAgeGroup);
  }, [ageGroups]);
  
  // Refresh function
  const refresh = async () => {
    await refreshStats();
  };
  
  return {
    stats,
    puppies,
    ageGroups,
    puppiesByAgeGroup,
    puppyStats: stats, // Alias for backward compatibility
    isLoading,
    error,
    refresh
  };
};
