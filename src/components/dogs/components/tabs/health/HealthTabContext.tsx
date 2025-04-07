import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useWeightData } from '@/hooks/useWeightData';
import { HealthRecord, HealthRecordType } from '@/types/health';
import { WeightRecord } from '@/types/weight';
import { useDogProfileData } from '@/hooks/useDogProfileData';
import { useMedication } from '@/hooks/useMedication';
import { useMedicationTime } from '@/hooks/useMedicationTime';
import { useToast } from '@/components/ui/use-toast';

interface HealthTabContextProps {
  healthRecords: HealthRecord[];
  weightRecords: WeightRecord[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dogId: string;
  isLoading: boolean;
  isWeightLoading: boolean;
  error: any;
  weightError: any;
  refreshHealthRecords: () => void;
  refreshWeightRecords: () => void;
}

const HealthTabContext = createContext<HealthTabContextProps | undefined>(undefined);

export const useHealthTabContext = () => {
  const context = useContext(HealthTabContext);
  if (!context) {
    throw new Error('useHealthTabContext must be used within a HealthTabProvider');
  }
  return context;
};

interface HealthTabProviderProps {
  children: React.ReactNode;
}

export const HealthTabProvider: React.FC<HealthTabProviderProps> = ({ children }) => {
  const { dogId: dogIdParam } = useParams();
  const dogId = dogIdParam as string;
  const [activeTab, setActiveTab] = useState('all');
  const { healthRecords, isLoading, error, refreshHealthRecords } = useHealthRecords(dogId);
  const { weightRecords, isLoading: isWeightLoading, error: weightError, refreshWeightRecords } = useWeightData(dogId);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching health records',
        description: error.message,
        variant: 'destructive',
      });
    }
    if (weightError) {
      toast({
        title: 'Error fetching weight records',
        description: weightError.message,
        variant: 'destructive',
      });
    }
  }, [error, weightError, toast]);

  // Use correct enum capitalization
  const tabByRecordType = (record: HealthRecord): string => {
    switch (record.record_type) {
      case HealthRecordType.VACCINATION:
        return 'vaccinations';
      case HealthRecordType.EXAMINATION:
        return 'examinations';
      case HealthRecordType.MEDICATION:
        return 'medications';
      default:
        return 'all';
    }
  };

  const value: HealthTabContextProps = {
    healthRecords,
    weightRecords,
    activeTab,
    setActiveTab,
    dogId,
    isLoading,
    isWeightLoading,
    error,
    weightError,
    refreshHealthRecords,
    refreshWeightRecords
  };

  return (
    <HealthTabContext.Provider value={value}>
      {children}
    </HealthTabContext.Provider>
  );
};
