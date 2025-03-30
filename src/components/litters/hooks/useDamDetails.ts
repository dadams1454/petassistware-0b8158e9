
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch and return dam details when dam_id changes
 */
export const useDamDetails = (damId: string | null) => {
  return useQuery({
    queryKey: ['dam-details', damId],
    queryFn: async () => {
      if (!damId || damId === 'none') return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', damId)
        .single();
      
      if (error) {
        console.error('Error fetching dam details:', error);
        return null;
      }
      
      console.log('Successfully fetched dam details:', data);
      return data;
    },
    enabled: !!damId && damId !== 'none',
  });
};
