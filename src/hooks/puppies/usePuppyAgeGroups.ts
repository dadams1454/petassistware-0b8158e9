
import { useState, useEffect } from 'react';
import { PuppyWithAge, PuppyAgeGroupData, DEFAULT_AGE_GROUPS } from '@/types/puppyTracking';

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  const [ageGroups, setAgeGroups] = useState<PuppyAgeGroupData[]>([]);
  const [puppiesByAgeGroup, setPuppiesByAgeGroup] = useState<Record<string, PuppyWithAge[]>>({});
  
  useEffect(() => {
    // Load age groups (in a real app, this might come from an API)
    setAgeGroups(DEFAULT_AGE_GROUPS || []);
    
    // Group puppies by age
    if (puppies.length > 0 && DEFAULT_AGE_GROUPS) {
      const groupedPuppies: Record<string, PuppyWithAge[]> = {};
      
      // Initialize empty arrays for each age group
      DEFAULT_AGE_GROUPS.forEach(group => {
        groupedPuppies[group.id] = [];
      });
      
      // Add puppies to appropriate age groups
      puppies.forEach(puppy => {
        if (typeof puppy.ageInDays !== 'number') return;
        
        const ageGroup = DEFAULT_AGE_GROUPS.find(
          group => puppy.ageInDays >= group.startDay && puppy.ageInDays <= group.endDay
        );
        
        if (ageGroup) {
          if (!groupedPuppies[ageGroup.id]) {
            groupedPuppies[ageGroup.id] = [];
          }
          groupedPuppies[ageGroup.id].push(puppy);
        }
      });
      
      setPuppiesByAgeGroup(groupedPuppies);
    } else {
      setPuppiesByAgeGroup({});
    }
  }, [puppies]);
  
  return { ageGroups, puppiesByAgeGroup };
};
