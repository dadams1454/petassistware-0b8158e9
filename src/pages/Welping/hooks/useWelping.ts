
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getLitterById } from '@/services/litterService';
import { createLitter } from '@/services/litterService';
import { 
  WelpingRecord, 
  WelpingObservation,
  addWelpingObservation, 
  getWelpingRecordForLitter, 
  getWelpingObservations
} from '@/services/welpingService';
import { Litter, Puppy } from '@/types/litter';

export interface WelpingLogEntry {
  id: string;
  timestamp: string;
  event_type: 'start' | 'contraction' | 'puppy_born' | 'end' | 'note';
  notes?: string;
  puppy_id?: string;
  puppy_details?: {
    gender?: 'Male' | 'Female';
    color?: string;
    weight?: string;
    birth_order?: number;
  }
}

// Interface for creating a new welping session
export interface CreateWelpingParams {
  damId: string;
  sireId: string;
  birthDate: Date;
  litterName?: string;
  totalPuppies?: number;
  males?: number;
  females?: number;
  attendedBy?: string;
}

export const useWelping = (litterId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Fetch litter details
  const { 
    data: litter, 
    isLoading: isLoadingLitter, 
    error: litterError,
    refetch: refetchLitter
  } = useQuery({
    queryKey: ['welping-litter', litterId],
    queryFn: async () => {
      if (!litterId) return null;
      
      const result = await getLitterById(litterId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!litterId
  });
  
  // Fetch welping logs
  const {
    data: welpingLogs,
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['welping-logs', litterId],
    queryFn: async () => {
      if (!litterId) return [];
      
      // In a real implementation, this would fetch logs from the database
      // For now, we'll return a mock list
      const observations = await getWelpingObservations(litterId);
      
      // Map observations to a standardized log entry format
      return observations.map(obs => ({
        id: obs.id,
        timestamp: obs.observation_time,
        event_type: 'note',
        notes: obs.notes,
        puppy_id: obs.puppy_id
      })) as WelpingLogEntry[];
    },
    enabled: !!litterId
  });

  // Create a new welping record
  const createWelping = async (params: CreateWelpingParams) => {
    try {
      setIsCreating(true);
      
      // 1. Create the litter first
      const litterResult = await createLitter({
        damId: params.damId,
        sireId: params.sireId,
        birthDate: params.birthDate,
        litterName: params.litterName
      });
      
      if (!litterResult.success || !litterResult.litterId) {
        throw new Error(litterResult.error || 'Failed to create litter');
      }
      
      const litterId = litterResult.litterId;
      
      // 2. Create the welping record
      const welpingRecordData = {
        litter_id: litterId,
        birth_date: params.birthDate.toISOString().split('T')[0],
        total_puppies: params.totalPuppies || 0,
        males: params.males || 0,
        females: params.females || 0,
        attended_by: params.attendedBy,
        status: 'in-progress'
      };
      
      // Insert the welping record
      const { data, error } = await supabase
        .from('welping_records')
        .insert(welpingRecordData)
        .select();
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        litterId,
        welpingRecordId: data?.[0]?.id
      };
    } catch (error: any) {
      console.error('Error creating welping record:', error);
      return { success: false, error: error.message };
    } finally {
      setIsCreating(false);
    }
  };

  // Update litter
  const updateLitter = async (updates: Partial<Litter>) => {
    try {
      setIsSubmitting(true);
      
      if (!litterId) {
        throw new Error('Litter ID is required');
      }
      
      // Update the litter in the database
      const { data, error } = await supabase
        .from('litters')
        .update(updates)
        .eq('id', litterId)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Refetch the litter details
      await refetchLitter();
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating litter:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add welping log
  const addWelpingLog = async (logEntry: Omit<WelpingLogEntry, 'id'>) => {
    try {
      setIsSubmitting(true);
      
      if (!litterId) {
        throw new Error('Litter ID is required');
      }
      
      // Convert to observation format
      const observation: Omit<WelpingObservation, 'id' | 'created_at'> = {
        welping_id: litterId,
        observation_time: logEntry.timestamp,
        puppy_id: logEntry.puppy_id,
        notes: logEntry.notes,
        // Map event_type to something that makes sense for the WelpingObservation
        observation_type: logEntry.event_type,
        // Additional fields
        puppy_number: logEntry.puppy_details?.birth_order,
        presentation: logEntry.event_type === 'puppy_born' ? 'normal' : undefined,
        weight: logEntry.puppy_details?.weight ? parseFloat(logEntry.puppy_details.weight) : undefined,
        weight_unit: 'oz'
      };
      
      // Add the observation
      const result = await addWelpingObservation(observation);
      
      // Refetch the logs
      await refetchLogs();
      
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error adding welping log:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    litter,
    isLoading: isLoadingLitter || isSubmitting,
    isCreating,
    error: litterError,
    welpingLogs,
    isLoadingLogs,
    refetchLitter,
    refetchLogs,
    createWelping,
    updateWelping: updateLitter,
    addWelpingLog
  };
};
