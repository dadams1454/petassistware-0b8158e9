
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Litter } from '@/types/litter';
import { WelpingLog, WelpingObservation } from '@/types/reproductive';

export type WelpingLogEntry = WelpingLog;

export const useWelping = (litterId?: string) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Query to fetch litter data
  const {
    data: litter,
    isLoading,
    error,
    refetch: refetchLitter
  } = useQuery({
    queryKey: ['litter', litterId],
    queryFn: async () => {
      if (!litterId) return null;

      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*),
          puppies:puppies(*)
        `)
        .eq('id', litterId)
        .single();

      if (error) throw error;
      return data as unknown as Litter;
    },
    enabled: !!litterId,
  });

  // Query to fetch welping logs
  const {
    data: welpingLogs,
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['welpingLogs', litterId],
    queryFn: async () => {
      if (!litterId) return [];

      const { data, error } = await supabase
        .from('welping_logs')
        .select('*')
        .eq('litter_id', litterId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data as WelpingLogEntry[];
    },
    enabled: !!litterId,
  });

  // Mutation to update litter
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Litter>) => {
      if (!litterId) throw new Error('Litter ID is required for updates');

      const { data, error } = await supabase
        .from('litters')
        .update(updates)
        .eq('id', litterId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['litter', litterId] });
    },
  });

  // Mutation to add welping log
  const addLogMutation = useMutation({
    mutationFn: async (logEntry: Omit<WelpingLogEntry, 'id'>) => {
      const { data, error } = await supabase
        .from('welping_logs')
        .insert(logEntry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welpingLogs', litterId] });
    },
  });

  // Mutation to create a new welping record
  const createMutation = useMutation({
    mutationFn: async (litterData: Partial<Litter> & {breeder_id: string; birth_date: string}) => {
      setIsCreating(true);
      
      try {
        const { data, error } = await supabase
          .from('litters')
          .insert(litterData)
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsCreating(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['litters'] });
      return data;
    },
  });

  // Function to add a welping observation (for compatibility with WelpingLogTimeline)
  const addWelpingObservation = async (observation: Omit<WelpingObservation, 'id' | 'created_at'>) => {
    // Convert to format expected by addWelpingLog
    const logEntry = {
      litter_id: observation.welping_id,
      timestamp: observation.observation_time,
      event_type: 'note' as const,
      notes: observation.notes,
      // Add other fields as needed
    };
    
    return addLogMutation.mutateAsync(logEntry);
  };
  
  return {
    litter,
    isLoading,
    error,
    welpingLogs: welpingLogs || [],
    isLoadingLogs,
    refetchLitter,
    refetchLogs,
    updateWelping: updateMutation.mutateAsync,
    addWelpingLog: addLogMutation.mutateAsync,
    addWelpingObservation,
    createWelping: createMutation.mutateAsync,
    isCreating,
  };
};
