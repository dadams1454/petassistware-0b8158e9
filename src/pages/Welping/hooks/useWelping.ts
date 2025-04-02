
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Litter, Puppy, WelpingRecord, WelpingObservation } from '../types';
import { getLitterById, createLitter, updateLitter } from '@/services/litterService';
import { 
  getWelpingRecordsForLitter, 
  getWelpingObservations, 
  addWelpingObservation,
  createWelpingRecord,
  updateWelpingRecord,
  addPostpartumCare,
  getPostpartumCareRecords,
  updatePuppy
} from '@/services/welpingService';

export const useWelping = (litterId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch litter details
  const {
    data: litter,
    isLoading: isLitterLoading,
    error: litterError,
    refetch: refetchLitter
  } = useQuery({
    queryKey: ['whelping-litter', litterId],
    queryFn: async () => {
      if (!litterId) return null;
      
      const result = await getLitterById(litterId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!litterId
  });
  
  // Fetch welping records for the litter
  const {
    data: welpingRecords,
    isLoading: isRecordsLoading,
    error: recordsError,
    refetch: refetchRecords
  } = useQuery({
    queryKey: ['welping-records', litterId],
    queryFn: async () => {
      if (!litterId) return null;
      return getWelpingRecordsForLitter(litterId);
    },
    enabled: !!litterId
  });
  
  // Fetch welping observations
  const {
    data: welpingLogs,
    isLoading: isLogsLoading,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['welping-observations', litterId],
    queryFn: async () => {
      if (!litterId || !welpingRecords || welpingRecords.length === 0) return [];
      return getWelpingObservations(welpingRecords[0].id);
    },
    enabled: !!litterId && !!welpingRecords && welpingRecords.length > 0
  });
  
  // Fetch postpartum care records
  const {
    data: postpartumCare,
    isLoading: isCareLoading,
    error: careError,
    refetch: refetchCare
  } = useQuery({
    queryKey: ['welping-postpartum', litterId],
    queryFn: async () => {
      if (!litterId) return [];
      return getPostpartumCareRecords(litterId);
    },
    enabled: !!litterId
  });
  
  // Create a new welping record
  const createWelpingMutation = useMutation({
    mutationFn: async (data: any) => {
      // First create the litter
      const litterResult = await createLitter({
        damId: data.damId,
        sireId: data.sireId,
        birthDate: new Date(data.birthDate),
        litterName: data.litterName
      });
      
      if (!litterResult.success || !litterResult.litterId) {
        throw new Error(litterResult.error || 'Failed to create litter');
      }
      
      // Then create the welping record
      const welpingResult = await createWelpingRecord(litterResult.litterId, {
        birth_date: data.birthDate,
        total_puppies: data.totalPuppies || 0,
        males: data.males || 0,
        females: data.females || 0,
        attended_by: data.attendedBy,
        complication_notes: data.complicationNotes,
        start_time: data.startTime,
        end_time: data.endTime,
        status: 'in-progress'
      });
      
      return {
        litterId: litterResult.litterId,
        welpingRecord: welpingResult
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Welping record created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['welping-dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create welping record: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update welping record
  const updateWelpingMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!litterId) throw new Error('Litter ID is required');
      
      // Update litter details
      const litterUpdate = {
        ...(data.litterName && { litter_name: data.litterName }),
        ...(data.birthDate && { birth_date: data.birthDate }),
        ...(data.damId && { dam_id: data.damId }),
        ...(data.sireId && { sire_id: data.sireId }),
        ...(data.status && { status: data.status }),
        ...(data.expectedGoHomeDate && { expected_go_home_date: data.expectedGoHomeDate }),
        ...(data.notes && { notes: data.notes })
      };
      
      // Only update if there are changes
      if (Object.keys(litterUpdate).length > 0) {
        const litterResult = await updateLitter(litterId, litterUpdate);
        if (!litterResult.success) {
          throw new Error(litterResult.error || 'Failed to update litter');
        }
      }
      
      // Update welping record if it exists
      if (welpingRecords && welpingRecords.length > 0 && 
          (data.totalPuppies !== undefined || data.males !== undefined || 
           data.females !== undefined || data.attendedBy || data.complicationNotes)) {
        const welpingUpdate = {
          ...(data.totalPuppies !== undefined && { total_puppies: data.totalPuppies }),
          ...(data.males !== undefined && { males: data.males }),
          ...(data.females !== undefined && { females: data.females }),
          ...(data.attendedBy && { attended_by: data.attendedBy }),
          ...(data.complicationNotes && { complication_notes: data.complicationNotes }),
          ...(data.status && { status: data.status })
        };
        
        if (Object.keys(welpingUpdate).length > 0) {
          await updateWelpingRecord(welpingRecords[0].id, welpingUpdate);
        }
      }
      
      return litterId;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Welping record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['whelping-litter', litterId] });
      queryClient.invalidateQueries({ queryKey: ['welping-records', litterId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update welping record: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Add welping observation/log
  const addWelpingLogMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!litterId || !welpingRecords || welpingRecords.length === 0) {
        throw new Error('Welping record is required');
      }
      
      return addWelpingObservation({
        welping_id: welpingRecords[0].id,
        observation_time: data.time,
        observation_type: data.type,
        description: data.description,
        puppy_id: data.puppyId,
        action_taken: data.action
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Welping log added successfully",
      });
      refetchLogs();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to add welping log: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Add postpartum care record
  const addPostpartumCareMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!litterId) throw new Error('Litter ID is required');
      
      return addPostpartumCare({
        litter_id: litterId,
        puppy_id: data.puppyId,
        date: data.date,
        care_type: data.careType,
        care_time: data.careTime,
        performed_by: data.performedBy,
        notes: data.notes,
        ...data.careDetails
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Care record added successfully",
      });
      refetchCare();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to add care record: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update puppy
  const updatePuppyMutation = useMutation({
    mutationFn: async (data: { puppyId: string, updates: Partial<Puppy> }) => {
      return updatePuppy(data.puppyId, data.updates);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Puppy details updated successfully",
      });
      refetchLitter();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update puppy: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  return {
    litter,
    welpingRecords,
    welpingLogs,
    postpartumCare,
    isLoading: isLitterLoading || isRecordsLoading || isLogsLoading || isCareLoading,
    error: litterError || recordsError || logsError || careError,
    refetchLitter,
    refetchRecords,
    refetchLogs,
    refetchCare,
    
    // Mutations
    createWelping: createWelpingMutation.mutateAsync,
    updateWelping: updateWelpingMutation.mutateAsync,
    addWelpingLog: addWelpingLogMutation.mutateAsync,
    addPostpartumCare: addPostpartumCareMutation.mutateAsync,
    updatePuppy: updatePuppyMutation.mutateAsync,
    
    // Status
    isCreating: createWelpingMutation.isPending,
    isUpdating: updateWelpingMutation.isPending,
    isAddingLog: addWelpingLogMutation.isPending,
    isAddingCare: addPostpartumCareMutation.isPending,
    isUpdatingPuppy: updatePuppyMutation.isPending
  };
};
