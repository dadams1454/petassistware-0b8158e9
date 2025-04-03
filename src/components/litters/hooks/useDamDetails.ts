
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types';

/**
 * Hook to fetch dam details
 */
export const useDamDetails = (damId?: string) => {
  return useQuery({
    queryKey: ['dog', damId],
    queryFn: async () => {
      if (!damId) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', damId)
        .single();
      
      if (error) {
        console.error('Error fetching dam details:', error);
        throw error;
      }
      
      return data as Dog;
    },
    enabled: !!damId, // Only run query if we have a damId
  });
};
