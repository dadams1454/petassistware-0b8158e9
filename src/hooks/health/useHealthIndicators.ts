
import { useState, useEffect, useCallback } from 'react';
import { HealthIndicator } from '@/types/health-unified';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for managing health indicators
 * @param dogId Dog ID to fetch health indicators for
 * @returns Health indicators and management functions
 */
export const useHealthIndicators = (dogId: string) => {
  const { user } = useAuth();
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load mock health indicators
  const loadMockHealthIndicators = useCallback(async () => {
    // In a real app, this would fetch from an API
    // For now we'll simulate some mock data
    const mockIndicators: HealthIndicator[] = [
      {
        id: '1',
        dog_id: dogId,
        date: '2024-04-15',
        appetite: 'excellent',
        energy: 'normal',
        stool_consistency: 'normal',
        abnormal: false,
        alert_generated: false,
        notes: 'Daily check - everything normal',
        created_at: '2024-04-15T09:00:00Z',
        created_by: user?.id
      },
      {
        id: '2',
        dog_id: dogId,
        date: '2024-04-14',
        appetite: 'good',
        energy: 'low',
        stool_consistency: 'soft',
        abnormal: true,
        alert_generated: true,
        notes: 'Seemed a bit lethargic this morning',
        created_at: '2024-04-14T09:00:00Z',
        created_by: user?.id
      }
    ];
    
    return mockIndicators;
  }, [dogId, user?.id]);
  
  // Fetch health indicators
  const fetchHealthIndicators = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const indicators = await loadMockHealthIndicators();
      setHealthIndicators(indicators);
    } catch (err) {
      console.error('Error fetching health indicators:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch health indicators'));
    } finally {
      setIsLoading(false);
    }
  }, [dogId, loadMockHealthIndicators]);
  
  // Add health indicator
  const addHealthIndicator = useCallback(async (indicator: Omit<HealthIndicator, 'id' | 'created_at' | 'created_by'>) => {
    setIsSubmitting(true);
    
    try {
      const newIndicator: HealthIndicator = {
        ...indicator,
        id: uuidv4(),
        dog_id: dogId,
        created_at: new Date().toISOString(),
        created_by: user?.id,
        date: indicator.date || new Date().toISOString().split('T')[0],
        alert_generated: indicator.abnormal || false
      };
      
      // In a real app, this would save to an API
      setHealthIndicators(prev => [...prev, newIndicator]);
      return newIndicator;
    } catch (err) {
      console.error('Error adding health indicator:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [dogId, user?.id]);
  
  // Delete health indicator
  const deleteHealthIndicator = useCallback(async (indicatorId: string) => {
    try {
      // In a real app, this would delete via an API
      setHealthIndicators(prev => prev.filter(indicator => indicator.id !== indicatorId));
      return true;
    } catch (err) {
      console.error('Error deleting health indicator:', err);
      throw err;
    }
  }, []);
  
  // Refresh health indicators
  const refreshHealthIndicators = useCallback(() => {
    fetchHealthIndicators();
  }, [fetchHealthIndicators]);
  
  // Initial fetch
  useEffect(() => {
    fetchHealthIndicators();
  }, [fetchHealthIndicators]);
  
  return {
    healthIndicators,
    isLoading,
    error,
    isSubmitting,
    fetchHealthIndicators,
    refreshHealthIndicators,
    addHealthIndicator,
    deleteHealthIndicator
  };
};
