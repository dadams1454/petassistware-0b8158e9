
import { useState, useEffect, useCallback } from 'react';
import { WeightRecord } from '@/types/health-unified';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing dog weight records
 * @param dogId Dog ID to fetch weight records for
 * @returns Weight records and management functions
 */
export const useWeightTracking = (dogId: string) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load mock weight records
  const loadMockWeightRecords = useCallback(async () => {
    // In a real app, this would fetch from an API
    // For now we'll simulate some mock data
    const mockRecords: WeightRecord[] = [
      {
        id: '1',
        dog_id: dogId,
        weight: 68.5,
        weight_unit: 'lb',
        date: '2024-04-01',
        created_at: '2024-04-01T10:00:00Z',
      },
      {
        id: '2',
        dog_id: dogId,
        weight: 67.2,
        weight_unit: 'lb',
        date: '2024-03-01',
        notes: 'Weight stable',
        created_at: '2024-03-01T14:30:00Z',
        percent_change: -1.9,
      },
      {
        id: '3',
        dog_id: dogId,
        weight: 65.8,
        weight_unit: 'lb',
        date: '2024-02-01',
        created_at: '2024-02-01T09:15:00Z',
        percent_change: -2.1,
      }
    ];
    
    return mockRecords;
  }, [dogId]);

  // Fetch weight records
  const fetchWeightRecords = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const records = await loadMockWeightRecords();
      // Sort by date (newest first)
      records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setWeightRecords(records);
    } catch (err) {
      console.error('Error fetching weight records:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch weight records'));
    } finally {
      setIsLoading(false);
    }
  }, [dogId, loadMockWeightRecords]);

  // Add weight record
  const addWeightRecord = useCallback(async (record: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change'>) => {
    setIsAdding(true);
    
    try {
      // Calculate percent change if there are previous records
      let percentChange: number | undefined = undefined;
      
      if (weightRecords.length > 0) {
        const previousWeight = weightRecords[0].weight;
        percentChange = ((record.weight - previousWeight) / previousWeight) * 100;
      }
      
      const newRecord: WeightRecord = {
        ...record,
        id: uuidv4(),
        dog_id: dogId,
        created_at: new Date().toISOString(),
        percent_change: percentChange
      };
      
      // In a real app, this would save to an API
      setWeightRecords(prev => [newRecord, ...prev].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      
      return newRecord;
    } catch (err) {
      console.error('Error adding weight record:', err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [dogId, weightRecords]);

  // Delete weight record
  const deleteWeightRecord = useCallback(async (recordId: string) => {
    setIsDeleting(true);
    
    try {
      // In a real app, this would delete via an API
      setWeightRecords(prev => prev.filter(record => record.id !== recordId));
      return true;
    } catch (err) {
      console.error('Error deleting weight record:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Refresh weight records
  const refreshWeightRecords = useCallback(() => {
    fetchWeightRecords();
  }, [fetchWeightRecords]);

  // Initial fetch
  useEffect(() => {
    fetchWeightRecords();
  }, [fetchWeightRecords]);

  return {
    weightRecords,
    isLoading,
    error,
    isAdding,
    isDeleting,
    fetchWeightRecords,
    refreshWeightRecords,
    addWeightRecord,
    deleteWeightRecord
  };
};
