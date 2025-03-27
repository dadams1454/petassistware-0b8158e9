
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  getFeedingHistory, 
  recordFeeding, 
  getDogFeedingSchedules,
  createFeedingSchedule,
  updateFeedingSchedule,
  deleteFeedingRecord,
  deleteFeedingSchedule
} from '@/services/feedingService';
import { FeedingRecord, FeedingSchedule, FeedingFormData, FeedingScheduleFormData } from '@/types/feeding';

interface FeedingContextType {
  feedingRecords: FeedingRecord[] | null;
  feedingSchedules: FeedingSchedule[] | null;
  loading: boolean;
  error: string | null;
  createRecord: (data: FeedingFormData) => Promise<FeedingRecord | null>;
  createSchedule: (data: FeedingScheduleFormData) => Promise<FeedingSchedule | null>;
  updateSchedule: (id: string, data: Partial<FeedingScheduleFormData>) => Promise<FeedingSchedule | null>;
  fetchFeedingHistory: (dogId: string) => Promise<void>;
  fetchFeedingSchedules: (dogId: string) => Promise<void>;
  deleteFeedingLog: (id: string) => Promise<boolean>;
  deleteFeedingScheduleItem: (id: string) => Promise<boolean>;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

export const FeedingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[] | null>(null);
  const [feedingSchedules, setFeedingSchedules] = useState<FeedingSchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedingHistory = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const records = await getFeedingHistory({ dogId });
      setFeedingRecords(records);
    } catch (err) {
      console.error('Error fetching feeding history:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching feeding history');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedingSchedules = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const schedules = await getDogFeedingSchedules(dogId);
      setFeedingSchedules(schedules);
    } catch (err) {
      console.error('Error fetching feeding schedules:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching feeding schedules');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (data: FeedingFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const record = await recordFeeding(data);
      return record;
    } catch (err) {
      console.error('Error creating feeding record:', err);
      setError(err instanceof Error ? err.message : 'An error occurred creating feeding record');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (data: FeedingScheduleFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const schedule = await createFeedingSchedule(data);
      return schedule;
    } catch (err) {
      console.error('Error creating feeding schedule:', err);
      setError(err instanceof Error ? err.message : 'An error occurred creating feeding schedule');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, data: Partial<FeedingScheduleFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const schedule = await updateFeedingSchedule(id, data);
      return schedule;
    } catch (err) {
      console.error('Error updating feeding schedule:', err);
      setError(err instanceof Error ? err.message : 'An error occurred updating feeding schedule');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedingLog = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await deleteFeedingRecord(id);
      return success;
    } catch (err) {
      console.error('Error deleting feeding record:', err);
      setError(err instanceof Error ? err.message : 'An error occurred deleting feeding record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedingScheduleItem = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await deleteFeedingSchedule(id);
      return success;
    } catch (err) {
      console.error('Error deleting feeding schedule:', err);
      setError(err instanceof Error ? err.message : 'An error occurred deleting feeding schedule');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedingContext.Provider
      value={{
        feedingRecords,
        feedingSchedules,
        loading,
        error,
        createRecord,
        createSchedule,
        updateSchedule,
        fetchFeedingHistory,
        fetchFeedingSchedules,
        deleteFeedingLog,
        deleteFeedingScheduleItem
      }}
    >
      {children}
    </FeedingContext.Provider>
  );
};

export const useFeeding = () => {
  const context = useContext(FeedingContext);
  if (context === undefined) {
    throw new Error('useFeeding must be used within a FeedingProvider');
  }
  return context;
};
