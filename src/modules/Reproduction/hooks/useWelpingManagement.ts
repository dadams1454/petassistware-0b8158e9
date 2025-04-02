import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/reproductive';
import { Litter } from '@/types/litter';

export interface WelpingManagementState {
  pregnantDogs: Dog[];
  activeWelpings: any[];
  activeLitters: any[]; // Add this property
  upcomingWelpings: any[];
  recentLitters: any[];
  activeWelpingsCount: number; // Add this property
  pregnantCount: number; // Add this property
  totalPuppiesCount: number; // Add this property
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
  
  // Mutations
  const deleteLitterMutation = useMutation({
    mutationFn: async (litterId: string) => {
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterId);
        
      if (error) throw new Error(error.message);
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      queryClient.invalidateQueries({ queryKey: ['activeWelpings'] });
      queryClient.invalidateQueries({ queryKey: ['pregnantDogs'] });
    },
  });
  
  // Modify the wrapper functions to match the expected Promise<void> return type
  const deleteLitter = async (litterId: string): Promise<void> => {
    await deleteLitterMutation.mutateAsync(litterId);
  };
  
  const updateLitterStatus = async (litter: Litter): Promise<void> => {
    await updateLitterStatusMutation.mutateAsync(litter);
  };
  
  const markLitterAsWhelping = async (litter: Litter): Promise<void> => {
    await markLitterAsWhelpingMutation.mutateAsync(litter);
  };
  
  const isLoading = isLoadingPregnant || isLoadingActive || isLoadingRecent;
  const isError = isErrorPregnant || isErrorActive || isErrorRecent;
  const error = errorPregnant || errorActive || errorRecent;
  
  // Calculate some stats for the dashboard
  const pregnantCount = pregnantDogs.length;
  const activeWelpingsCount = activeWelpings.length;
  const totalPuppiesCount = [...activeWelpings, ...recentLitters].reduce(
    (total, litter: any) => total + (litter.puppy_count || 0), 
    0
  );
  
  return {
    pregnantDogs,
    activeWelpings,
    activeLitters: activeWelpings, // Map activeWelpings to activeLitters for backward compatibility
    upcomingWelpings: [],
    recentLitters,
    pregnantCount,
    activeWelpingsCount,
    totalPuppiesCount,
    isLoading,
    isError,
    error,
    deleteLitter,
    updateLitterStatus,
    markLitterAsWhelping,
  };
};
