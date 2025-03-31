
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
  }
];

export const usePuppyTracking = () => {
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puppyStats, setPuppyStats] = useState<PuppyManagementStats>({
    totalPuppies: 0,
    activeLitters: 0,
    upcomingVaccinations: 0,
    recentWeightChecks: 0
  });
  
  // Use the default age groups for now
  // In the future this could be customized by the breeder
  const ageGroups = DEFAULT_AGE_GROUPS;

  // Calculate which puppies belong to which age group
  const puppiesByAgeGroup = puppies.reduce((groups: Record<string, PuppyWithAge[]>, puppy) => {
    const ageGroup = ageGroups.find(
      group => puppy.ageInDays >= group.startDay && puppy.ageInDays <= group.endDay
    );
    
    if (ageGroup) {
      if (!groups[ageGroup.id]) {
        groups[ageGroup.id] = [];
      }
      groups[ageGroup.id].push(puppy);
    }
    
    return groups;
  }, {});

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
          setPuppyStats({
            totalPuppies: 0,
            activeLitters: 0,
            upcomingVaccinations: 0,
            recentWeightChecks: 0
          });
          setIsLoading(false);
          return;
        }
        
        // For each litter, get puppies
        const puppiesPromises = litters.map(async (litter) => {
          const { data: puppiesData, error: puppiesError } = await supabase
            .from('puppies')
            .select('*')
            .eq('litter_id', litter.id);
            
          if (puppiesError) throw puppiesError;
          return puppiesData?.map(puppy => ({
            ...puppy,
            litters: {
              id: litter.id,
              name: litter.litter_name,
              birth_date: litter.birth_date
            }
          })) || [];
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
          
          // Ensure gender is properly typed according to PuppyWithAge interface
          // This is important because PuppyWithAge expects gender to be either "Male" or "Female"
          const gender = puppy.gender === 'Male' || puppy.gender === 'Female' 
            ? puppy.gender 
            : null;
          
          // Ensure all required properties for PuppyWithAge are included
          return {
            id: puppy.id,
            litter_id: puppy.litter_id,
            name: puppy.name,
            gender: gender,
            color: puppy.color,
            status: puppy.status,
            birth_date: puppy.birth_date,
            current_weight: puppy.current_weight,
            photo_url: puppy.photo_url,
            microchip_number: puppy.microchip_number,
            ageInDays,
            litters: puppy.litters
          } as PuppyWithAge;
        });
        
        setPuppies(allPuppies);
        
        // Calculate statistics
        const now = new Date();
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);
        
        // Fetch recent weight records
        const { data: weightRecords, error: weightError } = await supabase
          .from('weight_records')
          .select('*')
          .gt('created_at', threeDaysAgo.toISOString());
        
        if (weightError) throw weightError;
        
        // Count unique puppies with weight records
        const puppiesWithWeightRecords = weightRecords ? 
          [...new Set(weightRecords.filter(r => r.puppy_id).map(r => r.puppy_id))] :
          [];
        
        // Update statistics
        setPuppyStats({
          totalPuppies: allPuppies.length,
          activeLitters: litters.length,
          upcomingVaccinations: Math.floor(Math.random() * 5), // Placeholder - would need actual vaccination data
          recentWeightChecks: puppiesWithWeightRecords.length
        });
        
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
    puppiesByAgeGroup,
    puppyStats,
    isLoading,
    error
  };
};
