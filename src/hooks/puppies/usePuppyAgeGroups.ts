
import { useMemo } from 'react';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';

export const usePuppyAgeGroups = (puppies: PuppyWithAge[]) => {
  // Define age groups
  const ageGroups: PuppyAgeGroupData[] = useMemo(() => [
    {
      id: 'newborn',
      name: 'Newborn',
      range: '0-14 days',
      ageRange: [0, 14],
      startDay: 0,
      endDay: 14,
      developmentalPhase: 'Neonatal Period',
      description: 'Puppies are completely dependent on mother for nutrition and care.',
      milestones: ['Eyes closed', 'Ears closed', 'Minimal movement', 'Sleep 90% of time'],
      color: 'blue',
      puppies: [],
      count: 0,
      careChecks: ['weight', 'temperature', 'umbilical check', 'nursing']
    },
    {
      id: 'infant',
      name: 'Infant',
      range: '15-21 days',
      ageRange: [15, 21],
      startDay: 15,
      endDay: 21,
      developmentalPhase: 'Transitional Period',
      description: 'Puppies begin to open eyes and ears, and start to crawl.',
      milestones: ['Eyes open', 'Ears open', 'Begin crawling', 'First teeth appear'],
      color: 'green',
      puppies: [],
      count: 0,
      careChecks: ['weight', 'motor development', 'first deworming']
    },
    {
      id: 'transitional',
      name: 'Transitional',
      range: '22-28 days',
      ageRange: [22, 28],
      startDay: 22,
      endDay: 28,
      developmentalPhase: 'Early Socialization',
      description: 'Puppies begin to interact with siblings and environment.',
      milestones: ['Walking steadily', 'Playing with littermates', 'Weaning begins', 'Recognize people'],
      color: 'yellow',
      puppies: [],
      count: 0,
      careChecks: ['weaning progress', 'socialization', 'second deworming']
    },
    {
      id: 'socialization',
      name: 'Socialization',
      range: '29-49 days',
      ageRange: [29, 49],
      startDay: 29,
      endDay: 49,
      developmentalPhase: 'Critical Socialization',
      description: 'Key period for socialization and learning.',
      milestones: ['Fully weaned', 'First vaccinations', 'Structured play', 'Fear responses develop'],
      color: 'orange',
      puppies: [],
      count: 0,
      careChecks: ['vaccines', 'socialization plan', 'temperament assessment']
    },
    {
      id: 'juvenile',
      name: 'Juvenile',
      range: '50+ days',
      ageRange: [50, 120],
      startDay: 50,
      endDay: 120,
      developmentalPhase: 'Juvenile Period',
      description: 'Puppies are ready for new homes and continued training.',
      milestones: ['Ready for adoption', 'Full vaccination series', 'Basic training', 'House training'],
      color: 'red',
      puppies: [],
      count: 0,
      careChecks: ['final health check', 'microchipping', 'spay/neuter plans']
    }
  ], []);

  // Group puppies by age
  const puppiesByAgeGroup = useMemo(() => {
    const grouped: Record<string, PuppyWithAge[]> = {};
    
    // Initialize empty arrays for each age group
    ageGroups.forEach(group => {
      grouped[group.id] = [];
    });
    
    // Sort puppies into their respective age groups
    puppies.forEach(puppy => {
      const ageDays = puppy.ageInDays || puppy.age_days || 0;
      
      const group = ageGroups.find(
        g => ageDays >= g.startDay && ageDays <= g.endDay
      );
      
      if (group) {
        grouped[group.id].push(puppy);
      } else if (ageDays > ageGroups[ageGroups.length - 1].endDay) {
        // If older than the oldest defined group, put in the oldest group
        grouped[ageGroups[ageGroups.length - 1].id].push(puppy);
      } else {
        // Fallback - shouldn't happen if ages are calculated correctly
        grouped['juvenile'].push(puppy);
      }
    });
    
    return grouped;
  }, [puppies, ageGroups]);
  
  // Update age groups with puppy counts
  const updatedAgeGroups = useMemo(() => {
    return ageGroups.map(group => ({
      ...group,
      puppies: puppiesByAgeGroup[group.id] || [],
      count: (puppiesByAgeGroup[group.id] || []).length
    }));
  }, [ageGroups, puppiesByAgeGroup]);
  
  return {
    ageGroups: updatedAgeGroups,
    puppiesByAgeGroup
  };
};
