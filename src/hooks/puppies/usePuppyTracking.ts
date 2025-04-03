
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays } from 'date-fns';
import { PuppyWithAge, PuppyAgeGroupData, PuppyManagementStats } from '@/types/puppyTracking';

// Define default age groups for puppies
const defaultAgeGroups: PuppyAgeGroupData[] = [
  {
    id: 'newborn',
    name: 'Newborn',
    description: 'Eyes closed, focused on nursing and sleeping',
    startDay: 0,
    endDay: 14,
    careChecks: ['temperature', 'weight', 'feeding'],
    milestones: ['Eyes open around day 10-14', 'Beginning to hear sounds']
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: 'Eyes open, ears opening, beginning to walk',
    startDay: 15,
    endDay: 21,
    careChecks: ['temperature', 'weight', 'feeding'],
    milestones: ['First steps', 'Beginning to socialize', 'Teeth starting to emerge']
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: 'Active, exploring, socializing with littermates',
    startDay: 22,
    endDay: 49,
    careChecks: ['weight', 'deworming', 'vaccination'],
    milestones: ['Start weaning', 'Active play', 'Sensitive period for socialization']
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: 'Ready for new homes, basic training beginning',
    startDay: 50,
    endDay: 84,
    careChecks: ['weight', 'vaccination', 'microchip'],
    milestones: ['Most vaccinations done', 'Ready for adoption', 'Initial training']
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: 'Growing quickly, training continues',
    startDay: 85,
    endDay: 180,
    careChecks: ['weight', 'vaccination', 'training'],
    milestones: ['Adult teeth coming in', 'May test boundaries', 'Growth spurts']
  }
];

export const usePuppyTracking = (): PuppyManagementStats => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  useEffect(() => {
    const fetchPuppies = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all puppies that have a birth date
        const { data, error } = await supabase
          .from('puppies')
          .select(`
            id, 
            name, 
            gender, 
            color, 
            birth_date, 
            litter_id, 
            microchip_number, 
            photo_url, 
            current_weight,
            weight_unit,
            status, 
            birth_order, 
            birth_weight, 
            notes, 
            created_at,
            litters:litter_id (
              id,
              litter_name,
              birth_date
            )
          `)
          .not('birth_date', 'is', null)
          .order('birth_date', { ascending: false });
        
        if (error) throw error;
        
        // Calculate age for each puppy
        const puppiesWithAge = data.map((puppy: any) => {
          const birthDate = puppy.birth_date ? new Date(puppy.birth_date) : null;
          const ageInDays = birthDate ? differenceInDays(new Date(), birthDate) : 0;
          
          return {
            ...puppy,
            age_days: ageInDays, // Primary age field
            age_in_weeks: Math.floor(ageInDays / 7),
            // For backward compatibility
            ageInDays: ageInDays,
            age_weeks: Math.floor(ageInDays / 7)
          } as PuppyWithAge;
        });
        
        setPuppies(puppiesWithAge);
      } catch (error) {
        console.error('Error fetching puppies:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPuppies();
  }, []);
  
  // Organize puppies by age group
  const puppiesByAgeGroup: Record<string, PuppyWithAge[]> = {};
  
  // Initialize all age groups
  defaultAgeGroups.forEach(group => {
    puppiesByAgeGroup[group.id] = [];
  });
  
  // Sort puppies into age groups
  puppies.forEach(puppy => {
    const ageGroup = defaultAgeGroups.find(group => 
      puppy.age_days >= group.startDay && puppy.age_days <= group.endDay
    );
    
    if (ageGroup) {
      puppiesByAgeGroup[ageGroup.id].push(puppy);
    }
  });
  
  // Count puppies by status
  const availablePuppies = puppies.filter(p => p.status === 'Available').length;
  const reservedPuppies = puppies.filter(p => p.status === 'Reserved').length;
  const soldPuppies = puppies.filter(p => p.status === 'Sold').length;
  
  // Count puppies by gender
  const maleCount = puppies.filter(p => p.gender?.toLowerCase() === 'male').length;
  const femaleCount = puppies.filter(p => p.gender?.toLowerCase() === 'female').length;
  const unknownGenderCount = puppies.filter(p => !p.gender).length;
  
  // Count puppies by age group
  const byAgeGroup = defaultAgeGroups.reduce((acc, group) => {
    acc[group.id] = (puppiesByAgeGroup[group.id] || []).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Count by status
  const byStatus = puppies.reduce((acc, puppy) => {
    const status = puppy.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    puppies,
    puppiesByAgeGroup,
    ageGroups: defaultAgeGroups,
    totalPuppies: puppies.length,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading,
    error,
    // Additional stats for dashboard
    total: {
      count: puppies.length,
      male: maleCount,
      female: femaleCount
    },
    byGender: {
      male: maleCount,
      female: femaleCount,
      unknown: unknownGenderCount
    },
    byStatus,
    byAgeGroup,
    // Required by types but not actively used
    stats: {}
  };
};
