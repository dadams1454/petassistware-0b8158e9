
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
      let birthDateString = data.birth_date;
      
      // Safely check if litters data exists and has a birth_date
      if (!birthDateString && data.litters && typeof data.litters === 'object') {
        birthDateString = (data.litters as any).birth_date;
      }
      
      let ageInDays = 0;
      if (birthDateString) {
        const birthDate = new Date(birthDateString);
        ageInDays = differenceInDays(new Date(), birthDate);
      }

      // Cast to PuppyWithAge and return
      return {
        ...data,
        ageInDays
      } as PuppyWithAge;
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
