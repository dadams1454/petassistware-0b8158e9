
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';

const DEFAULT_AGE_GROUPS: PuppyAgeGroupData[] = [
  {
    id: 'neonatal',
    name: 'Neonatal Period',
    startDay: 0,
    endDay: 14,
    description: 'Puppies are completely dependent on their mother and require close monitoring.',
    milestones: 'Eyes and ears closed, limited movement, sleeping most of the time, requires mother\'s milk and warmth.',
    careChecks: [
      'Check weight daily',
      'Monitor nursing behavior',
      'Ensure warm environment (85-90°F)',
      'Check for signs of distress or rejection'
    ]
  },
  {
    id: 'transitional',
    name: 'Transitional Period',
    startDay: 15,
    endDay: 21,
    description: 'Puppies begin to open their eyes and ears, starting to become more aware of surroundings.',
    milestones: 'Eyes opening, beginning to hear, crawling, first teeth appearing, beginning to regulate temperature.',
    careChecks: [
      'Monitor weight gain',
      'Check eye opening progress',
      'Observe beginning of social interactions',
      'Begin very gentle handling',
      'Keep area clean'
    ]
  },
  {
    id: 'socialization',
    name: 'Early Socialization',
    startDay: 22,
    endDay: 49,
    description: 'Critical period for socialization and beginning to interact with surroundings and siblings.',
    milestones: 'Walking, playing with littermates, developing bite inhibition, weaning from mother\'s milk, exploring environment.',
    careChecks: [
      'Begin exposure to different surfaces and sounds',
      'Monitor play behavior',
      'Introduce basic handling routines',
      'Begin weaning process',
      'Watch for developmental delays'
    ]
  },
  {
    id: 'juvenile',
    name: 'Juvenile Period',
    startDay: 50,
    endDay: 84,
    description: 'Puppies are increasingly independent and prepare for adoption/new homes.',
    milestones: 'Fully weaned, increased exploratory behavior, developing individual personalities, responding to basic commands.',
    careChecks: [
      'Ensure vaccination schedule is followed',
      'Begin basic training routines',
      'Introduce to various environments',
      'Monitor growth and health',
      'Prepare for adoption assessment'
    ]
  }
];

export const usePuppyTracking = () => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the default age groups for now
  // In the future this could be customized by the breeder
  const ageGroups = DEFAULT_AGE_GROUPS;

  useEffect(() => {
    const fetchPuppies = async () => {
      setIsLoading(true);
      try {
        // Get all active litters
        const { data: litters, error: littersError } = await supabase
          .from('litters')
          .select('id, birth_date')
          .not('status', 'eq', 'archived');
          
        if (littersError) throw littersError;
        
        // If no litters, return early
        if (!litters || litters.length === 0) {
          setPuppies([]);
          setIsLoading(false);
          return;
        }
        
        // For each litter, get puppies
        const puppiesPromises = litters.map(async (litter) => {
          const { data: puppiesData, error: puppiesError } = await supabase
            .from('puppies')
            .select('*, litters(*)')
            .eq('litter_id', litter.id);
            
          if (puppiesError) throw puppiesError;
          return puppiesData || [];
        });
        
        const puppiesArrays = await Promise.all(puppiesPromises);
        
        // Flatten and process the puppies
        const allPuppies = puppiesArrays.flat().map(puppy => {
          // Calculate age in days
          const birthDate = puppy.birth_date || puppy.litters?.birth_date;
          let ageInDays = 0;
          
          if (birthDate) {
            const birthDateTime = new Date(birthDate).getTime();
            const now = new Date().getTime();
            ageInDays = Math.floor((now - birthDateTime) / (1000 * 60 * 60 * 24));
          }
          
          return {
            ...puppy,
            ageInDays
          } as PuppyWithAge;
        });
        
        setPuppies(allPuppies);
      } catch (err) {
        console.error('Error fetching puppies:', err);
        setError('Failed to load puppies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuppies();
  }, []);

  return {
    puppies,
    ageGroups,
    isLoading,
    error
  };
};
