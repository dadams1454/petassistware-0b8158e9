
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WeightData } from '@/types/puppyTracking';

export const usePuppyBreedAverages = (puppyId: string) => {
  const {
    data: breedAverages,
    isLoading,
    error
  } = useQuery({
    queryKey: ['puppy-breed-averages', puppyId],
    queryFn: async () => {
      try {
        // First, get the puppy to determine its breed
        const { data: puppy, error: puppyError } = await supabase
          .from('puppies')
          .select('*, litters(*)')
          .eq('id', puppyId)
          .single();
        
        if (puppyError) throw puppyError;
        
        // Need to check for breed in different locations
        // Use a default breed if we cannot determine the puppy's breed
        let breed = 'Newfoundland';
        
        // Try to determine breed from litter data or set a default
        if (puppy?.litters) {
          // Check if breed is directly in litters object
          if (typeof puppy.litters === 'object' && puppy.litters !== null) {
            // Fix: Use a type guard to check if 'breed' exists in puppy.litters
            if ('breed' in puppy.litters && typeof puppy.litters.breed === 'string') {
              breed = puppy.litters.breed || 'Newfoundland';
            }
          }
        }

        // For now, return hardcoded average growth data for the breed
        // In a real app, this would come from a database of breed growth charts
        const averageGrowthData: WeightData[] = [
          { age: 0, weight: 1.2 }, // Birth
          { age: 7, weight: 2.5 }, // 1 week
          { age: 14, weight: 4.0 }, // 2 weeks
          { age: 21, weight: 5.5 }, // 3 weeks
          { age: 28, weight: 7.0 }, // 4 weeks
          { age: 42, weight: 10.0 }, // 6 weeks
          { age: 56, weight: 14.0 }, // 8 weeks
          { age: 84, weight: 20.0 }, // 12 weeks
          { age: 112, weight: 26.0 }, // 16 weeks
          { age: 140, weight: 32.0 }, // 20 weeks
          { age: 168, weight: 38.0 }, // 24 weeks
          { age: 252, weight: 50.0 }, // 36 weeks
          { age: 365, weight: 60.0 }, // 1 year
        ];
        
        // For Newfoundlands or any large breed, we'll use these data points
        return {
          breed,
          averageGrowthData,
        };
      } catch (error) {
        console.error('Error fetching breed averages:', error);
        throw error;
      }
    },
    enabled: !!puppyId
  });
  
  return {
    breedAverages,
    isLoading,
    error
  };
};
