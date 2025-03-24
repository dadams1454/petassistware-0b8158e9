
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord } from '@/types/dog';
import { 
  getHealthRecords, 
  addHealthRecord as addRecord, 
  updateHealthRecord as updateRecord, 
  deleteHealthRecord as deleteRecord
} from '@/services/healthService';

export const useHealthRecords = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    data: healthRecords, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['healthRecords', dogId],
    queryFn: () => getHealthRecords(dogId),
    enabled: !!dogId,
  });

  const addHealthRecord = useMutation({
    mutationFn: (record: Omit<HealthRecord, 'id' | 'created_at'>) => 
      addRecord(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      toast({
        title: 'Health record added',
        description: 'The health record has been successfully added',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add health record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateHealthRecord = useMutation({
    mutationFn: ({ id, ...updates }: { id: string; [key: string]: any }) => 
      updateRecord(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      toast({
        title: 'Health record updated',
        description: 'The health record has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update health record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteHealthRecord = useMutation({
    mutationFn: (id: string) => deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      toast({
        title: 'Health record deleted',
        description: 'The health record has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete health record',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    healthRecords,
    isLoading,
    error,
    refetch,
    addHealthRecord: addHealthRecord.mutate,
    updateHealthRecord: updateHealthRecord.mutate,
    deleteHealthRecord: deleteHealthRecord.mutate,
    isAdding: addHealthRecord.isPending,
    isUpdating: updateHealthRecord.isPending,
    isDeleting: deleteHealthRecord.isPending,
  };
};
