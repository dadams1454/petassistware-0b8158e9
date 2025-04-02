
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/reproductive';
import { WelpingQueryHookResult } from './welpingTypes';

export const useWelpingQueries = (): WelpingQueryHookResult => {
  // Fetch pregnant dogs
  const {
    data: pregnantDogs = [],
    isLoading: isLoadingPregnant,
    isError: isErrorPregnant,
    error: errorPregnant,
  } = useQuery({
    queryKey: ['pregnantDogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .eq('is_pregnant', true);
        
      if (error) throw new Error(error.message);
      
      // Map the data to match the Dog type with appropriate property names
      const mappedDogs: Dog[] = data.map(dog => ({
        id: dog.id,
        name: dog.name,
        photoUrl: dog.photo_url, // Map photo_url to photoUrl
        gender: dog.gender,
        is_pregnant: dog.is_pregnant,
        last_heat_date: dog.last_heat_date,
        tie_date: dog.tie_date,
        breed: dog.breed,
        color: dog.color,
        created_at: dog.created_at
      }));
      
      return mappedDogs;
    }
  });
  
  // Fetch active whelpings
  const {
    data: activeWelpings = [],
    isLoading: isLoadingActive,
    isError: isErrorActive,
    error: errorActive,
  } = useQuery({
    queryKey: ['activeWelpings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*)
        `)
        .eq('status', 'Whelping')
        .order('expected_date', { ascending: true });
        
      if (error) throw new Error(error.message);
      return data;
    }
  });
  
  // Fetch recent litters (completed)
  const {
    data: recentLitters = [],
    isLoading: isLoadingRecent,
    isError: isErrorRecent,
    error: errorRecent,
  } = useQuery({
    queryKey: ['recentLitters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*)
        `)
        .in('status', ['Complete', 'Weaning'])
        .order('whelp_date', { ascending: false })
        .limit(5);
        
      if (error) throw new Error(error.message);
      return data;
    }
  });
  
  return {
    pregnantDogs,
    activeWelpings,
    recentLitters,
    isLoadingPregnant,
    isErrorPregnant,
    errorPregnant,
    isLoadingActive,
    isErrorActive,
    errorActive,
    isLoadingRecent,
    isErrorRecent,
    errorRecent
  };
};
