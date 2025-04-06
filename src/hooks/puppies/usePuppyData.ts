
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppy';
import { differenceInDays } from 'date-fns';
import { getPuppyWeightRecords } from '@/services/puppyWeightService';
import { mapPuppyWithAgeFromDB } from '@/lib/mappers/puppyMapper';
import { mapWeightRecordFromDB } from '@/lib/mappers/weightMapper';

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
          
          if (birthDate) {
            age = differenceInDays(new Date(), new Date(birthDate));
          }
          
          // Fetch weight records
          const weightRecords = await getPuppyWeightRecords(puppy.id);
          const mappedWeightRecords = weightRecords.map(mapWeightRecordFromDB);
          
          // Create a puppy record with all necessary fields for mapping
          const puppyWithAgeData = {
            ...puppy,
            age,
            age_days: age,
            age_weeks: Math.floor(age / 7),
            weightHistory: mappedWeightRecords
          };
          
          // Use our mapper to get a properly typed PuppyWithAge
          return mapPuppyWithAgeFromDB(puppyWithAgeData);
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
