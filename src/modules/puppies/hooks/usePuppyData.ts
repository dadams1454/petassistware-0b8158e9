
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';
import { calculateAgeInDays } from '@/utils/dateUtils';

/**
 * Hook to fetch puppy data with age calculations
 */
export function usePuppyData(puppyId: string) {
  return useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('id', puppyId)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('Puppy not found');
      }
      
      // Calculate age in days
      const ageInDays = calculateAgeInDays(data.birth_date);
      const ageInWeeks = Math.floor(ageInDays / 7);
      
      // Create age description
      let ageDescription = '';
      if (ageInDays < 7) {
        ageDescription = `${ageInDays} days`;
      } else if (ageInDays < 14) {
        ageDescription = `1 week, ${ageInDays % 7} days`;
      } else {
        ageDescription = `${ageInWeeks} weeks`;
        if (ageInDays % 7 > 0) {
          ageDescription += `, ${ageInDays % 7} days`;
        }
      }
      
      // Return puppy with age data
      return {
        ...data,
        ageInDays,
        ageInWeeks,
        ageDescription
      } as PuppyWithAge;
    }
  });
}
