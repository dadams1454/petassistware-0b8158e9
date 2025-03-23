
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const useLittersData = () => {
  // Fetch all litters with puppies data with improved caching strategy
  const { data: litters, isLoading: isLoadingLitters, error: littersError } = useQuery({
    queryKey: ['litters-with-puppies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          id,
          litter_name,
          birth_date,
          dam:dogs!litters_dam_id_fkey(id, name),
          sire:dogs!litters_sire_id_fkey(id, name),
          puppies:puppies!puppies_litter_id_fkey(*)
        `)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes in the background
  });

  return {
    litters,
    isLoadingLitters,
    littersError
  };
};

export default useLittersData;
