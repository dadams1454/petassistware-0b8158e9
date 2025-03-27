
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  MedicationRecord, 
  MedicationFormData, 
  MedicationStatus,
  MedicationStats
} from '@/types/medication';
import { 
  fetchDogMedications, 
  createMedicationRecord, 
  updateMedicationRecord, 
  deleteMedicationRecord,
  fetchOverdueMedications,
  fetchUpcomingMedications,
  fetchMedicationStats
} from '@/services/medicationService';
import { useToast } from '@/components/ui/use-toast';

interface MedicationContextType {
  medications: MedicationRecord[];
  overdueMedications: MedicationRecord[];
  upcomingMedications: MedicationRecord[];
  stats: MedicationStats | null;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading for backward compatibility
  error: Error | null;
  fetchMedications: (dogId: string) => Promise<void>;
  fetchStats: (dogId: string) => Promise<void>;
  addMedication: (data: MedicationFormData) => Promise<MedicationRecord>;
  updateMedication: (id: string, data: MedicationFormData) => Promise<MedicationRecord>;
  deleteMedication: (id: string) => Promise<void>;
  fetchAllOverdueMedications: () => Promise<void>;
  fetchAllUpcomingMedications: (days?: number) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationRecord[]>([]);
  const [overdueMedications, setOverdueMedications] = useState<MedicationRecord[]>([]);
  const [upcomingMedications, setUpcomingMedications] = useState<MedicationRecord[]>([]);
  const [stats, setStats] = useState<MedicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchMedications = async (dogId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDogMedications(dogId);
      setMedications(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch medications');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async (dogId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMedicationStats(dogId);
      setStats(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch medication statistics');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = async (data: MedicationFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newMedication = await createMedicationRecord(data);
      setMedications(prev => [...prev, newMedication]);
      toast({
        title: 'Medication Added',
        description: `${data.medication_name} has been added successfully.`,
      });
      return newMedication;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add medication');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedication = async (id: string, data: MedicationFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedMedication = await updateMedicationRecord(id, data);
      setMedications(prev => prev.map(med => med.id === id ? updatedMedication : med));
      toast({
        title: 'Medication Updated',
        description: `${data.medication_name} has been updated successfully.`,
      });
      return updatedMedication;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update medication');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedication = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteMedicationRecord(id);
      setMedications(prev => prev.filter(med => med.id !== id));
      toast({
        title: 'Medication Deleted',
        description: 'The medication has been deleted successfully.',
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete medication');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllOverdueMedications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchOverdueMedications();
      setOverdueMedications(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch overdue medications');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUpcomingMedications = async (days = 7) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUpcomingMedications(days);
      setUpcomingMedications(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch upcoming medications');
      setError(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: MedicationContextType = {
    medications,
    overdueMedications,
    upcomingMedications,
    stats,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    fetchMedications,
    fetchStats,
    addMedication,
    updateMedication,
    deleteMedication,
    fetchAllOverdueMedications,
    fetchAllUpcomingMedications,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};
