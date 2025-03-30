
import React, { createContext, useState, useContext } from 'react';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord } from '@/types/health';
import { useHealthRecords } from '../../../hooks/useHealthRecords';
import { useWeightTracking } from '../../../hooks/useWeightTracking';

// Context type definition
interface HealthTabContextType {
  dogId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recordDialogOpen: boolean;
  setRecordDialogOpen: (open: boolean) => void;
  weightDialogOpen: boolean;
  setWeightDialogOpen: (open: boolean) => void;
  selectedRecordType: HealthRecordTypeEnum;
  setSelectedRecordType: (type: HealthRecordTypeEnum) => void;
  selectedRecord: string | null;
  setSelectedRecord: (id: string | null) => void;
  healthRecords: HealthRecord[];
  weightHistory: WeightRecord[];
  getRecordsByType: (type: HealthRecordTypeEnum) => HealthRecord[];
  getUpcomingVaccinations: () => HealthRecord[];
  getOverdueVaccinations: () => HealthRecord[];
  isLoading: boolean;
  handleAddRecord: (type: HealthRecordTypeEnum) => void;
  handleEditRecord: (recordId: string) => void;
  handleSaveRecord: () => Promise<void>;
  handleSaveWeight: (weightData: any) => void;
  deleteHealthRecord: (id: string) => void;
  addHealthRecord: (record: any) => void;
  growthStats: any;
}

// Create context with default values
const HealthTabContext = createContext<HealthTabContextType | undefined>(undefined);

// Provider component
export const HealthTabProvider: React.FC<{ dogId: string; children: React.ReactNode }> = ({ 
  dogId,
  children 
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState(HealthRecordTypeEnum.Examination);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  // Health records hook
  const { 
    healthRecords, 
    isLoading: recordsLoading,
    error: recordsError,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getRecordsByType,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    refetch
  } = useHealthRecords(dogId);
  
  // Weight tracking hook
  const { 
    weightHistory, 
    isLoading: weightLoading,
    error: weightError,
    addWeightRecord,
    growthStats 
  } = useWeightTracking(dogId);
  
  // Actions
  const handleAddRecord = (type: HealthRecordTypeEnum) => {
    setSelectedRecordType(type);
    setSelectedRecord(null);
    setRecordDialogOpen(true);
  };
  
  const handleEditRecord = (recordId: string) => {
    setSelectedRecord(recordId);
    setRecordDialogOpen(true);
  };

  const handleSaveRecord = async () => {
    setRecordDialogOpen(false);
    await refetch();
  };
  
  const handleSaveWeight = (weightData: any) => {
    const formattedData = {
      ...weightData,
      dog_id: dogId,
      date: typeof weightData.date === 'string' ? weightData.date : weightData.date.toISOString().split('T')[0]
    };
    
    addWeightRecord(formattedData);
    setWeightDialogOpen(false);
  };

  // Context value
  const value = {
    dogId,
    activeTab,
    setActiveTab,
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    selectedRecordType,
    setSelectedRecordType,
    selectedRecord,
    setSelectedRecord,
    healthRecords: healthRecords?.map(record => adaptHealthRecord(record)) || [],
    weightHistory: weightHistory || [],
    getRecordsByType,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    isLoading: recordsLoading || weightLoading,
    handleAddRecord,
    handleEditRecord,
    handleSaveRecord,
    handleSaveWeight,
    deleteHealthRecord,
    addHealthRecord,
    growthStats
  };

  return (
    <HealthTabContext.Provider value={value}>
      {children}
    </HealthTabContext.Provider>
  );
};

// Custom hook for using the context
export const useHealthTabContext = () => {
  const context = useContext(HealthTabContext);
  if (context === undefined) {
    throw new Error('useHealthTabContext must be used within a HealthTabProvider');
  }
  return context;
};

// Helper function adapted from original component
const adaptHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type,
    title: record.title || '',
    description: record.description || record.record_notes || '',
    date: record.visit_date || record.date || new Date().toISOString(),
    visit_date: record.visit_date,
    performed_by: record.performed_by || record.vet_name || '',
    next_due_date: record.next_due_date,
    created_at: record.created_at,
    document_url: record.document_url,
    ...record
  };
};
