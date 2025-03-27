
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  fetchDogFeedingSchedules, 
  createFeedingRecord, 
  fetchDogFeedingRecords,
  createFeedingSchedule,
  updateFeedingSchedule,
  deleteFeedingRecord,
  deleteFeedingSchedule,
  getFeedingStats
} from '@/services/feedingService';
import { FeedingRecord, FeedingSchedule, FeedingFormData, FeedingScheduleFormData, FeedingStats } from '@/types/feeding';
import { useToast } from '@/components/ui/use-toast';

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
  deleteSchedule: (id: string) => Promise<boolean>; // Added this method to match usage in components
  fetchFeedingStats: (dogId: string, timeframe?: 'day' | 'week' | 'month') => Promise<FeedingStats | null>;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

export const FeedingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[] | null>(null);
  const [feedingSchedules, setFeedingSchedules] = useState<FeedingSchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFeedingHistory = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const records = await fetchDogFeedingRecords(dogId);
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
      const schedules = await fetchDogFeedingSchedules(dogId);
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
      // We need to make sure staff_id is provided, but for now, we'll use a placeholder
      const staffId = "placeholder-staff-id"; // This should be replaced with actual user ID
      const record = await createFeedingRecord(data, staffId);
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

  // Added deleteSchedule method to alias deleteFeedingScheduleItem for consistent naming
  const deleteSchedule = async (id: string) => {
    return deleteFeedingScheduleItem(id);
  };

  // Add fetchFeedingStats method
  const fetchFeedingStats = async (dogId: string, timeframe: 'day' | 'week' | 'month' = 'week') => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await getFeedingStats(dogId, timeframe);
      return stats;
    } catch (err) {
      console.error('Error fetching feeding stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching feeding stats');
      return null;
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
        deleteFeedingScheduleItem,
        deleteSchedule,
        fetchFeedingStats
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
