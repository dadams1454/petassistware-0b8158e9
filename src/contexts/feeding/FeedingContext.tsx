
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  FeedingSchedule, 
  FeedingRecord, 
  FeedingFormData, 
  FeedingScheduleFormData,
  FeedingStats
} from '@/types/feeding';
import { 
  fetchFeedingSchedules,
  getFeedingScheduleById,
  createFeedingSchedule,
  updateFeedingSchedule,
  deleteFeedingSchedule,
  fetchFeedingRecords,
  createFeedingRecord,
  updateFeedingRecord,
  deleteFeedingRecord,
  fetchFeedingStats
} from '@/services/feedingService';
import { useToast } from '@/components/ui/use-toast';

interface FeedingContextType {
  loading: boolean;
  schedules: FeedingSchedule[];
  records: FeedingRecord[];
  stats: FeedingStats | null;
  fetchSchedules: (dogId: string) => Promise<FeedingSchedule[]>;
  fetchSchedule: (scheduleId: string) => Promise<FeedingSchedule | null>;
  createSchedule: (data: FeedingScheduleFormData) => Promise<FeedingSchedule | null>;
  updateSchedule: (scheduleId: string, data: Partial<FeedingScheduleFormData>) => Promise<FeedingSchedule | null>;
  deleteSchedule: (scheduleId: string) => Promise<boolean>;
  fetchRecords: (dogId: string, limit?: number) => Promise<FeedingRecord[]>;
  logFeeding: (data: FeedingFormData) => Promise<FeedingRecord | null>;
  updateFeedingLog: (id: string, data: Partial<FeedingFormData>) => Promise<FeedingRecord | null>;
  deleteFeedingLog: (id: string) => Promise<boolean>;
  fetchStats: (dogId: string, timeframe?: 'day' | 'week' | 'month') => Promise<FeedingStats | null>;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

export const FeedingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [stats, setStats] = useState<FeedingStats | null>(null);
  const { toast } = useToast();

  const handleFetchSchedules = useCallback(async (dogId: string) => {
    setLoading(true);
    try {
      const fetchedSchedules = await fetchFeedingSchedules(dogId);
      setSchedules(fetchedSchedules);
      return fetchedSchedules;
    } catch (error) {
      console.error('Error fetching feeding schedules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch feeding schedules',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleFetchSchedule = useCallback(async (scheduleId: string) => {
    setLoading(true);
    try {
      return await getFeedingScheduleById(scheduleId);
    } catch (error) {
      console.error('Error fetching feeding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch feeding schedule',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateSchedule = useCallback(async (data: FeedingScheduleFormData) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to create feeding schedules',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      // Transform schedule_time to array if needed
      const scheduleData = {
        ...data,
        schedule_time: Array.isArray(data.schedule_time) ? data.schedule_time : [data.schedule_time]
      };
      
      const newSchedule = await createFeedingSchedule(scheduleData);
      if (newSchedule) {
        setSchedules(prev => [newSchedule, ...prev]);
        toast({
          title: 'Success',
          description: 'Feeding schedule created successfully',
        });
      }
      return newSchedule;
    } catch (error) {
      console.error('Error creating feeding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feeding schedule',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const handleUpdateSchedule = useCallback(async (
    scheduleId: string, 
    data: Partial<FeedingScheduleFormData>
  ) => {
    setLoading(true);
    try {
      // Ensure schedule_time is in the right format
      const updateData = {
        ...data,
        schedule_time: data.schedule_time ? 
          (Array.isArray(data.schedule_time) ? data.schedule_time : [data.schedule_time]) 
          : undefined
      };
      
      const updatedSchedule = await updateFeedingSchedule(scheduleId, updateData);
      if (updatedSchedule) {
        setSchedules(prev => 
          prev.map(schedule => 
            schedule.id === scheduleId ? updatedSchedule : schedule
          )
        );
        toast({
          title: 'Success',
          description: 'Feeding schedule updated successfully',
        });
      }
      return updatedSchedule;
    } catch (error) {
      console.error('Error updating feeding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feeding schedule',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDeleteSchedule = useCallback(async (scheduleId: string) => {
    setLoading(true);
    try {
      const success = await deleteFeedingSchedule(scheduleId);
      if (success) {
        setSchedules(prev => 
          prev.filter(schedule => schedule.id !== scheduleId)
        );
        toast({
          title: 'Success',
          description: 'Feeding schedule deleted successfully',
        });
      }
      return success;
    } catch (error) {
      console.error('Error deleting feeding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feeding schedule',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleFetchRecords = useCallback(async (dogId: string, limit?: number) => {
    setLoading(true);
    try {
      // Fetch all records, then limit them in JS if needed
      const allRecords = await fetchFeedingRecords(dogId);
      const limitedRecords = limit ? allRecords.slice(0, limit) : allRecords;
      setRecords(limitedRecords);
      return limitedRecords;
    } catch (error) {
      console.error('Error fetching feeding records:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch feeding records',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleLogFeeding = useCallback(async (data: FeedingFormData) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to log feedings',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      // Ensure timestamp is in the right format
      const formattedData = {
        ...data,
        timestamp: typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp
      };
      
      const newRecord = await createFeedingRecord(formattedData, user.id);
      if (newRecord) {
        setRecords(prev => [newRecord, ...prev]);
        toast({
          title: 'Success',
          description: 'Feeding logged successfully',
        });
      }
      return newRecord;
    } catch (error) {
      console.error('Error logging feeding:', error);
      toast({
        title: 'Error',
        description: 'Failed to log feeding',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const handleUpdateFeedingLog = useCallback(async (
    id: string, 
    data: Partial<FeedingFormData>
  ) => {
    setLoading(true);
    try {
      // Need to convert the partial data to a complete FeedingRecordUpdateData
      // First get the current record
      const currentRecord = records.find(r => r.id === id);
      if (!currentRecord) {
        throw new Error('Feeding record not found');
      }
      
      // Format timestamp if needed
      const formattedData = {
        ...data,
        timestamp: data.timestamp ? 
          (typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp) 
          : undefined
      };
      
      // Create a complete update data object with required fields
      const updateData = {
        food_type: formattedData.food_type || currentRecord.food_type,
        amount_offered: formattedData.amount_offered || currentRecord.amount_offered,
        amount_consumed: formattedData.amount_consumed || currentRecord.amount_consumed,
        meal_type: formattedData.meal_type || currentRecord.meal_type || 'regular',
        refused: formattedData.refused !== undefined ? formattedData.refused : (currentRecord.refused || false),
        notes: formattedData.notes,
        schedule_id: formattedData.schedule_id,
        timestamp: formattedData.timestamp ? new Date(formattedData.timestamp) : new Date(currentRecord.timestamp)
      };
      
      const updatedRecord = await updateFeedingRecord(id, updateData);
      if (updatedRecord) {
        setRecords(prev => 
          prev.map(record => 
            record.id === id ? updatedRecord : record
          )
        );
        toast({
          title: 'Success',
          description: 'Feeding record updated successfully',
        });
      }
      return updatedRecord;
    } catch (error) {
      console.error('Error updating feeding record:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feeding record',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [records, toast]);

  const handleDeleteFeedingLog = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteFeedingRecord(id);
      if (success) {
        setRecords(prev => 
          prev.filter(record => record.id !== id)
        );
        toast({
          title: 'Success',
          description: 'Feeding record deleted successfully',
        });
      }
      return success;
    } catch (error) {
      console.error('Error deleting feeding record:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feeding record',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleFetchStats = useCallback(async (
    dogId: string,
    timeframe: 'day' | 'week' | 'month' = 'week'
  ) => {
    setLoading(true);
    try {
      const fetchedStats = await fetchFeedingStats(dogId, timeframe);
      setStats(fetchedStats);
      return fetchedStats;
    } catch (error) {
      console.error('Error fetching feeding stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch feeding statistics',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const value = {
    loading,
    schedules,
    records,
    stats,
    fetchSchedules: handleFetchSchedules,
    fetchSchedule: handleFetchSchedule,
    createSchedule: handleCreateSchedule,
    updateSchedule: handleUpdateSchedule,
    deleteSchedule: handleDeleteSchedule,
    fetchRecords: handleFetchRecords,
    logFeeding: handleLogFeeding,
    updateFeedingLog: handleUpdateFeedingLog,
    deleteFeedingLog: handleDeleteFeedingLog,
    fetchStats: handleFetchStats
  };

  return (
    <FeedingContext.Provider value={value}>
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
