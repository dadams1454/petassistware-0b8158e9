
import React, { createContext, useContext, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  CareRecord, 
  CareRecordFormData, 
  CareCategory 
} from '@/types/careRecord';
import { 
  fetchDogCareRecords,
  fetchCareRecordsByCategory,
  createCareRecord,
  updateCareRecord,
  deleteCareRecord,
  getCareRecordStats
} from '@/services/careRecordService';
import { useToast } from '@/components/ui/use-toast';

interface CareRecordsContextType {
  loading: boolean;
  fetchDogCareRecords: (dogId: string, limit?: number, categories?: CareCategory[]) => Promise<CareRecord[]>;
  fetchCareRecordsByCategory: (dogId: string, category: CareCategory, limit?: number) => Promise<CareRecord[]>;
  createCareRecord: (data: CareRecordFormData) => Promise<CareRecord | null>;
  updateCareRecord: (id: string, data: Partial<CareRecordFormData>) => Promise<CareRecord | null>;
  deleteCareRecord: (id: string) => Promise<boolean>;
  getCareRecordStats: (dogId: string, timeframe?: 'day' | 'week' | 'month') => Promise<any>;
}

const CareRecordsContext = createContext<CareRecordsContextType | undefined>(undefined);

export const CareRecordsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchDogCareRecords = useCallback(async (
    dogId: string, 
    limit?: number,
    categories?: CareCategory[]
  ) => {
    setLoading(true);
    try {
      const records = await fetchDogCareRecords(dogId, limit, categories);
      return records;
    } catch (error) {
      console.error('Error fetching care records:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch care records',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleFetchCareRecordsByCategory = useCallback(async (
    dogId: string, 
    category: CareCategory,
    limit?: number
  ) => {
    setLoading(true);
    try {
      const records = await fetchCareRecordsByCategory(dogId, category, limit);
      return records;
    } catch (error) {
      console.error(`Error fetching ${category} records:`, error);
      toast({
        title: 'Error',
        description: `Failed to fetch ${category} records`,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateCareRecord = useCallback(async (data: CareRecordFormData) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add care records',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const record = await createCareRecord(data, user.id);
      
      if (record) {
        toast({
          title: 'Success',
          description: 'Care record added successfully',
        });
      }
      
      return record;
    } catch (error) {
      console.error('Error creating care record:', error);
      toast({
        title: 'Error',
        description: 'Failed to create care record',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const handleUpdateCareRecord = useCallback(async (
    id: string,
    data: Partial<CareRecordFormData>
  ) => {
    setLoading(true);
    try {
      const record = await updateCareRecord(id, data);
      
      if (record) {
        toast({
          title: 'Success',
          description: 'Care record updated successfully',
        });
      }
      
      return record;
    } catch (error) {
      console.error('Error updating care record:', error);
      toast({
        title: 'Error',
        description: 'Failed to update care record',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDeleteCareRecord = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteCareRecord(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Care record deleted successfully',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting care record:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete care record',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleGetCareRecordStats = useCallback(async (
    dogId: string,
    timeframe: 'day' | 'week' | 'month' = 'day'
  ) => {
    setLoading(true);
    try {
      const stats = await getCareRecordStats(dogId, timeframe);
      return stats;
    } catch (error) {
      console.error('Error fetching care record stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch care stats',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <CareRecordsContext.Provider
      value={{
        loading,
        fetchDogCareRecords: handleFetchDogCareRecords,
        fetchCareRecordsByCategory: handleFetchCareRecordsByCategory,
        createCareRecord: handleCreateCareRecord,
        updateCareRecord: handleUpdateCareRecord,
        deleteCareRecord: handleDeleteCareRecord,
        getCareRecordStats: handleGetCareRecordStats,
      }}
    >
      {children}
    </CareRecordsContext.Provider>
  );
};

export const useCareRecords = () => {
  const context = useContext(CareRecordsContext);
  if (context === undefined) {
    throw new Error('useCareRecords must be used within a CareRecordsProvider');
  }
  return context;
};
