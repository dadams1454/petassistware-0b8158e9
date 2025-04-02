
import { useState, useEffect } from 'react';
import { PuppyWithAge, PuppyAgeGroupData, DEFAULT_AGE_GROUPS } from '@/types/puppyTracking';

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  const [ageGroups, setAgeGroups] = useState<PuppyAgeGroupData[]>([]);
  const [puppiesByAgeGroup, setPuppiesByAgeGroup] = useState<Record<string, PuppyWithAge[]>>({});
  
  useEffect(() => {
    // Load age groups
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
        const age_days = puppy.age_days;
        if (typeof age_days !== 'number') return;
        
        const ageGroup = DEFAULT_AGE_GROUPS.find(
          group => age_days >= group.startDay! && age_days <= group.endDay!
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
