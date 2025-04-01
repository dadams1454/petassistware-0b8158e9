
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WeightRecord } from '@/types/puppyTracking';

export const usePuppyWeights = (puppyId: string) => {
  const {
    data: weights,
    isLoading,
    error
  } = useQuery({
    queryKey: ['puppy-weights', puppyId],
    queryFn: async () => {
      try {
        // Get puppy birth date
        const { data: puppy, error: puppyError } = await supabase
          .from('puppies')
          .select('*, litters(birth_date)')
          .eq('id', puppyId)
          .single();
        
        if (puppyError) throw puppyError;
        
        // Determine birth date to calculate age
        const birthDate = puppy.birth_date || (puppy.litters ? puppy.litters.birth_date : null);
        
        if (!birthDate) {
          throw new Error('Could not determine puppy birth date');
        }
        
        // Fetch weight records
        const { data, error } = await supabase
          .from('weight_records')
          .select('*')
          .eq('dog_id', puppyId)
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        // Return weight records with birth date
        return data.map(record => ({
          ...record,
          birth_date: birthDate
        })) as WeightRecord[];
      } catch (error) {
        console.error('Error fetching puppy weights:', error);
        throw error;
      }
    },
    enabled: !!puppyId
  });
  
  return {
    weights,
    isLoading,
    error
  };
};
