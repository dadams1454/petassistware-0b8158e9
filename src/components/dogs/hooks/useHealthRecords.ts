
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HealthRecord, HealthRecordTypeEnum } from '@/types';
import { 
  getHealthRecords, 
  getHealthRecord, 
  addHealthRecord, 
  updateHealthRecord, 
  deleteHealthRecord, 
  getUpcomingVaccinations
} from '@/services/healthService';
import { useToast } from '@/hooks/use-toast';

export const useHealthRecords = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [recordTypeFilter, setRecordTypeFilter] = useState<HealthRecordTypeEnum | null>(null);

  // Fetch all health records
  const {
    data: healthRecords = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['healthRecords', dogId, recordTypeFilter],
    queryFn: () => getHealthRecords(dogId, recordTypeFilter || undefined),
    enabled: !!dogId
  });

  // Fetch a single health record by ID
  const {
    data: selectedRecord,
    isLoading: isLoadingRecord,
    refetch: refetchRecord
  } = useQuery({
    queryKey: ['healthRecord', selectedRecordId],
    queryFn: () => getHealthRecord(selectedRecordId!),
    enabled: !!selectedRecordId,
  });

  // Fetch upcoming vaccinations
  const {
    data: upcomingVaccinations = []
  } = useQuery({
    queryKey: ['upcomingVaccinations', dogId],
    queryFn: () => getUpcomingVaccinations(dogId),
    enabled: !!dogId
  });

  // Add a new health record
  const addRecord = useMutation({
    mutationFn: (record: Partial<HealthRecord>) => {
      return addHealthRecord({
        ...record,
        dog_id: dogId
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record added successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add health record: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });

  // Update a health record
  const updateRecord = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HealthRecord> }) => {
      return updateHealthRecord(id, data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record updated successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      queryClient.invalidateQueries({ queryKey: ['healthRecord', selectedRecordId] });
      setIsEditDialogOpen(false);
      setSelectedRecordId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update health record: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });

  // Delete a health record
  const deleteRecord = useMutation({
    mutationFn: (id: string) => {
      return deleteHealthRecord(id);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Health record deleted successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['healthRecords', dogId] });
      setIsEditDialogOpen(false);
      setSelectedRecordId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete health record: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });

  // Helper to filter health records by type
  const getRecordsByType = (type: HealthRecordTypeEnum): HealthRecord[] => {
    return healthRecords.filter(record => 
      record.record_type === type || 
      (typeof record.record_type === 'string' && stringToHealthRecordType(record.record_type) === type)
    );
  };

  // Handle opening the add dialog
  const handleAddRecord = (recordType?: HealthRecordTypeEnum) => {
    setIsAddDialogOpen(true);
  };

  // Handle opening the edit dialog
  const handleEditRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setIsEditDialogOpen(true);
  };

  return {
    dogId,
    healthRecords,
    selectedRecord,
    isLoading,
    isLoadingRecord,
    isError,
    error,
    refetch,
    refetchRecord,
    isAddDialogOpen,
    isEditDialogOpen,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    addRecord: addRecord.mutateAsync,
    updateRecord: updateRecord.mutateAsync,
    deleteRecord: deleteRecord.mutateAsync,
    handleAddRecord,
    handleEditRecord,
    recordTypeFilter,
    setRecordTypeFilter,
    getRecordsByType,
    upcomingVaccinations
  };
};
