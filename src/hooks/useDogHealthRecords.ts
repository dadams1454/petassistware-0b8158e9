
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { mapHealthRecordFromDB, mapHealthRecordToDB } from '@/lib/mappers/healthMapper';

export const useDogHealthRecords = (dogId: string) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, [dogId]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId);

      if (error) throw new Error(error.message);
      
      // Map each record using our mapper
      const typedRecords = (data || []).map(record => mapHealthRecordFromDB(record));
      
      setRecords(typedRecords);
      setError(null);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err instanceof Error ? err : new Error('Failed to load health records'));
    } finally {
      setIsLoading(false);
    }
  };

  const addHealthRecord = async (recordData: Omit<HealthRecord, 'id'>) => {
    try {
      const record = {
        ...recordData,
        dog_id: dogId,
        vet_name: recordData.vet_name || 'Unknown', // Required
        record_type: recordData.record_type || HealthRecordTypeEnum.EXAMINATION,
        visit_date: recordData.visit_date || new Date().toISOString().split('T')[0]
      };

      // Convert to DB format
      const dbRecord = mapHealthRecordToDB(record);

      const { data, error } = await supabase
        .from('health_records')
        .insert(dbRecord)
        .select();

      if (error) throw error;

      // Call a function to log the action
      await supabase.rpc('log_audit_event', {
        action: 'INSERT',
        entity_type: 'health_records',
        entity_id: data[0].id,
        new_state: data[0],
        notes: 'Health record added'
      });

      toast({
        title: 'Health record added',
        description: 'The health record has been successfully added.'
      });

      // Refresh records
      fetchRecords();
      return data;
    } catch (err) {
      console.error('Error adding health record:', err);
      toast({
        title: 'Error',
        description: 'Failed to add health record',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateHealthRecord = async (recordId: string, updates: Partial<HealthRecord>) => {
    try {
      // Convert to DB format
      const dbUpdates = mapHealthRecordToDB(updates);

      const { data, error } = await supabase
        .from('health_records')
        .update(dbUpdates)
        .eq('id', recordId)
        .select();

      if (error) throw error;

      toast({
        title: 'Health record updated',
        description: 'The health record has been successfully updated.'
      });

      // Refresh records
      fetchRecords();
      return data;
    } catch (err) {
      console.error('Error updating health record:', err);
      toast({
        title: 'Error',
        description: 'Failed to update health record',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteHealthRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast({
        title: 'Health record deleted',
        description: 'The health record has been successfully deleted.'
      });

      // Refresh records
      fetchRecords();
    } catch (err) {
      console.error('Error deleting health record:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete health record',
        variant: 'destructive'
      });
      throw err;
    }
  };

  return {
    records,
    isLoading,
    error,
    refresh: fetchRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
  };
};
