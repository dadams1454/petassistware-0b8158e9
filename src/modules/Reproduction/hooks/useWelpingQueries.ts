
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/litter';
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
        breedStatus: dog.is_pregnant ? 'pregnant' : 'available',
        lastHeatDate: dog.last_heat_date,
        tieDate: dog.tie_date,
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
      
      // Transform data to ensure it conforms to Litter type
      return data.map(litter => ({
        ...litter,
        status: litter.status as "active" | "completed" | "planned" | "archived",
        dam: litter.dam || { id: '', name: '' }, // Ensure dam is valid
        sire: litter.sire || { id: '', name: '' } // Ensure sire is valid
      }));
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
      
      // Transform data to ensure it conforms to Litter type
      return data.map(litter => ({
        ...litter,
        status: litter.status as "active" | "completed" | "planned" | "archived",
        dam: litter.dam || { id: '', name: '' },
        sire: litter.sire || { id: '', name: '' }
      }));
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
