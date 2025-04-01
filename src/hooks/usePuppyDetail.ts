
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePuppyDetail = (puppyId: string) => {
  return useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      if (!puppyId) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select(`
          *,
          litter:litter_id(
            id, 
            birth_date, 
            dam:dam_id(id, name, breed),
            sire:sire_id(id, name, breed)
          )
        `)
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      
      // Calculate age in days
      const birthDate = data.birth_date || (data.litter?.birth_date);
      let ageInDays = 0;
      
      if (birthDate) {
        const birthDateTime = new Date(birthDate).getTime();
        const now = new Date().getTime();
        ageInDays = Math.floor((now - birthDateTime) / (1000 * 60 * 60 * 24));
      }
      
      return { ...data, ageInDays };
    },
    enabled: !!puppyId,
  });
};
