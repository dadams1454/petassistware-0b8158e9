
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { FeedingSchedule, FeedingRecord, FeedingFormData, FeedingScheduleFormData, FeedingStats } from '@/types/feeding';
import { 
  fetchFeedingSchedules,
  fetchFeedingRecords,
  createFeedingSchedule,
  updateFeedingSchedule,
  deleteFeedingSchedule,
  createFeedingRecord,
  updateFeedingRecord,
  deleteFeedingRecord,
  fetchFeedingStats
} from '@/services/feedingService';
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
  deleteSchedule: (id: string) => Promise<boolean>; 
  fetchFeedingStats: (dogId: string, timeframe?: 'day' | 'week' | 'month') => Promise<FeedingStats | null>;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

export const FeedingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[] | null>(null);
  const [feedingSchedules, setFeedingSchedules] = useState<FeedingSchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFeedingHistory = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const records = await fetchFeedingRecords(dogId);
      setFeedingRecords(records);
    } catch (err) {
      console.error('Error fetching feeding history:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching feeding history');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (dogId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const schedules = await fetchFeedingSchedules(dogId);
      setFeedingSchedules(schedules);
    } catch (err) {
      console.error('Error fetching feeding schedules:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching feeding schedules');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (data: FeedingFormData): Promise<FeedingRecord | null> => {
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

  const createSchedule = async (data: FeedingScheduleFormData): Promise<FeedingSchedule | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Adjust to ensure schedule_time is an array
      const scheduleData = {
        ...data,
        schedule_time: Array.isArray(data.schedule_time) ? data.schedule_time : [data.schedule_time]
      };
      const schedule = await createFeedingSchedule(scheduleData);
      return schedule;
    } catch (err) {
      console.error('Error creating feeding schedule:', err);
      setError(err instanceof Error ? err.message : 'An error occurred creating feeding schedule');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, data: Partial<FeedingScheduleFormData>): Promise<FeedingSchedule | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Make sure schedule_time is properly formatted
      const updateData = {
        ...data,
        schedule_time: data.schedule_time ? 
          (Array.isArray(data.schedule_time) ? data.schedule_time : [data.schedule_time]) 
          : undefined
      };
      const schedule = await updateFeedingSchedule(id, updateData);
      return schedule;
    } catch (err) {
      console.error('Error updating feeding schedule:', err);
      setError(err instanceof Error ? err.message : 'An error occurred updating feeding schedule');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedingLog = async (id: string): Promise<boolean> => {
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

  const deleteFeedingScheduleItem = async (id: string): Promise<boolean> => {
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
  const deleteSchedule = async (id: string): Promise<boolean> => {
    return deleteFeedingScheduleItem(id);
  };

  // Add fetchFeedingStats method
  const fetchFeedingStats = async (dogId: string, timeframe: 'day' | 'week' | 'month' = 'week'): Promise<FeedingStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await fetchFeedingStats(dogId, timeframe);
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
        fetchFeedingSchedules: fetchSchedules,
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
