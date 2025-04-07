
/**
 * Hook for fetching puppy data from Supabase
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '../types';
import { differenceInDays } from 'date-fns';
import { mapPuppyWithAgeFromDB } from '@/lib/mappers/puppyMapper';
import { mapWeightRecordFromDB } from '@/lib/mappers/weightMapper';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to fetch puppy data from Supabase
 * @returns Puppies, loading state, error state, and refetch function
 */
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
          toast({
            title: 'Error fetching puppies',
            description: puppiesError.message,
            variant: 'destructive',
          });
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
          const { data: weightRecordsData } = await supabase
            .from('puppy_weights')
            .select('*')
            .eq('puppy_id', puppy.id)
            .order('date', { ascending: false });
            
          const mappedWeightRecords = (weightRecordsData || []).map(mapWeightRecordFromDB);
          
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
        const error = err instanceof Error ? err : new Error('Unknown error fetching puppies');
        toast({
          title: 'Error fetching puppies',
          description: error.message,
          variant: 'destructive',
        });
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
