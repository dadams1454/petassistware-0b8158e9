
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';

export const usePuppyDetails = (puppyId: string) => {
  return useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      if (!puppyId) {
        throw new Error('Puppy ID is required');
      }

      const { data, error } = await supabase
        .from('puppies')
        .select(`
          *,
          litters:litter_id (
            id,
            name,
            birth_date
          )
        `)
        .eq('id', puppyId)
        .single();

      if (error) {
        console.error('Error fetching puppy details:', error);
        throw error;
      }

      // Calculate age in days
      const birthDate = data.birth_date || data.litters?.birth_date;
      const ageInDays = birthDate 
        ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        ...data,
        ageInDays,
      } as PuppyWithAge;
    },
    enabled: !!puppyId
  });
};
