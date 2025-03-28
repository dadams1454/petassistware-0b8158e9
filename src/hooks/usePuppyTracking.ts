
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupData } from '@/types/puppyTracking';
import { Puppy } from '@/components/litters/puppies/types';

// Age group data with milestones and critical tasks
const ageGroupsData: PuppyAgeGroupData[] = [
  {
    id: 'first24hours',
    label: 'First 24 Hours',
    description: 'Critical period for newborn puppies requiring constant monitoring.',
    daysRange: { min: 0, max: 1 },
    key: 'first_24_hours',
    milestones: [
      'First nursing',
      'Weight recorded at birth',
      'Color/markings identified'
    ],
    criticalTasks: [
      'Ensure nursing and colostrum intake',
      'Keep warm (85-90°F)',
      'Monitor for distress',
      'Check for birth defects'
    ]
  },
  {
    id: 'first48hours',
    label: '24-48 Hours',
    description: 'Continued close monitoring as puppies establish feeding patterns.',
    daysRange: { min: 1, max: 2 },
    key: 'first_48_hours',
    milestones: [
      'Regular nursing established',
      'Slight weight gain',
      'Stronger movements'
    ],
    criticalTasks: [
      'Monitor weight (should not lose >10%)',
      'Ensure all puppies are nursing',
      'Check for adequate elimination',
      'Maintain environmental warmth'
    ]
  },
  {
    id: 'first7days',
    label: 'Days 3-7',
    description: 'First week of life with rapid development and continued vulnerability.',
    daysRange: { min: 2, max: 7 },
    key: 'first_week',
    milestones: [
      'Steady weight gain',
      'Stronger crawling movements',
      'Stronger nursing reflexes'
    ],
    criticalTasks: [
      'Daily weight monitoring',
      'Maintain environmental temperature (80-85°F)',
      'Ensure dam is producing adequate milk',
      'First deworming (if recommended by vet)'
    ]
  },
  {
    id: 'week2',
    label: 'Week 2',
    description: 'Eyes begin to open and puppies become more aware of surroundings.',
    daysRange: { min: 8, max: 14 },
    key: 'week_two',
    milestones: [
      'Eyes opening (10-14 days)',
      'Ear canals begin to open',
      'More coordinated movements'
    ],
    criticalTasks: [
      'Continued weight monitoring',
      'Begin gentle handling sessions',
      'Maintain clean environment',
      'Gradually reduce temperature (75-80°F)'
    ]
  },
  {
    id: 'week3to4',
    label: 'Weeks 3-4',
    description: 'Beginning of socialization period with increased mobility and awareness.',
    daysRange: { min: 15, max: 28 },
    key: 'weeks_three_to_four',
    milestones: [
      'Walking begins',
      'Teeth eruption starts',
      'Beginning of play behavior',
      'First barks/vocalizations'
    ],
    criticalTasks: [
      'Begin weaning process',
      'Introduce solid food (gruel)',
      'Provide safe exploration space',
      'Regular deworming',
      'Begin socialization with gentle handling'
    ]
  },
  {
    id: 'week5to7',
    label: 'Weeks 5-7',
    description: 'Prime socialization period with rapid learning and development.',
    daysRange: { min: 29, max: 49 },
    key: 'weeks_five_to_seven',
    milestones: [
      'Fully weaned from mother',
      'Established play behaviors',
      'Social hierarchy development',
      'Enhanced coordination'
    ],
    criticalTasks: [
      'Structured socialization sessions',
      'Introduction to various surfaces/textures',
      'Begin housebreaking basics',
      'First vaccinations',
      'Exposure to household sounds'
    ]
  },
  {
    id: 'week8to10',
    label: 'Weeks 8-10',
    description: 'Preparation period for going to new homes with focus on temperament development.',
    daysRange: { min: 50, max: 70 },
    key: 'weeks_eight_to_ten',
    milestones: [
      'Ready for new homes',
      'Continued behavioral development',
      'Established feeding patterns'
    ],
    criticalTasks: [
      'Temperament testing',
      'Continued vaccination protocol',
      'Microchipping',
      'Prepare adoption paperwork',
      'Basic training introduction'
    ]
  },
  {
    id: 'over10weeks',
    label: 'Over 10 Weeks',
    description: 'Extended stay puppies requiring continued development focus.',
    daysRange: { min: 71, max: null },
    key: 'over_ten_weeks',
    milestones: [
      'Enhanced training capabilities',
      'Further socialization opportunities',
      'Established routines'
    ],
    criticalTasks: [
      'Continued training reinforcement',
      'Complete vaccination protocol',
      'Regular exercise routines',
      'Preparation for transition to adult dog status'
    ]
  }
];

export function usePuppyTracking() {
  const [puppiesByAgeGroup, setPuppiesByAgeGroup] = useState<Record<PuppyAgeGroup, PuppyWithAge[]>>({
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
  const determineAgeGroup = (ageInDays: number): PuppyAgeGroup => {
    for (const group of ageGroupsData) {
      if (
        ageInDays >= group.daysRange.min && 
        (group.daysRange.max === null || ageInDays <= group.daysRange.max)
      ) {
        return group.id;
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
      const groupedPuppies: Record<PuppyAgeGroup, PuppyWithAge[]> = {
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
        const ageGroup = determineAgeGroup(ageInDays);
        
        const puppyWithAge: PuppyWithAge = {
          ...puppy as Puppy, 
          ageInDays,
          ageGroup
        };
        
        groupedPuppies[ageGroup].push(puppyWithAge);
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
