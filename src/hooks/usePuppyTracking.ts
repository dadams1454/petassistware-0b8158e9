
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge, PuppyAgeGroupData, PuppyManagementStats } from '@/types/puppyTracking';

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
  },
  {
    id: 'adolescent',
    name: 'Adolescent Period',
    startDay: 85,
    endDay: 180,
    description: 'Beginning of adolescence and continuing socialization for new homes.',
    milestones: 'More independent, testing boundaries, advancing in training, developing adult characteristics.',
    careChecks: [
      'Continue socialization',
      'Monitor adult teeth development',
      'Advance training routines',
      'Prepare for home transition',
      'Complete medical protocols'
    ]
  },
  {
    id: 'young-adult',
    name: 'Young Adult',
    startDay: 181,
    endDay: 365,
    description: 'Continuing development towards adulthood with focus on training and behavior.',
    milestones: 'Approaching adult size, refining behaviors, solidifying training, settling into adult routine.',
    careChecks: [
      'Monitor growth plateauing',
      'Assess behavior stability',
      'Continue advanced training',
      'Schedule adult health checks',
      'Support new owners with transition'
    ]
  },
  {
    id: 'adult',
    name: 'Adult Stage',
    startDay: 366,
    endDay: 3650,
    description: 'Full maturity reached with focus on ongoing health maintenance.',
    milestones: 'Full physical and mental maturity, established behavior patterns, complete training foundation.',
    careChecks: [
      'Regular health maintenance',
      'Ongoing training reinforcement',
      'Dental health monitoring',
      'Weight management',
      'Schedule routine veterinary care'
    ]
  }
];

export const usePuppyTracking = () => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [puppiesByAgeGroup, setPuppiesByAgeGroup] = useState<Record<string, PuppyWithAge[]>>({});
  const [puppyStats, setPuppyStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    activeLitters: 0,
    upcomingVaccinations: 0,
    recentWeightChecks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the default age groups
  const ageGroups = DEFAULT_AGE_GROUPS;

  useEffect(() => {
    const fetchPuppies = async () => {
      setIsLoading(true);
      try {
        // Get all active litters
        const { data: litters, error: littersError } = await supabase
          .from('litters')
          .select('id, birth_date, litter_name')
          .not('status', 'eq', 'archived');
          
        if (littersError) throw littersError;
        
        // If no litters, return early
        if (!litters || litters.length === 0) {
          setPuppies([]);
          setPuppiesByAgeGroup({});
          setIsLoading(false);
          return;
        }
        
        // For each litter, get puppies
        const puppiesPromises = litters.map(async (litter) => {
          const { data: puppiesData, error: puppiesError } = await supabase
            .from('puppies')
            .select('*, litters(birth_date, litter_name)')
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
          
          // Make sure we safely access litters.name or default to undefined
          const litterName = puppy.litters?.litter_name;
          
          // Ensure all required properties for PuppyWithAge are included
          return {
            id: puppy.id,
            litter_id: puppy.litter_id,
            name: puppy.name,
            gender: puppy.gender,
            color: puppy.color,
            status: puppy.status,
            birth_date: puppy.birth_date,
            current_weight: puppy.current_weight,
            photo_url: puppy.photo_url,
            microchip_number: puppy.microchip_number,
            ageInDays,
            litters: {
              id: puppy.litter_id,
              name: litterName, // Use the litter name property we safely accessed
              birth_date: puppy.litters?.birth_date || ''
            }
          } as PuppyWithAge;
        });
        
        setPuppies(allPuppies);
        
        // Organize puppies by age group
        const groupedPuppies: Record<string, PuppyWithAge[]> = {};
        
        ageGroups.forEach(group => {
          groupedPuppies[group.id] = allPuppies.filter(puppy => 
            puppy.ageInDays >= group.startDay && puppy.ageInDays <= group.endDay
          );
        });
        
        setPuppiesByAgeGroup(groupedPuppies);
        
        // Calculate stats
        const stats: PuppyManagementStats = {
          totalPuppies: allPuppies.length,
          activeLitters: litters.length,
          upcomingVaccinations: 0, // This would require additional data fetching
          recentWeightChecks: 0    // This would require additional data fetching
        };
        
        setPuppyStats(stats);
        
        // Fetch vaccination data (simplified example)
        try {
          const { data: vaccineData } = await supabase
            .from('health_protocols')
            .select('*')
            .in('litter_id', litters.map(l => l.id))
            .gte('scheduled_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .lte('scheduled_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
            .is('completed_date', null);
            
          if (vaccineData) {
            stats.upcomingVaccinations = vaccineData.length;
            setPuppyStats({...stats});
          }
          
          // Fetch recent weight checks
          const { data: weightData } = await supabase
            .from('weight_records')
            .select('*')
            .in('puppy_id', allPuppies.map(p => p.id))
            .gte('created_at', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString());
            
          if (weightData) {
            stats.recentWeightChecks = weightData.length;
            setPuppyStats({...stats});
          }
        } catch (err) {
          console.log("Error fetching additional stats:", err);
          // Non-critical error, we'll still show the puppies
        }
        
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
    puppiesByAgeGroup,
    ageGroups,
    puppyStats,
    isLoading,
    error
  };
};
