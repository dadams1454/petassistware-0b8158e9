
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

// Define the return types for the dashboard data
interface DashboardStats {
  totalDogs: number;
  activeLitters: number;
  upcomingEvents: number;
  pendingTasks: number;
}

interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  dogId?: string;
  dogName?: string;
}

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const { user } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('📊 Fetching dashboard data...');
      
      // In a real app, these would be separate API calls or database queries
      // For now, we'll simulate the data
      
      // Fetch total dogs count
      const { count: dogsCount } = await supabase
        .from('dogs')
        .select('*', { count: 'exact', head: true });
      
      // Fetch active litters
      const { count: littersCount } = await supabase
        .from('litters')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      // Set stats
      setStats({
        totalDogs: dogsCount || 0,
        activeLitters: littersCount || 0,
        upcomingEvents: 3, // Mock data
        pendingTasks: 5, // Mock data
      });
      
      // Fetch recent events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(5);
      
      if (eventsData) {
        setEvents(eventsData.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          type: event.type
        })));
      }
      
      // Fetch recent activities
      const { data: activitiesData } = await supabase
        .from('care_logs')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activitiesData) {
        setActivities(activitiesData.map(activity => ({
          id: activity.id,
          type: activity.category,
          description: activity.notes || `${activity.task} logged`,
          timestamp: activity.created_at,
          dogId: activity.dog_id,
          dogName: activity.dogs?.name
        })));
      }
      
      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    isLoading,
    stats,
    events,
    activities,
    refetch: fetchDashboardData
  };
};
