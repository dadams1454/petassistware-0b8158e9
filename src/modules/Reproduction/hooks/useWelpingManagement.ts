
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Litter } from '@/types/litter';
import { Dog } from '@/types/dog';
import { format, addDays } from 'date-fns';

// Define the WelpingRecord type
export interface WelpingRecord {
  id: string;
  litter_id: string;
  recording_date: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  total_puppies_born: number;
  live_puppies_born: number;
  stillborn_puppies: number;
  dam_condition: string;
  complications?: string;
  assistance_required: boolean;
  assistance_details?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  birth_date?: string;
  total_puppies?: number;
  males?: number;
  females?: number;
  attended_by?: string;
  complication_notes?: string;
  status?: string;
}

// Define the WelpingLogEntry type
export interface WelpingLogEntry {
  id: string;
  litter_id: string;
  timestamp: string;
  event_type: 'start' | 'contraction' | 'puppy_born' | 'note' | 'end';
  puppy_id?: string;
  notes?: string;
  puppy_details?: {
    gender?: string;
    color?: string;
    weight?: number;
  };
}

export const useWelpingManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Query to fetch active pregnancies
  const {
    data: pregnantDogs = [],
    isLoading: isLoadingPregnancies,
    refetch: refetchPregnantDogs
  } = useQuery({
    queryKey: ['pregnant-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url, gender, is_pregnant, last_heat_date, tie_date, breed, color')
        .eq('gender', 'Female')
        .eq('is_pregnant', true);
        
      if (error) throw error;
      return data as Dog[];
    }
  });

  // Query to fetch active litters (recent births)
  const {
    data: activeLitters = [],
    isLoading: isLoadingLitters,
    refetch: refetchActiveLitters
  } = useQuery({
    queryKey: ['active-litters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*),
          puppies:puppies(count)
        `)
        .eq('status', 'active')
        .order('birth_date', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch litter details by ID
  const fetchLitterById = async (litterId: string) => {
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
    return data;
  };

  // Fetch welping logs for a litter
  const fetchWelpingLogs = async (litterId: string) => {
    if (!litterId) return [];

    const { data, error } = await supabase
      .from('welping_logs')
      .select('*')
      .eq('litter_id', litterId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data as WelpingLogEntry[];
  };

  // Add a welping log entry
  const addWelpingLog = useMutation({
    mutationFn: async (logEntry: Omit<WelpingLogEntry, 'id'>) => {
      const { data, error } = await supabase
        .from('welping_logs')
        .insert(logEntry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Log entry added',
        description: 'Welping log entry has been recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['welpingLogs', variables.litter_id] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to add log entry: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Create a new welping record
  const createWelpingRecord = useMutation({
    mutationFn: async (data: {
      litterId: string;
      date: string;
      startTime: string;
      totalPuppies: number;
      males: number;
      females: number;
      attendedBy?: string;
      notes?: string;
    }) => {
      const welpingData = {
        litter_id: data.litterId,
        birth_date: data.date,
        start_time: data.startTime,
        total_puppies: data.totalPuppies,
        males: data.males,
        females: data.females,
        attended_by: data.attendedBy,
        notes: data.notes,
        status: 'in-progress'
      };

      const { data: result, error } = await supabase
        .from('welping_records')
        .insert(welpingData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Welping record created',
        description: 'Welping record has been successfully created',
      });
      queryClient.invalidateQueries({ queryKey: ['litter', variables.litterId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create welping record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Complete a welping session
  const completeWelping = useMutation({
    mutationFn: async ({ 
      recordId, 
      endTime, 
      puppiesBorn, 
      puppiesAlive, 
      notes 
    }: { 
      recordId: string; 
      endTime: string; 
      puppiesBorn: number; 
      puppiesAlive: number; 
      notes?: string; 
    }) => {
      const { error } = await supabase
        .from('welping_records')
        .update({
          end_time: endTime,
          total_puppies_born: puppiesBorn,
          live_puppies_born: puppiesAlive,
          stillborn_puppies: puppiesBorn - puppiesAlive,
          notes: notes,
          status: 'completed'
        })
        .eq('id', recordId);
      
      if (error) throw error;
      return { recordId };
    },
    onSuccess: () => {
      toast({
        title: 'Welping completed',
        description: 'Welping session has been marked as complete',
      });
      queryClient.invalidateQueries({ queryKey: ['active-litters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to complete welping: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Create a new litter
  const createLitter = useMutation({
    mutationFn: async (data: {
      damId: string;
      sireId?: string;
      birthDate: Date;
      litterName?: string;
    }) => {
      setIsCreating(true);
      
      try {
        // Format date for database
        const formattedDate = format(data.birthDate, 'yyyy-MM-dd');
        
        // Generate default litter name if not provided
        let finalLitterName = data.litterName;
        
        if (!finalLitterName) {
          // Get dam and sire names for fallback name
          const { data: damData } = await supabase
            .from('dogs')
            .select('name')
            .eq('id', data.damId)
            .single();
            
          let sireName = 'Unknown Sire';
          if (data.sireId) {
            const { data: sireData } = await supabase
              .from('dogs')
              .select('name')
              .eq('id', data.sireId)
              .single();
            sireName = sireData?.name || 'Unknown Sire';
          }
          
          const damName = damData?.name || 'Unknown Dam';
          finalLitterName = `${damName} x ${sireName} - ${formattedDate}`;
        }
        
        // Prepare litter data
        const litterData = {
          dam_id: data.damId,
          sire_id: data.sireId || null,
          birth_date: formattedDate,
          litter_name: finalLitterName,
          status: 'active'
        };
        
        const { data: result, error } = await supabase
          .from('litters')
          .insert(litterData)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update the dam's pregnancy status
        await supabase
          .from('dogs')
          .update({ is_pregnant: false })
          .eq('id', data.damId);
        
        return result;
      } finally {
        setIsCreating(false);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Litter created',
        description: 'New litter has been successfully created',
      });
      queryClient.invalidateQueries({ queryKey: ['active-litters'] });
      queryClient.invalidateQueries({ queryKey: ['pregnant-dogs'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create litter: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Count active whelping sessions
  const activeWelpingsCount = activeLitters.filter(litter => 
    litter.birth_date && new Date(litter.birth_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Calculate total puppies across active litters
  const totalPuppiesCount = activeLitters.reduce((total, litter) => {
    let puppyCount = 0;
    if (typeof litter.puppies === 'number') {
      puppyCount = litter.puppies;
    } else if (Array.isArray(litter.puppies)) {
      puppyCount = litter.puppies.length;
    } else if (litter.puppies && typeof litter.puppies === 'object' && 'count' in litter.puppies) {
      puppyCount = litter.puppies.count as number;
    }
    return total + puppyCount;
  }, 0);

  return {
    pregnantDogs,
    activeLitters,
    activeWelpingsCount,
    totalPuppiesCount,
    pregnantCount: pregnantDogs.length,
    isLoading: isLoadingPregnancies || isLoadingLitters,
    refetchPregnantDogs,
    refetchActiveLitters,
    fetchLitterById,
    fetchWelpingLogs,
    addWelpingLog: addWelpingLog.mutateAsync,
    createWelpingRecord: createWelpingRecord.mutateAsync,
    completeWelping: completeWelping.mutateAsync,
    createLitter: createLitter.mutateAsync,
    isAddingLog: addWelpingLog.isPending,
    isCreatingRecord: createWelpingRecord.isPending,
    isCompletingWelping: completeWelping.isPending,
    isCreatingLitter: isCreating
  };
};
