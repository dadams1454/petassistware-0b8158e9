
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define a minimal health record type to match what's in the database
interface HealthRecord {
  id: string;
  dog_id: string;
  record_type: string;
  visit_date: string;
  vet_name?: string; // Made this optional to fix error
  record_notes?: string;
  title?: string;
  description?: string;
  next_due_date?: string;
  document_url?: string;
  created_at?: string;
}

export const useDogHealthRecords = (dogId?: string) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (dogId) {
      fetchHealthRecords();
    }
  }, [dogId]);

  const fetchHealthRecords = async () => {
    if (!dogId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .order('visit_date', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const addHealthRecord = async (recordData: Partial<HealthRecord>) => {
    if (!dogId) {
      throw new Error('Dog ID is required');
    }
    
    try {
      // Make sure vet_name is provided for the database
      const dataWithDefaults = {
        ...recordData,
        dog_id: dogId,
        vet_name: recordData.vet_name || 'Unknown', // Set a default value
      };
      
      const { data, error } = await supabase
        .from('health_records')
        .insert(dataWithDefaults);
      
      if (error) throw new Error(error.message);
      
      await fetchHealthRecords();
      return { success: true };
    } catch (err) {
      console.error('Error adding health record:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  };

  const updateHealthRecord = async (id: string, recordData: Partial<HealthRecord>) => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .update(recordData)
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      await fetchHealthRecords();
      return { success: true };
    } catch (err) {
      console.error('Error updating health record:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  };

  const deleteHealthRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      await fetchHealthRecords();
      return { success: true };
    } catch (err) {
      console.error('Error deleting health record:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  };

  return {
    records,
    isLoading,
    error,
    fetchHealthRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
  };
};
