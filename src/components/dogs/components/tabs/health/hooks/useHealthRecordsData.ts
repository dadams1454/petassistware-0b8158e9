
import { useEffect } from 'react';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useToast } from '@/hooks/use-toast';
import { HealthRecordType } from '@/types/health';

export const useHealthRecordsData = (dogId: string) => {
  const { healthRecords, isLoading, error, refreshHealthRecords } = useHealthRecords(dogId);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching health records',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Filter records by type for different tabs
  const vaccinationRecords = healthRecords.filter(
    record => record.record_type === HealthRecordType.VACCINATION
  );
  
  const examinationRecords = healthRecords.filter(
    record => record.record_type === HealthRecordType.EXAMINATION
  );
  
  const medicationRecords = healthRecords.filter(
    record => record.record_type === HealthRecordType.MEDICATION
  );

  return {
    healthRecords,
    vaccinationRecords,
    examinationRecords,
    medicationRecords,
    isLoading,
    error,
    refreshHealthRecords
  };
};
