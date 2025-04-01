
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord } from '@/types/health';

export const useDogHealthRecords = (dogId: string) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHealthRecords = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('visit_date', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addHealthRecord = async (recordData: Partial<HealthRecord>) => {
    try {
      // Ensure dog_id is set
      const dataWithDogId = {
        ...recordData,
        dog_id: dogId,
        // Ensure visit_date is set if not provided
        visit_date: recordData.visit_date || new Date().toISOString().split('T')[0]
      };
      
      const { data, error: insertError } = await supabase
        .from('health_records')
        .insert(dataWithDogId);
        
      if (insertError) throw insertError;
      
      // Refresh records after adding
      await fetchHealthRecords();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error adding health record:', err);
      throw err;
    }
  };

  const updateHealthRecord = async (id: string, recordData: Partial<HealthRecord>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('health_records')
        .update(recordData)
        .eq('id', id)
        .eq('dog_id', dogId);
        
      if (updateError) throw updateError;
      
      // Refresh records after updating
      await fetchHealthRecords();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating health record:', err);
      throw err;
    }
  };

  const deleteHealthRecord = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id)
        .eq('dog_id', dogId);
        
      if (deleteError) throw deleteError;
      
      // Refresh records after deleting
      await fetchHealthRecords();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting health record:', err);
      throw err;
    }
  };

  // Fetch records when the hook is initialized
  useState(() => {
    if (dogId) {
      fetchHealthRecords();
    }
  });

  return {
    records,
    healthRecords: records, // Alias for compatibility
    isLoading,
    error,
    fetchHealthRecords,
    refresh: fetchHealthRecords, // Alias for compatibility
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
  };
};
