
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DailyCarelog } from '@/types/dailyCare';

// Define the CareLog interface for internal use
export interface CareLog {
  id: string;
  dog_id: string;
  category: string;
  task_name: string;
  timestamp: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

/**
 * Hook to fetch and manage care logs data for dog timeline
 */
export const useCareLogsData = (dogId: string, category: string, date: Date) => {
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!dogId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create date boundaries for the query
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Query for care logs
      const { data, error } = await supabase
        .from('daily_care_logs')
        .select('*')
        .eq('dog_id', dogId)
        .eq('category', category)
        .gte('timestamp', startOfDay.toISOString())
        .lte('timestamp', endOfDay.toISOString())
        .order('timestamp', { ascending: true });
        
      if (error) throw error;
      
      // Process logs to ensure all required fields are present
      const processedLogs: CareLog[] = (data || []).map((log: DailyCarelog) => ({
        ...log,
        task_name: log.task_name || 'Unknown task' // Ensure task_name is never undefined
      }));
      
      setCareLogs(processedLogs);
    } catch (err) {
      console.error(`Error fetching ${category} logs:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [dogId, category, date]);

  // Fetch logs whenever dependencies change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Function to refresh logs
  const refresh = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    careLogs,
    loading,
    error,
    refresh
  };
};
