
import { useState, useEffect, useCallback } from 'react';
import { HealthRecordType, HealthRecord } from '@/types/health';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing health records
 * @param dogId Dog ID to fetch health records for
 * @returns Health records and management functions
 */
export const useHealthRecords = (dogId: string) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load mock health records
  const loadMockHealthRecords = useCallback(async () => {
    // In a real app, this would fetch from an API
    // For now we'll simulate some mock data
    const mockRecords: HealthRecord[] = [
      {
        id: '1',
        dog_id: dogId,
        record_type: 'VACCINATION' as HealthRecordType,
        title: 'Annual Vaccination',
        date: '2024-04-01',
        visit_date: '2024-04-01',
        record_notes: 'Annual DHPP and Rabies vaccination',
        next_due_date: '2025-04-01',
        performed_by: 'Dr. Smith',
        created_at: '2024-04-01T10:00:00Z',
        updated_at: '2024-04-01T10:00:00Z',
      },
      {
        id: '2',
        dog_id: dogId,
        record_type: 'EXAMINATION' as HealthRecordType,
        title: 'Wellness Check',
        date: '2024-03-15',
        visit_date: '2024-03-15',
        record_notes: 'Regular wellness examination. All vitals normal.',
        performed_by: 'Dr. Johnson',
        created_at: '2024-03-15T14:30:00Z',
      },
      {
        id: '3',
        dog_id: dogId,
        record_type: 'MEDICATION' as HealthRecordType,
        title: 'Heartworm Prevention',
        date: '2024-04-10',
        visit_date: '2024-04-10',
        record_notes: 'Monthly heartworm preventative',
        next_due_date: '2024-05-10',
        created_at: '2024-04-10T09:15:00Z',
      }
    ];
    
    return mockRecords;
  }, [dogId]);

  // Fetch health records
  const fetchHealthRecords = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const records = await loadMockHealthRecords();
      setHealthRecords(records);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch health records'));
    } finally {
      setIsLoading(false);
    }
  }, [dogId, loadMockHealthRecords]);

  // Add health record
  const addHealthRecord = useCallback(async (record: Omit<HealthRecord, 'id'>) => {
    setIsAdding(true);
    
    try {
      const newRecord: HealthRecord = {
        ...record,
        id: uuidv4(),
        dog_id: dogId,
        created_at: new Date().toISOString(),
      };
      
      // In a real app, this would save to an API
      setHealthRecords(prev => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      console.error('Error adding health record:', err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [dogId]);

  // Update health record
  const updateHealthRecord = useCallback(async (updatedRecord: HealthRecord) => {
    setIsUpdating(true);
    
    try {
      // In a real app, this would update via an API
      setHealthRecords(prev => 
        prev.map(record => 
          record.id === updatedRecord.id 
            ? { ...updatedRecord, updated_at: new Date().toISOString() } 
            : record
        )
      );
      return updatedRecord;
    } catch (err) {
      console.error('Error updating health record:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete health record
  const deleteHealthRecord = useCallback(async (recordId: string) => {
    setIsDeleting(true);
    
    try {
      // In a real app, this would delete via an API
      setHealthRecords(prev => prev.filter(record => record.id !== recordId));
      return true;
    } catch (err) {
      console.error('Error deleting health record:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Refresh health records
  const refreshHealthRecords = useCallback(() => {
    fetchHealthRecords();
  }, [fetchHealthRecords]);

  // Initial fetch
  useEffect(() => {
    fetchHealthRecords();
  }, [fetchHealthRecords]);

  return {
    healthRecords,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    fetchHealthRecords,
    refreshHealthRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
  };
};
