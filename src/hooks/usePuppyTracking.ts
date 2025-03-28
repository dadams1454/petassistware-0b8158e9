
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { Puppy } from '@/components/litters/puppies/types';

// Define a type for age group IDs
type AgeGroupId = 'first24hours' | 'first48hours' | 'first7days' | 'week2' | 
                 'week3to4' | 'week5to7' | 'week8to10' | 'over10weeks';

// Age group data with milestones and critical tasks
const ageGroupsData: PuppyAgeGroupData[] = [
  {
    id: 'first24hours',
    name: 'First 24 Hours',
    startDay: 0,
    endDay: 1,
    description: 'Critical period for newborn puppies requiring constant monitoring.',
    milestones: 'First nursing, Weight recorded at birth, Color/markings identified',
    careChecks: [
      'Ensure nursing and colostrum intake',
      'Keep warm (85-90°F)',
      'Monitor for distress',
      'Check for birth defects'
    ]
  },
  {
    id: 'first48hours',
    name: '24-48 Hours',
    startDay: 1,
    endDay: 2,
    description: 'Continued close monitoring as puppies establish feeding patterns.',
    milestones: 'Regular nursing established, Slight weight gain, Stronger movements',
    careChecks: [
      'Monitor weight (should not lose >10%)',
      'Ensure all puppies are nursing',
      'Check for adequate elimination',
      'Maintain environmental warmth'
    ]
  },
  {
    id: 'first7days',
    name: 'Days 3-7',
    startDay: 2,
    endDay: 7,
    description: 'First week of life with rapid development and continued vulnerability.',
    milestones: 'Steady weight gain, Stronger crawling movements, Stronger nursing reflexes',
    careChecks: [
      'Daily weight monitoring',
      'Maintain environmental temperature (80-85°F)',
      'Ensure dam is producing adequate milk',
      'First deworming (if recommended by vet)'
    ]
  },
  {
    id: 'week2',
    name: 'Week 2',
    startDay: 8,
    endDay: 14,
    description: 'Eyes begin to open and puppies become more aware of surroundings.',
    milestones: 'Eyes opening (10-14 days), Ear canals begin to open, More coordinated movements',
    careChecks: [
      'Continued weight monitoring',
      'Begin gentle handling sessions',
      'Maintain clean environment',
      'Gradually reduce temperature (75-80°F)'
    ]
  },
  {
    id: 'week3to4',
    name: 'Weeks 3-4',
    startDay: 15,
    endDay: 28,
    description: 'Beginning of socialization period with increased mobility and awareness.',
    milestones: 'Walking begins, Teeth eruption starts, Beginning of play behavior, First barks/vocalizations',
    careChecks: [
      'Begin weaning process',
      'Introduce solid food (gruel)',
      'Provide safe exploration space',
      'Regular deworming',
      'Begin socialization with gentle handling'
    ]
  },
  {
    id: 'week5to7',
    name: 'Weeks 5-7',
    startDay: 29,
    endDay: 49,
    description: 'Prime socialization period with rapid learning and development.',
    milestones: 'Fully weaned from mother, Established play behaviors, Social hierarchy development, Enhanced coordination',
    careChecks: [
      'Structured socialization sessions',
      'Introduction to various surfaces/textures',
      'Begin housebreaking basics',
      'First vaccinations',
      'Exposure to household sounds'
    ]
  },
  {
    id: 'week8to10',
    name: 'Weeks 8-10',
    startDay: 50,
    endDay: 70,
    description: 'Preparation period for going to new homes with focus on temperament development.',
    milestones: 'Ready for new homes, Continued behavioral development, Established feeding patterns',
    careChecks: [
      'Temperament testing',
      'Continued vaccination protocol',
      'Microchipping',
      'Prepare adoption paperwork',
      'Basic training introduction'
    ]
  },
  {
    id: 'over10weeks',
    name: 'Over 10 Weeks',
    startDay: 71,
    endDay: 999,
    description: 'Extended stay puppies requiring continued development focus.',
    milestones: 'Enhanced training capabilities, Further socialization opportunities, Established routines',
    careChecks: [
      'Continued training reinforcement',
      'Complete vaccination protocol',
      'Regular exercise routines',
      'Preparation for transition to adult dog status'
    ]
  }
];

export function usePuppyTracking() {
  const [puppiesByAgeGroup, setPuppiesByAgeGroup] = useState<Record<AgeGroupId, PuppyWithAge[]>>({
    first24hours: [],
    first48hours: [],
    first7days: [],
    week2: [],
    week3to4: [],
    week5to7: [],
    week8to10: [],
    over10weeks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to determine age group based on days
  const determineAgeGroup = (ageInDays: number): AgeGroupId => {
    for (const group of ageGroupsData) {
      if (
        ageInDays >= group.startDay && 
        ageInDays <= group.endDay
      ) {
        return group.id as AgeGroupId;
      }
    }
    return 'over10weeks'; // Default to oldest group if no match
  };
  
  // Function to calculate age in days
  const calculateAgeInDays = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Function to fetch puppies and categorize them
  const fetchPuppies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Query active litters first to get the puppies
      const { data: litters, error: littersError } = await supabase
        .from('litters')
        .select('id, birth_date')
        .order('birth_date', { ascending: false });
        
      if (littersError) throw littersError;
      
      if (!litters || litters.length === 0) {
        setIsLoading(false);
        return; // No litters, so no puppies
      }
      
      // Get all puppies from the active litters
      const litterIds = litters.map(litter => litter.id);
      
      const { data: puppies, error: puppiesError } = await supabase
        .from('puppies')
        .select('*, litters!inner(birth_date)')
        .in('litter_id', litterIds);
        
      if (puppiesError) throw puppiesError;
      
      if (!puppies || puppies.length === 0) {
        setIsLoading(false);
        return; // No puppies found
      }
      
      // Process puppies and group by age
      const groupedPuppies: Record<AgeGroupId, PuppyWithAge[]> = {
        first24hours: [],
        first48hours: [],
        first7days: [],
        week2: [],
        week3to4: [],
        week5to7: [],
        week8to10: [],
        over10weeks: []
      };
      
      puppies.forEach((puppy: any) => {
        const birthDate = puppy.litters.birth_date;
        const ageInDays = calculateAgeInDays(birthDate);
        const ageGroupId = determineAgeGroup(ageInDays);
        
        const puppyWithAge: PuppyWithAge = {
          ...puppy as Puppy, 
          ageInDays
        };
        
        groupedPuppies[ageGroupId].push(puppyWithAge);
      });
      
      setPuppiesByAgeGroup(groupedPuppies);
    } catch (error) {
      console.error('Error fetching puppies:', error);
      setError('Failed to load puppies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch puppies on component mount
  useEffect(() => {
    fetchPuppies();
  }, []);
  
  return {
    puppiesByAgeGroup,
    ageGroups: ageGroupsData,
    isLoading,
    error,
    refetch: fetchPuppies
  };
}
