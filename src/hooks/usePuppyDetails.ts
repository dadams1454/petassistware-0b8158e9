
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';
import { differenceInDays } from 'date-fns';

export const usePuppyDetails = (puppyId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['puppy-detail', puppyId],
    queryFn: async () => {
      if (!puppyId) {
        throw new Error('Puppy ID is required');
      }

      const { data, error } = await supabase
        .from('puppies')
        .select(`
          *,
          litters:litter_id(name, birth_date)
        `)
        .eq('id', puppyId)
        .single();

      if (error) {
        console.error('Error fetching puppy details:', error);
        throw error;
      }

      // Calculate age in days
      const birthDateString = data.birth_date || 
        (data.litters && typeof data.litters === 'object' && 'birth_date' in data.litters ? data.litters.birth_date : null);
      
      let ageInDays = 0;
      if (birthDateString) {
        const birthDate = new Date(birthDateString as string);
        ageInDays = differenceInDays(new Date(), birthDate);
      }

      // Cast to PuppyWithAge and return
      return {
        ...data,
        ageInDays
      } as unknown as PuppyWithAge;
    },
    enabled: !!puppyId
  });

  return {
    data,
    isLoading,
    error,
    refetch
  };
};
