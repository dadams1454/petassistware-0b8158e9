
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
}

export const useMedication = (dogId: string) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedications = async () => {
      if (!dogId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('dog_id', dogId)
          .eq('record_type', 'medication')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // Map health records to medication interface
          const mappedMedications: Medication[] = data.map(record => ({
            id: record.id,
            dog_id: record.dog_id || '',
            name: record.medication_name || record.title || 'Unnamed Medication',
            dosage: record.dosage,
            dosage_unit: record.dosage_unit,
            frequency: record.frequency || 'daily',
            administration_route: record.administration_route,
            start_date: record.start_date || record.date || record.created_at,
            end_date: record.end_date,
            notes: record.notes || record.description,
            active: record.end_date ? new Date(record.end_date) > new Date() : true,
            created_at: record.created_at
          }));
          
          setMedications(mappedMedications);
        }
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError(err instanceof Error ? err : new Error('Failed to load medications'));
        
        toast({
          title: 'Error loading medications',
          description: 'There was a problem fetching medication data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, [dogId, toast]);
  
  const addMedication = async (medication: Omit<Medication, 'id' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create health record for the medication
      const healthRecord = {
        dog_id: medication.dog_id,
        record_type: 'medication',
        title: medication.name,
        medication_name: medication.name,
        dosage: medication.dosage,
        dosage_unit: medication.dosage_unit,
        frequency: medication.frequency,
        administration_route: medication.administration_route,
        start_date: medication.start_date,
        end_date: medication.end_date,
        notes: medication.notes
      };
      
      const { data, error } = await supabase
        .from('health_records')
        .insert(healthRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newMedication: Medication = {
          id: data.id,
          dog_id: data.dog_id || medication.dog_id,
          name: data.medication_name || data.title || medication.name,
          dosage: data.dosage,
          dosage_unit: data.dosage_unit,
          frequency: data.frequency || medication.frequency,
          administration_route: data.administration_route,
          start_date: data.start_date || data.date || data.created_at,
          end_date: data.end_date,
          notes: data.notes || data.description,
          active: data.end_date ? new Date(data.end_date) > new Date() : true,
          created_at: data.created_at
        };
        
        setMedications(prev => [newMedication, ...prev]);
        
        toast({
          title: 'Medication added',
          description: `${medication.name} has been added successfully.`,
        });
        
        return newMedication;
      }
    } catch (err) {
      console.error('Error adding medication:', err);
      setError(err instanceof Error ? err : new Error('Failed to add medication'));
      
      toast({
        title: 'Error adding medication',
        description: 'There was a problem saving the medication.',
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Map medication updates to health record fields
      const healthRecordUpdates = {
        ...(updates.name && { medication_name: updates.name, title: updates.name }),
        ...(updates.dosage !== undefined && { dosage: updates.dosage }),
        ...(updates.dosage_unit && { dosage_unit: updates.dosage_unit }),
        ...(updates.frequency && { frequency: updates.frequency }),
        ...(updates.administration_route && { administration_route: updates.administration_route }),
        ...(updates.start_date && { start_date: updates.start_date }),
        ...(updates.end_date && { end_date: updates.end_date }),
        ...(updates.notes && { notes: updates.notes })
      };
      
      const { data, error } = await supabase
        .from('health_records')
        .update(healthRecordUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Update the medication in state
        setMedications(prev => 
          prev.map(med => 
            med.id === id 
              ? {
                  ...med,
                  ...updates,
                  active: updates.end_date 
                    ? new Date(updates.end_date) > new Date()
                    : med.end_date
                    ? new Date(med.end_date) > new Date()
                    : true
                }
              : med
          )
        );
        
        toast({
          title: 'Medication updated',
          description: `The medication has been updated successfully.`,
        });
      }
    } catch (err) {
      console.error('Error updating medication:', err);
      setError(err instanceof Error ? err : new Error('Failed to update medication'));
      
      toast({
        title: 'Error updating medication',
        description: 'There was a problem updating the medication.',
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    medications,
    isLoading,
    error,
    addMedication,
    updateMedication
  };
};
