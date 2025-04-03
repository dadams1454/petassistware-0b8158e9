
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Litter } from '@/types/litter';
import { WelpingMutationHookResult } from './welpingTypes';

export const useWelpingMutations = (): WelpingMutationHookResult => {
  const queryClient = useQueryClient();
  
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
          status: 'Whelping' as "active",
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
  
  return {
    deleteLitter,
    updateLitterStatus,
    markLitterAsWhelping,
  };
};
