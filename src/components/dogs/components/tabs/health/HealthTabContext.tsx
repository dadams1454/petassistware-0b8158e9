
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDogHealthRecords } from '@/hooks/useDogHealthRecords';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';

interface HealthTabContextProps {
  dogId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  healthRecords: HealthRecord[];
  isLoading: boolean;
  error: Error | null;
  showAddRecordDialog: boolean;
  setShowAddRecordDialog: (show: boolean) => void;
  selectedRecordType: HealthRecordTypeEnum;
  setSelectedRecordType: (type: HealthRecordTypeEnum) => void;
  recordToEdit: HealthRecord | null;
  setRecordToEdit: (record: HealthRecord | null) => void;
  recordToDelete: string | null;
  setRecordToDelete: (recordId: string | null) => void;
  handleAddHealthRecord: (data: Partial<HealthRecord>) => Promise<any>;
  handleUpdateHealthRecord: (data: Partial<HealthRecord>) => Promise<any>;
  handleDeleteHealthRecord: () => Promise<void>;
  refreshRecords: () => void;
}

const HealthTabContext = createContext<HealthTabContextProps | undefined>(undefined);

export const useHealthTabContext = () => {
  const context = useContext(HealthTabContext);
  
  if (context === undefined) {
    throw new Error('useHealthTabContext must be used within a HealthTabProvider');
  }
  
  return context;
};

interface HealthTabProviderProps {
  children: React.ReactNode;
  dogId: string;
}

export const HealthTabProvider: React.FC<HealthTabProviderProps> = ({ 
  children, 
  dogId 
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordTypeEnum>(HealthRecordTypeEnum.Examination);
  const [recordToEdit, setRecordToEdit] = useState<HealthRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  const { 
    records: healthRecords, 
    isLoading, 
    error, 
    addHealthRecord, 
    updateHealthRecord, 
    deleteHealthRecord, 
    refresh: refreshRecords 
  } = useDogHealthRecords(dogId);
  
  const handleAddHealthRecord = async (data: Partial<HealthRecord>) => {
    try {
      const result = await addHealthRecord({
        ...data,
        dog_id: dogId,
      } as Omit<HealthRecord, 'id'>);
      
      setShowAddRecordDialog(false);
      return result;
    } catch (error) {
      console.error('Error adding health record:', error);
      throw error;
    }
  };
  
  const handleUpdateHealthRecord = async (data: Partial<HealthRecord>) => {
    if (!recordToEdit?.id) return null;
    
    try {
      const result = await updateHealthRecord(recordToEdit.id, data);
      setRecordToEdit(null);
      return result;
    } catch (error) {
      console.error('Error updating health record:', error);
      throw error;
    }
  };
  
  const handleDeleteHealthRecord = async () => {
    if (!recordToDelete) return;
    
    try {
      await deleteHealthRecord(recordToDelete);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error deleting health record:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    // Reset form state when tab changes
    setShowAddRecordDialog(false);
    setRecordToEdit(null);
    setRecordToDelete(null);
  }, [activeTab]);
  
  const contextValue: HealthTabContextProps = {
    dogId,
    activeTab,
    setActiveTab,
    healthRecords,
    isLoading,
    error,
    showAddRecordDialog,
    setShowAddRecordDialog,
    selectedRecordType,
    setSelectedRecordType,
    recordToEdit,
    setRecordToEdit,
    recordToDelete,
    setRecordToDelete,
    handleAddHealthRecord,
    handleUpdateHealthRecord,
    handleDeleteHealthRecord,
    refreshRecords
  };
  
  return (
    <HealthTabContext.Provider value={contextValue}>
      {children}
    </HealthTabContext.Provider>
  );
};
