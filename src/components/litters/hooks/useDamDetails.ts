
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDamDetails = (damId: string | null) => {
  return useQuery({
    queryKey: ['dam-details', damId],
    queryFn: async () => {
      if (!damId) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', damId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!damId,
  });
};
