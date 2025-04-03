
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
    milestones: 'Eyes open around day 10-14, beginning to hear sounds'
  },
  {
    id: 'transitional',
    name: 'Transitional',
    description: 'Eyes open, ears opening, beginning to walk',
    startDay: 15,
    endDay: 21,
    milestones: 'First steps, beginning to socialize, teeth starting to emerge'
  },
  {
    id: 'socialization',
    name: 'Socialization',
    description: 'Active, exploring, socializing with littermates',
    startDay: 22,
    endDay: 49,
    milestones: 'Start weaning, active play, sensitive period for socialization'
  },
  {
    id: 'juvenile',
    name: 'Juvenile',
    description: 'Ready for new homes, basic training beginning',
    startDay: 50,
    endDay: 84,
    milestones: 'Most vaccinations done, ready for adoption, initial training'
  },
  {
    id: 'adolescent',
    name: 'Adolescent',
    description: 'Growing quickly, training continues',
    startDay: 85,
    endDay: 180,
    milestones: 'Adult teeth coming in, may test boundaries, growth spurts'
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
            ageInDays,
            age_days: ageInDays, // Alternative property name
            age_in_weeks: Math.floor(ageInDays / 7),
            age_weeks: Math.floor(ageInDays / 7) // For backward compatibility
          };
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
  const puppiesByAgeGroup = puppies.reduce((acc: Record<string, PuppyWithAge[]>, puppy) => {
    const ageGroup = defaultAgeGroups.find(group => 
      puppy.ageInDays >= group.startDay && puppy.ageInDays <= group.endDay
    );
    
    if (ageGroup) {
      if (!acc[ageGroup.id]) {
        acc[ageGroup.id] = [];
      }
      acc[ageGroup.id].push(puppy);
    }
    
    return acc;
  }, {});
  
  // Count puppies by status
  const availablePuppies = puppies.filter(p => p.status === 'Available').length;
  const reservedPuppies = puppies.filter(p => p.status === 'Reserved').length;
  const soldPuppies = puppies.filter(p => p.status === 'Sold').length;
  
  return {
    puppies,
    puppiesByAgeGroup,
    ageGroups: defaultAgeGroups,
    totalPuppies: puppies.length,
    availablePuppies,
    reservedPuppies,
    soldPuppies,
    isLoading,
    error
  };
};
