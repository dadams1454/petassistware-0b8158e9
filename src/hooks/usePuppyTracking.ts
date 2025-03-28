
import { useState, useEffect, useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge, PuppyAgeGroup, PuppyAgeGroupData } from '@/types/puppyTracking';
import { useToast } from '@/components/ui/use-toast';

// Define the age groups data
const ageGroups: PuppyAgeGroupData[] = [
  {
    id: 'first24hours',
    label: 'First 24 Hours',
    description: 'Critical monitoring period right after birth',
    daysRange: { min: 0, max: 1 },
    key: '0-1d',
    milestones: ['First feeding', 'Weight check'],
    criticalTasks: ['Monitor temperature', 'Ensure nursing', 'Check umbilical cord']
  },
  {
    id: 'first48hours',
    label: 'First 48 Hours',
    description: 'Continued close monitoring',
    daysRange: { min: 1, max: 2 },
    key: '1-2d',
    milestones: ['Weight gain check', 'Activity level assessment'],
    criticalTasks: ['Monitor nursing frequency', 'Check for dehydration']
  },
  {
    id: 'first7days',
    label: 'First Week',
    description: 'Initial development period',
    daysRange: { min: 2, max: 7 },
    key: '2-7d',
    milestones: ['Daily weight monitoring', 'Umbilical cord healing'],
    criticalTasks: ['Regular weighing', 'Monitor temperature', 'Check for milk intake']
  },
  {
    id: 'week2',
    label: 'Week 2',
    description: 'Eyes beginning to open',
    daysRange: { min: 7, max: 14 },
    key: '7-14d',
    milestones: ['Eyes opening', 'Crawling improvement'],
    criticalTasks: ['Daily weighing', 'Environment cleaning', 'Temperature regulation']
  },
  {
    id: 'week3to4',
    label: 'Weeks 3-4',
    description: 'Starting to walk and exploring',
    daysRange: { min: 14, max: 28 },
    key: '14-28d',
    milestones: ['Walking', 'Playing with littermates', 'First teeth'],
    criticalTasks: ['Introduce weaning foods', 'Socialization begins', 'Deworming']
  },
  {
    id: 'week5to7',
    label: 'Weeks 5-7',
    description: 'Socialization and weaning period',
    daysRange: { min: 28, max: 49 },
    key: '28-49d',
    milestones: ['Fully weaned', 'Interactive play', 'Personality development'],
    criticalTasks: ['Full weaning', 'Vaccinations', 'Socialization training']
  },
  {
    id: 'week8to10',
    label: 'Weeks 8-10',
    description: 'Preparing for new homes',
    daysRange: { min: 49, max: 70 },
    key: '49-70d',
    milestones: ['Health check for adoption', 'Microchipping'],
    criticalTasks: ['Final health assessment', 'Prepare adoption paperwork', 'Advanced socialization']
  },
  {
    id: 'over10weeks',
    label: 'Over 10 Weeks',
    description: 'Ready for adoption or transitioning to kennel dogs',
    daysRange: { min: 70, max: null },
    key: '70+d',
    milestones: ['Readiness assessment', 'Adoption or kennel transition'],
    criticalTasks: ['Final vaccinations', 'Prepare for transition', 'Advanced training']
  }
];

export const usePuppyTracking = () => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPuppies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get active litters first (those with puppies under care)
      const { data: litters, error: littersError } = await supabase
        .from('litters')
        .select('id, litter_name, birth_date')
        .eq('status', 'active');

      if (littersError) throw littersError;
      
      if (!litters || litters.length === 0) {
        setPuppies([]);
        setIsLoading(false);
        return;
      }
      
      // Get all puppies from active litters
      const litterIds = litters.map(litter => litter.id);
      const { data: puppiesData, error: puppiesError } = await supabase
        .from('puppies')
        .select('*, litter_id')
        .in('litter_id', litterIds)
        .not('status', 'eq', 'Deceased'); // Exclude deceased puppies
      
      if (puppiesError) throw puppiesError;
      
      if (!puppiesData) {
        setPuppies([]);
        setIsLoading(false);
        return;
      }
      
      // Add birth date info from litters to puppies
      const processedPuppies = puppiesData.map(puppy => {
        const litter = litters.find(l => l.id === puppy.litter_id);
        const birthDateStr = puppy.birth_date || (litter ? litter.birth_date : null);
        const birthDate = birthDateStr ? new Date(birthDateStr) : new Date();
        const today = new Date();
        
        // Calculate age in days
        const ageInDays = differenceInDays(today, birthDate);
        
        // Determine age group
        const ageGroup = determineAgeGroup(ageInDays);
        
        return {
          ...puppy,
          birthDate: birthDate,
          ageInDays,
          ageGroup
        };
      });
      
      setPuppies(processedPuppies);
    } catch (err) {
      console.error('Error fetching puppies:', err);
      setError('Failed to fetch puppies. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch puppies data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to determine age group
  const determineAgeGroup = (ageInDays: number): PuppyAgeGroup => {
    for (const group of ageGroups) {
      if (
        ageInDays >= group.daysRange.min && 
        (group.daysRange.max === null || ageInDays < group.daysRange.max)
      ) {
        return group.id;
      }
    }
    return 'over10weeks'; // Default for any puppy that doesn't fit other categories
  };
  
  // Group puppies by age group
  const puppiesByAgeGroup = useMemo(() => {
    const grouped: Record<PuppyAgeGroup, PuppyWithAge[]> = {
      first24hours: [],
      first48hours: [],
      first7days: [],
      week2: [],
      week3to4: [],
      week5to7: [],
      week8to10: [],
      over10weeks: []
    };
    
    puppies.forEach(puppy => {
      grouped[puppy.ageGroup].push(puppy);
    });
    
    return grouped;
  }, [puppies]);
  
  useEffect(() => {
    fetchPuppies();
  }, []);
  
  return {
    puppies,
    puppiesByAgeGroup,
    ageGroups,
    isLoading,
    error,
    refetch: fetchPuppies
  };
};

export const useAgeGroups = () => {
  return ageGroups;
};
