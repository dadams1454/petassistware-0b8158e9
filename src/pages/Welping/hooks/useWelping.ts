
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WelpingLog, WelpingObservation } from '@/types/welping';

export const useWelping = (litterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch welping logs
  const { 
    data: welpingLogs = [], 
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['welpingLogs', litterId],
    queryFn: async () => {
      if (!litterId) return [];
      
      const { data, error } = await supabase
        .from('welping_logs')
        .select('*')
        .eq('litter_id', litterId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!litterId
  });

  // Fetch observations
  const {
    data: observations = [],
    isLoading: isLoadingObservations,
    error: observationsError,
    refetch: refetchObservations
  } = useQuery({
    queryKey: ['welpingObservations', litterId],
    queryFn: async () => {
      if (!litterId) return [];
      
      const { data, error } = await supabase
        .from('welping_observations')
        .select('*')
        .eq('welping_record_id', litterId)
        .order('observation_time', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!litterId
  });

  // Add a welping log
  const addWelpingLogMutation = useMutation({
    mutationFn: async (logData: Partial<WelpingLog>) => {
      if (!litterId) throw new Error('Litter ID is required');
      
      // Ensure required fields are present
      if (!logData.event_type) {
        throw new Error('Event type is required');
      }
      
      const newLog = {
        litter_id: litterId,
        timestamp: logData.timestamp || new Date().toISOString(),
        event_type: logData.event_type,
        notes: logData.notes || null,
        puppy_id: logData.puppy_id || null,
        puppy_details: logData.puppy_details || null,
        created_at: new Date().toISOString()
      };
      
      // Use array form for better type inference
      const { data, error } = await supabase
        .from('welping_logs')
        .insert([newLog])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Log Added',
        description: 'Welping log has been recorded successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['welpingLogs', litterId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add welping log: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Add an observation
  const addObservationMutation = useMutation({
    mutationFn: async (observationData: Partial<WelpingObservation>) => {
      if (!litterId) throw new Error('Welping record ID is required');
      
      // Ensure required fields are present
      if (!observationData.observation_type) {
        throw new Error('Observation type is required');
      }
      
      if (!observationData.description) {
        throw new Error('Description is required');
      }
      
      const newObservation = {
        welping_record_id: litterId,
        observation_time: observationData.observation_time || new Date().toISOString(),
        observation_type: observationData.observation_type,
        description: observationData.description,
        puppy_id: observationData.puppy_id || null,
        action_taken: observationData.action_taken || null,
        created_at: new Date().toISOString()
      };
      
      // Use array form for better type inference
      const { data, error } = await supabase
        .from('welping_observations')
        .insert([newObservation])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Observation Added',
        description: 'Welping observation has been recorded successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['welpingObservations', litterId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add observation: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  return {
    welpingLogs,
    observations,
    isLoading: isLoadingLogs || isLoadingObservations,
    isSubmitting,
    error: logsError || observationsError,
    addWelpingLog: (data: Partial<WelpingLog>) => addWelpingLogMutation.mutateAsync(data),
    addObservation: (data: Partial<WelpingObservation>) => addObservationMutation.mutateAsync(data),
    refetch: async () => {
      await Promise.all([refetchLogs(), refetchObservations()]);
    }
  };
};
