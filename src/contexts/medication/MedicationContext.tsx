
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  fetchDogMedications, 
  fetchOverdueMedications,
  fetchMedicationStats,
  fetchUpcomingMedications,
  getMedicationStats,
  getOverdueMedications,
  getUpcomingMedications
} from '@/services/medicationService';
import { MedicationRecord, MedicationStats } from '@/types/medication';

interface MedicationContextProps {
  medications: MedicationRecord[] | null;
  upcomingMedications: MedicationRecord[] | null;
  overdueMedications: MedicationRecord[] | null;
  stats: MedicationStats | null;
  loading: boolean;
  error: string | null;
  fetchMedications: (dogId: string) => Promise<void>;
  fetchStats: (dogId: string) => Promise<void>;
  fetchOverdueMedications: (dogId: string) => Promise<void>;
  fetchUpcomingMedications: (dogId: string, daysAhead?: number) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextProps | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationRecord[] | null>(null);
  const [upcomingMedications, setUpcomingMedications] = useState<MedicationRecord[] | null>(null);
  const [overdueMedications, setOverdueMedications] = useState<MedicationRecord[] | null>(null);
  const [stats, setStats] = useState<MedicationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const medicationsData = await fetchDogMedications(dogId);
      setMedications(medicationsData);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching medications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await fetchMedicationStats(dogId);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching medication stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching medication statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationOverdue = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const overdueData = await fetchOverdueMedications();
      // Filter for specific dog if dogId is provided
      const filteredData = dogId 
        ? overdueData.filter(med => med.dog_id === dogId)
        : overdueData;
      setOverdueMedications(filteredData);
    } catch (err) {
      console.error('Error fetching overdue medications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching overdue medications');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationUpcoming = async (dogId: string, daysAhead = 7) => {
    setLoading(true);
    setError(null);
    
    try {
      const upcomingData = await fetchUpcomingMedications(daysAhead);
      // Filter for specific dog if dogId is provided
      const filteredData = dogId 
        ? upcomingData.filter(med => med.dog_id === dogId)
        : upcomingData;
      setUpcomingMedications(filteredData);
    } catch (err) {
      console.error('Error fetching upcoming medications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching upcoming medications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        upcomingMedications,
        overdueMedications,
        stats,
        loading,
        error,
        fetchMedications,
        fetchStats,
        fetchOverdueMedications: fetchMedicationOverdue,
        fetchUpcomingMedications: fetchMedicationUpcoming
      }}
    >
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
