
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { HealthRecord, HealthIndicator, WeightRecord, Medication } from '@/types/health-unified';
import { useAuth } from '@/hooks/useAuth';

// Health context type
interface HealthContextType {
  // Health records
  healthRecords: HealthRecord[];
  isLoadingHealthRecords: boolean;
  refreshHealthRecords: () => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => Promise<HealthRecord>;
  updateHealthRecord: (record: HealthRecord) => Promise<HealthRecord>;
  deleteHealthRecord: (id: string) => Promise<boolean>;
  
  // Weight records
  weightRecords: WeightRecord[];
  isLoadingWeightRecords: boolean;
  refreshWeightRecords: () => void;
  addWeightRecord: (record: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change'>) => Promise<WeightRecord>;
  deleteWeightRecord: (id: string) => Promise<boolean>;
  
  // Health indicators
  healthIndicators: HealthIndicator[];
  isLoadingHealthIndicators: boolean;
  refreshHealthIndicators: () => void;
  addHealthIndicator: (indicator: Omit<HealthIndicator, 'id'>) => Promise<HealthIndicator>;
  deleteHealthIndicator: (id: string) => Promise<boolean>;
  
  // Medications
  medications: Medication[];
  isLoadingMedications: boolean;
  refreshMedications: () => void;
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<Medication>;
  updateMedication: (medication: Medication) => Promise<Medication>;
  deleteMedication: (id: string) => Promise<boolean>;
}

// Create context
const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Health provider props
interface HealthProviderProps {
  children: ReactNode;
  dogId?: string;
}

// Health provider component
export const HealthProvider: React.FC<HealthProviderProps> = ({ children, dogId }) => {
  const { user } = useAuth();
  
  // States for health records, weight records, health indicators, and medications
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isLoadingHealthRecords, setIsLoadingHealthRecords] = useState(true);
  
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoadingWeightRecords, setIsLoadingWeightRecords] = useState(true);
  
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>([]);
  const [isLoadingHealthIndicators, setIsLoadingHealthIndicators] = useState(true);
  
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoadingMedications, setIsLoadingMedications] = useState(true);
  
  // Mock data loading functions
  const loadMockHealthRecords = useCallback(async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        dog_id: dogId,
        record_type: 'VACCINATION',
        title: 'Annual Vaccines',
        date: '2024-01-15',
        created_at: '2024-01-15T15:00:00Z',
        record_notes: 'DHPP, Rabies, and Bordetella administered'
      },
      {
        id: '2',
        dog_id: dogId,
        record_type: 'EXAMINATION',
        title: 'Annual Checkup',
        date: '2024-01-15',
        created_at: '2024-01-15T15:30:00Z',
        record_notes: 'All systems normal. Weight 75 lbs.'
      }
    ] as HealthRecord[];
  }, [dogId]);
  
  const loadMockWeightRecords = useCallback(async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        dog_id: dogId,
        weight: 75.5,
        weight_unit: 'lb',
        date: '2024-01-15',
        created_at: '2024-01-15T15:00:00Z'
      },
      {
        id: '2',
        dog_id: dogId,
        weight: 74.2,
        weight_unit: 'lb',
        date: '2023-12-15',
        created_at: '2023-12-15T15:00:00Z',
        percent_change: -1.7
      }
    ] as WeightRecord[];
  }, [dogId]);
  
  const loadMockHealthIndicators = useCallback(async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        dog_id: dogId,
        date: '2024-01-15',
        appetite: 'good',
        energy: 'normal',
        stool_consistency: 'normal',
        created_at: '2024-01-15T15:00:00Z',
        created_by: user?.id
      }
    ] as HealthIndicator[];
  }, [dogId, user?.id]);
  
  const loadMockMedications = useCallback(async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        dog_id: dogId,
        name: 'Heartworm Prevention',
        frequency: 'monthly',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00Z',
        status: 'active'
      }
    ] as Medication[];
  }, [dogId]);
  
  // Fetch functions
  const fetchHealthRecords = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoadingHealthRecords(true);
    try {
      const records = await loadMockHealthRecords();
      setHealthRecords(records);
    } catch (error) {
      console.error('Error fetching health records:', error);
    } finally {
      setIsLoadingHealthRecords(false);
    }
  }, [dogId, loadMockHealthRecords]);
  
  const fetchWeightRecords = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoadingWeightRecords(true);
    try {
      const records = await loadMockWeightRecords();
      setWeightRecords(records);
    } catch (error) {
      console.error('Error fetching weight records:', error);
    } finally {
      setIsLoadingWeightRecords(false);
    }
  }, [dogId, loadMockWeightRecords]);
  
  const fetchHealthIndicators = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoadingHealthIndicators(true);
    try {
      const indicators = await loadMockHealthIndicators();
      setHealthIndicators(indicators);
    } catch (error) {
      console.error('Error fetching health indicators:', error);
    } finally {
      setIsLoadingHealthIndicators(false);
    }
  }, [dogId, loadMockHealthIndicators]);
  
  const fetchMedications = useCallback(async () => {
    if (!dogId) return;
    
    setIsLoadingMedications(true);
    try {
      const meds = await loadMockMedications();
      setMedications(meds);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setIsLoadingMedications(false);
    }
  }, [dogId, loadMockMedications]);
  
  // CRUD operations for health records
  const addHealthRecord = useCallback(async (record: Omit<HealthRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString()
    };
    
    setHealthRecords(prev => [...prev, newRecord]);
    return newRecord;
  }, []);
  
  const updateHealthRecord = useCallback(async (record: HealthRecord) => {
    setHealthRecords(prev => 
      prev.map(r => r.id === record.id ? { ...record, updated_at: new Date().toISOString() } : r)
    );
    return record;
  }, []);
  
  const deleteHealthRecord = useCallback(async (id: string) => {
    setHealthRecords(prev => prev.filter(r => r.id !== id));
    return true;
  }, []);
  
  // CRUD operations for weight records
  const addWeightRecord = useCallback(async (record: Omit<WeightRecord, 'id' | 'created_at' | 'percent_change'>) => {
    let percentChange: number | undefined;
    
    if (weightRecords.length > 0) {
      const lastRecord = weightRecords[0];
      percentChange = ((record.weight - lastRecord.weight) / lastRecord.weight) * 100;
    }
    
    const newRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      percent_change: percentChange
    };
    
    setWeightRecords(prev => [newRecord, ...prev]);
    return newRecord;
  }, [weightRecords]);
  
  const deleteWeightRecord = useCallback(async (id: string) => {
    setWeightRecords(prev => prev.filter(r => r.id !== id));
    return true;
  }, []);
  
  // CRUD operations for health indicators
  const addHealthIndicator = useCallback(async (indicator: Omit<HealthIndicator, 'id'>) => {
    const newIndicator = {
      ...indicator,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      created_by: user?.id
    };
    
    setHealthIndicators(prev => [...prev, newIndicator]);
    return newIndicator;
  }, [user?.id]);
  
  const deleteHealthIndicator = useCallback(async (id: string) => {
    setHealthIndicators(prev => prev.filter(i => i.id !== id));
    return true;
  }, []);
  
  // CRUD operations for medications
  const addMedication = useCallback(async (medication: Omit<Medication, 'id'>) => {
    const newMedication = {
      ...medication,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString()
    };
    
    setMedications(prev => [...prev, newMedication]);
    return newMedication;
  }, []);
  
  const updateMedication = useCallback(async (medication: Medication) => {
    setMedications(prev => 
      prev.map(m => m.id === medication.id ? medication : m)
    );
    return medication;
  }, []);
  
  const deleteMedication = useCallback(async (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    return true;
  }, []);
  
  // Initial data fetching
  useEffect(() => {
    if (dogId) {
      fetchHealthRecords();
      fetchWeightRecords();
      fetchHealthIndicators();
      fetchMedications();
    }
  }, [dogId, fetchHealthRecords, fetchWeightRecords, fetchHealthIndicators, fetchMedications]);
  
  // Build context value
  const contextValue: HealthContextType = {
    // Health records
    healthRecords,
    isLoadingHealthRecords,
    refreshHealthRecords: fetchHealthRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    
    // Weight records
    weightRecords,
    isLoadingWeightRecords,
    refreshWeightRecords: fetchWeightRecords,
    addWeightRecord,
    deleteWeightRecord,
    
    // Health indicators
    healthIndicators,
    isLoadingHealthIndicators,
    refreshHealthIndicators: fetchHealthIndicators,
    addHealthIndicator,
    deleteHealthIndicator,
    
    // Medications
    medications,
    isLoadingMedications,
    refreshMedications: fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication
  };
  
  return (
    <HealthContext.Provider value={contextValue}>
      {children}
    </HealthContext.Provider>
  );
};

// Hook to use health context
export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

// Hook to use health context for a specific dog
export const useDogHealth = (dogId: string) => {
  return (
    <HealthProvider dogId={dogId}>
      {/* This is just a wrapper that doesn't render anything */}
    </HealthProvider>
  );
};
