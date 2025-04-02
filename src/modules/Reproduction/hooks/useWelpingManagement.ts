
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/dog';
import { Litter } from '@/types/litter';

export interface WelpingManagementState {
  pregnantDogs: Dog[];
  activeWelpings: any[];
  upcomingWelpings: any[];
  recentLitters: any[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useWelpingManagement = (): WelpingManagementState & {
  deleteLitter: (litterId: string) => Promise<void>;
  updateLitterStatus: (litter: Litter) => Promise<void>;
  markLitterAsWhelping: (litter: Litter) => Promise<void>;
} => {
  const queryClient = useQueryClient();
  
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
      
      // Map the data to match Dog type
      const mappedDogs = data.map(dog => ({
        id: dog.id,
        name: dog.name,
        photoUrl: dog.photo_url,
        gender: dog.gender,
        breed: dog.breed,
        color: dog.color,
        isPregnant: dog.is_pregnant,
        lastHeatDate: dog.last_heat_date,
        tieDate: dog.tie_date,
        created_at: dog.created_at || new Date().toISOString(),
        // Add other required properties from the Dog type with defaults
        birthdate: dog.birthdate || null,
        akc_registration: dog.akc_registration || null,
        microchip: dog.microchip || null,
        status: dog.status || 'Active',
        notes: dog.notes || '',
        owner_id: dog.owner_id || null
      })) as Dog[];
      
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
  
  // Mutations
  const deleteLitterMutation = useMutation({
    mutationFn: async (litterId: string) => {
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterId);
        
      if (error) throw new Error(error.message);
      return "";
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      queryClient.invalidateQueries({ queryKey: ['activeWelpings'] });
      queryClient.invalidateQueries({ queryKey: ['recentLitters'] });
    },
  });
  
  const updateLitterStatusMutation = useMutation({
    mutationFn: async (litter: Litter) => {
      const { error } = await supabase
        .from('litters')
        .update({ status: litter.status })
        .eq('id', litter.id);
        
      if (error) throw new Error(error.message);
      return "";
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      queryClient.invalidateQueries({ queryKey: ['activeWelpings'] });
      queryClient.invalidateQueries({ queryKey: ['recentLitters'] });
    },
  });
  
  const markLitterAsWhelpingMutation = useMutation({
    mutationFn: async (litter: Litter) => {
      const { error } = await supabase
        .from('litters')
        .update({ 
          status: 'Whelping',
          whelp_date: new Date().toISOString()
        })
        .eq('id', litter.id);
        
      if (error) throw new Error(error.message);
      return "";
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      queryClient.invalidateQueries({ queryKey: ['activeWelpings'] });
      queryClient.invalidateQueries({ queryKey: ['pregnantDogs'] });
    },
  });
  
  const deleteLitter = async (litterId: string) => {
    await deleteLitterMutation.mutateAsync(litterId);
  };
  
  const updateLitterStatus = async (litter: Litter) => {
    await updateLitterStatusMutation.mutateAsync(litter);
  };
  
  const markLitterAsWhelping = async (litter: Litter) => {
    await markLitterAsWhelpingMutation.mutateAsync(litter);
  };
  
  const isLoading = isLoadingPregnant || isLoadingActive || isLoadingRecent;
  const isError = isErrorPregnant || isErrorActive || isErrorRecent;
  const error = errorPregnant || errorActive || errorRecent;
  
  return {
    pregnantDogs,
    activeWelpings,
    upcomingWelpings: [],
    recentLitters,
    isLoading,
    isError,
    error,
    deleteLitter,
    updateLitterStatus,
    markLitterAsWhelping,
  };
};
