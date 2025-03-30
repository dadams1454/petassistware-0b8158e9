import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';
import { 
  getHealthRecords, 
  getHealthRecordsByType,
  addHealthRecord as addRecord, 
  updateHealthRecord as updateRecord, 
  deleteHealthRecord as deleteRecord,
  getUpcomingVaccinations
} from '@/services/healthService';

export const useHealthRecords = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all health records
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

  // Fetch records by type
  const getRecordsByType = (type: HealthRecordTypeEnum) => {
    return healthRecords?.filter(record => record.record_type === type) || [];
  };

  // Add a new health record
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

  // Update an existing health record
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

  // Delete a health record
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

  // Get upcoming vaccinations
  const getUpcomingVaccinationsData = (daysAhead = 30) => {
    if (!healthRecords) return [];
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);
    
    return healthRecords
      .filter(record => 
        record.record_type === HealthRecordTypeEnum.Vaccination && 
        record.next_due_date && 
        new Date(record.next_due_date) >= today &&
        new Date(record.next_due_date) <= futureDate
      )
      .sort((a, b) => 
        new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime()
      );
  };
  
  // Get overdue vaccinations
  const getOverdueVaccinations = () => {
    if (!healthRecords) return [];
    
    const today = new Date();
    return healthRecords
      .filter(record => 
        record.record_type === HealthRecordTypeEnum.Vaccination && 
        record.next_due_date && 
        new Date(record.next_due_date) < today
      )
      .sort((a, b) => 
        new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime()
      );
  };

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
    getRecordsByType,
    getUpcomingVaccinations: getUpcomingVaccinationsData,
    getOverdueVaccinations
  };
};
