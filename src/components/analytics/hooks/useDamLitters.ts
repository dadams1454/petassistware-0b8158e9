
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDamLitters = (selectedDamId: string | null) => {
  // Query to get all dams with litters
  const { data: dams, isLoading: isLoadingDams } = useQuery({
    queryKey: ['dams-with-litters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          id, 
          name,
          breed,
          color,
          litters:litters!litters_dam_id_fkey(id, litter_name, birth_date)
        `)
        .eq('gender', 'Female')
        .filter('litters.id', 'not.is', null)
        .order('name');

      if (error) throw error;
      
      // Filter to only include dams with at least one litter
      return (data || []).filter(dam => dam.litters && dam.litters.length > 0);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Fetch litter details for the selected dam
  const { data: litterDetails, isLoading: isLoadingLitters } = useQuery({
    queryKey: ['dam-litters', selectedDamId],
    queryFn: async () => {
      if (!selectedDamId) return [];

      const { data, error } = await supabase
        .from('litters')
        .select(`
          id,
          litter_name,
          birth_date,
          sire:dogs!litters_sire_id_fkey(id, name, breed, color),
          puppies:puppies!puppies_litter_id_fkey(*)
        `)
        .eq('dam_id', selectedDamId)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedDamId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Get the selected dam details
  const selectedDam = dams && selectedDamId 
    ? dams.find(dam => dam.id === selectedDamId)
    : null;

  return {
    dams,
    selectedDam,
    litterDetails,
    isLoadingDams,
    isLoadingLitters,
  };
};
