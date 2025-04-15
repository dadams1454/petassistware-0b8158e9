
import { useState, useEffect } from 'react';
import { 
  AppetiteEnum, 
  EnergyEnum, 
  StoolConsistencyEnum,
  type AppetiteLevel,
  type EnergyLevel,
  type StoolConsistency 
} from '@/types/health-enums';

export interface HealthIndicator {
  id: string;
  dog_id: string;
  date: Date | string;
  temperature?: number;
  heart_rate?: number;
  respiration_rate?: number;
  weight?: number;
  weight_unit?: string;
  appetite?: AppetiteLevel;
  energy_level?: EnergyLevel;
  stool_consistency?: StoolConsistency;
  abnormal: boolean;
  alert_generated: boolean;
  alert_resolved?: boolean;
  alert_resolved_by?: string;
  alert_resolution_date?: Date | string;
  notes?: string;
  created_at: Date | string;
  updated_at?: Date | string;
}

export interface HealthAlert {
  id: string;
  indicator_id: string;
  dog_id: string;
  date: Date | string;
  resolved: boolean;
  resolved_by?: string;
  resolution_date?: Date | string;
  notes?: string;
}

export function useHealthIndicators(dogId: string) {
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data function
  const generateMockIndicators = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `indicator-${i + 1}`,
      dog_id: dogId,
      date: new Date(Date.now() - i * 86400000), // days ago
      temperature: 101 + Math.random(),
      heart_rate: 60 + Math.floor(Math.random() * 40),
      respiration_rate: 15 + Math.floor(Math.random() * 10),
      appetite: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as AppetiteLevel,
      energy_level: ['hyperactive', 'high', 'normal', 'low'][Math.floor(Math.random() * 4)] as EnergyLevel,
      stool_consistency: ['normal', 'soft', 'loose', 'hard'][Math.floor(Math.random() * 4)] as StoolConsistency,
      abnormal: i === 0 || i === 3,
      alert_generated: i === 0 || i === 3,
      alert_resolved: i === 3,
      notes: i === 0 ? 'Recent changes in behavior, monitor closely' : i === 3 ? 'Previous issue has been resolved' : '',
      created_at: new Date(Date.now() - i * 86400000)
    }));
  };
  
  // Fetch health indicators for the dog
  useEffect(() => {
    if (!dogId) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const mockData = generateMockIndicators();
        setHealthIndicators(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch health indicators'));
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, [dogId]);
  
  // Add health indicator
  const addHealthIndicator = async (data: Omit<HealthIndicator, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newIndicator: HealthIndicator = {
        ...data,
        id: `indicator-${Date.now()}`,
        created_at: new Date(),
      };
      
      setHealthIndicators(prev => [newIndicator, ...prev]);
      return newIndicator;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add health indicator');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update health indicator
  const updateHealthIndicator = async (id: string, data: Partial<HealthIndicator>) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHealthIndicators(prev => 
        prev.map(indicator => 
          indicator.id === id 
            ? { ...indicator, ...data, updated_at: new Date() } 
            : indicator
        )
      );
      
      return true;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update health indicator');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete health indicator
  const deleteHealthIndicator = async (id: string) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHealthIndicators(prev => prev.filter(indicator => indicator.id !== id));
      return true;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete health indicator');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Resolve health alert
  const resolveAlert = async (id: string, notes?: string) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHealthIndicators(prev => 
        prev.map(indicator => 
          indicator.id === id 
            ? { 
                ...indicator, 
                alert_resolved: true,
                alert_resolved_by: 'current_user', 
                alert_resolution_date: new Date(),
                notes: notes ? `${indicator.notes || ''}\n\nResolution: ${notes}` : indicator.notes
              } 
            : indicator
        )
      );
      
      return true;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to resolve alert');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper functions for displaying enum values
  const getAppetiteLevelLabel = (level?: AppetiteLevel) => {
    if (!level) return 'Unknown';
    
    switch (level) {
      case AppetiteEnum.EXCELLENT: return 'Excellent';
      case AppetiteEnum.GOOD: return 'Good';
      case AppetiteEnum.FAIR: return 'Fair';
      case AppetiteEnum.POOR: return 'Poor';
      case AppetiteEnum.NONE: return 'None';
      default: return 'Unknown';
    }
  };
  
  const getEnergyLevelLabel = (level?: EnergyLevel) => {
    if (!level) return 'Unknown';
    
    switch (level) {
      case EnergyEnum.HYPERACTIVE: return 'Hyperactive';
      case EnergyEnum.HIGH: return 'High';
      case EnergyEnum.NORMAL: return 'Normal';
      case EnergyEnum.LOW: return 'Low';
      case EnergyEnum.LETHARGIC: return 'Lethargic';
      default: return 'Unknown';
    }
  };
  
  const getStoolConsistencyLabel = (consistency?: StoolConsistency) => {
    if (!consistency) return 'Unknown';
    
    switch (consistency) {
      case StoolConsistencyEnum.NORMAL: return 'Normal';
      case StoolConsistencyEnum.SOFT: return 'Soft';
      case StoolConsistencyEnum.LOOSE: return 'Loose';
      case StoolConsistencyEnum.WATERY: return 'Watery';
      case StoolConsistencyEnum.HARD: return 'Hard';
      case StoolConsistencyEnum.BLOODY: return 'Bloody';
      case StoolConsistencyEnum.MUCUS: return 'With Mucus';
      default: return 'Unknown';
    }
  };
  
  // Derived data
  const recentIndicators = healthIndicators.slice(0, 3);
  const abnormalIndicators = healthIndicators.filter(indicator => indicator.abnormal && !indicator.alert_resolved);
  const healthAlerts = abnormalIndicators.map(indicator => ({
    id: `alert-${indicator.id}`,
    indicator_id: indicator.id,
    dog_id: indicator.dog_id,
    date: indicator.date,
    resolved: !!indicator.alert_resolved,
    resolved_by: indicator.alert_resolved_by,
    resolution_date: indicator.alert_resolution_date,
    notes: indicator.notes
  }));
  const hasActiveAlerts = healthAlerts.some(alert => !alert.resolved);
  
  return {
    healthIndicators,
    recentIndicators,
    abnormalIndicators,
    healthAlerts,
    isLoading,
    isLoadingRecent: isLoading,
    isLoadingAbnormal: isLoading,
    isLoadingAlerts: isLoading,
    error,
    isSubmitting,
    addHealthIndicator,
    updateHealthIndicator,
    deleteHealthIndicator,
    resolveAlert,
    getAppetiteLevelLabel,
    getEnergyLevelLabel,
    getStoolConsistencyLabel,
    hasActiveAlerts,
    indicators: healthIndicators,
  };
}
