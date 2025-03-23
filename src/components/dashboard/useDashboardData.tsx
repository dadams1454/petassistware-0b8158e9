
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { DashboardStats, DashboardEvent, ActivityItem } from '@/services/dashboardService';

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
      
      // Fetch reservations count
      const { count: reservationsCount } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true });
      
      // Calculate recent revenue (mock data for now)
      const recentRevenue = 5000; // Mock value, replace with actual calculation
      
      // Set stats
      setStats({
        dogCount: dogsCount || 0,
        litterCount: littersCount || 0,
        reservationCount: reservationsCount || 0,
        recentRevenue: recentRevenue,
        // Include backward compatibility fields
        totalDogs: dogsCount || 0,
        activeLitters: littersCount || 0,
        upcomingEvents: 3, // Mock data
        pendingTasks: 5, // Mock data
      });
      
      // Fetch recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(5);
      
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      }
      
      if (eventsData) {
        setEvents(eventsData.map(event => ({
          id: event.id,
          title: event.title,
          date: event.event_date, // Map to the old field name for compatibility
          event_date: event.event_date,
          type: event.event_type, // Map to the old field name for compatibility
          event_type: event.event_type,
          description: event.description || '',
          status: event.status
        })));
      }
      
      // Fetch recent activities from daily_care_logs
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('daily_care_logs')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
      }
      
      if (activitiesData) {
        setActivities(activitiesData.map(activity => ({
          id: activity.id,
          type: activity.category || 'care',
          title: activity.task_name || 'Care Task', // Add a title field for the new interface
          description: activity.notes || `${activity.task_name} logged`,
          timestamp: activity.created_at, // Keep old field for compatibility
          createdAt: activity.created_at,
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
