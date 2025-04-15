
import { useState, useEffect, useCallback } from 'react';
import { Medication } from '@/types/health-unified';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing medications
 * @param dogId Dog ID to fetch medications for
 * @returns Medications and management functions
 */
export const useMedications = (dogId: string) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load mock medications
  const loadMockMedications = useCallback(async () => {
    // In a real app, this would fetch from an API
    // For now we'll simulate some mock data
    const mockMedications: Medication[] = [
      {
        id: '1',
        dog_id: dogId,
        name: 'Heartgard Plus',
        medication_name: 'Heartgard Plus',
        dosage: 1,
        dosage_unit: 'tablet',
        frequency: 'monthly',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        notes: 'Administer on the 1st of each month',
        created_at: '2024-01-01T00:00:00Z',
        last_administered: '2024-04-01T00:00:00Z',
        status: 'active',
        is_active: true
      },
      {
        id: '2',
        dog_id: dogId,
        name: 'Apoquel',
        medication_name: 'Apoquel',
        dosage: 5.4,
        dosage_unit: 'mg',
        frequency: 'twice daily',
        start_date: '2024-04-01',
        end_date: '2024-04-14',
        notes: 'For seasonal allergies',
        created_at: '2024-04-01T00:00:00Z',
        last_administered: '2024-04-15T08:00:00Z',
        status: 'completed',
        is_active: false
      }
    ];
    
    return mockMedications;
  }, [dogId]);

  // Fetch medications
  const fetchMedications = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const meds = await loadMockMedications();
      setMedications(meds);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch medications'));
    } finally {
      setIsLoading(false);
    }
  }, [dogId, loadMockMedications]);

  // Add medication
  const addMedication = useCallback(async (medication: Omit<Medication, 'id'>) => {
    setIsAdding(true);
    
    try {
      const newMedication: Medication = {
        ...medication,
        id: uuidv4(),
        dog_id: dogId,
        created_at: new Date().toISOString(),
        status: medication.status || 'active',
        is_active: medication.is_active !== undefined ? medication.is_active : true
      };
      
      // In a real app, this would save to an API
      setMedications(prev => [...prev, newMedication]);
      return newMedication;
    } catch (err) {
      console.error('Error adding medication:', err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [dogId]);

  // Update medication
  const updateMedication = useCallback(async (updatedMedication: Medication) => {
    setIsUpdating(true);
    
    try {
      // In a real app, this would update via an API
      setMedications(prev => 
        prev.map(med => 
          med.id === updatedMedication.id ? updatedMedication : med
        )
      );
      return updatedMedication;
    } catch (err) {
      console.error('Error updating medication:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete medication
  const deleteMedication = useCallback(async (medicationId: string) => {
    setIsDeleting(true);
    
    try {
      // In a real app, this would delete via an API
      setMedications(prev => prev.filter(med => med.id !== medicationId));
      return true;
    } catch (err) {
      console.error('Error deleting medication:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Record administration
  const recordAdministration = useCallback(async (medicationId: string) => {
    try {
      const now = new Date();
      
      setMedications(prev => 
        prev.map(med => 
          med.id === medicationId 
            ? { ...med, last_administered: now.toISOString() } 
            : med
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error recording administration:', err);
      throw err;
    }
  }, []);

  // Refresh medications
  const refreshMedications = useCallback(() => {
    fetchMedications();
  }, [fetchMedications]);

  // Initial fetch
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return {
    medications,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    fetchMedications,
    refreshMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    recordAdministration
  };
};
