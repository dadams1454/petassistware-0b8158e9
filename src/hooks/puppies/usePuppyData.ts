
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';
import { differenceInDays } from 'date-fns';
import { getPuppyWeightRecords } from '@/services/puppyWeightService';

export const usePuppyData = () => {
  const { 
    data: puppies, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['puppies'],
    queryFn: async (): Promise<PuppyWithAge[]> => {
      try {
        // Fetch all puppies
        const { data: puppiesData, error: puppiesError } = await supabase
          .from('puppies')
          .select(`
            *,
            litter:litter_id(
              birth_date,
              dam:dam_id(
                name,
                breed
              ),
              sire:sire_id(
                name,
                breed
              )
            )
          `)
          .order('birth_date', { ascending: false });
          
        if (puppiesError) {
          console.error('Error fetching puppies:', puppiesError);
          return [];
        }
        
        // Enhance puppies with age data
        const enhancedPuppies = await Promise.all((puppiesData || []).map(async (puppy) => {
          // Calculate age
          const birthDate = puppy.birth_date || puppy.litter?.birth_date;
          let age = 0;
          let ageInWeeks = 0;
          
          if (birthDate) {
            age = differenceInDays(new Date(), new Date(birthDate));
            ageInWeeks = Math.floor(age / 7);
          }
          
          // Fetch weight records
          const weightHistory = await getPuppyWeightRecords(puppy.id);
          
          // Determine developmental stage based on age
          let developmentalStage = 'Unknown';
          if (age <= 14) developmentalStage = 'Neonatal';
          else if (age <= 21) developmentalStage = 'Transitional';
          else if (age <= 49) developmentalStage = 'Socialization';
          else if (age <= 84) developmentalStage = 'Juvenile';
          else developmentalStage = 'Adolescent';
          
          return {
            ...puppy,
            age,
            ageInDays: age,
            ageInWeeks,
            developmentalStage,
            weightHistory
          };
        }));
        
        return enhancedPuppies;
      } catch (err) {
        console.error('Exception in usePuppyData:', err);
        return [];
      }
    }
  });
  
  return {
    puppies: puppies || [],
    isLoading,
    error,
    refetch
  };
};
