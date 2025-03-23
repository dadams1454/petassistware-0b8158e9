
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { DashboardStats, DashboardEvent, ActivityItem } from '@/services/dashboardService';
import { useQueryWithRefresh } from '@/hooks/useQueryWithRefresh';

export const useDashboardData = () => {
  const { user } = useAuth();
  
  // Use our custom hook that combines React Query with the refresh context
  const { 
    data, 
    isLoading, 
    error, 
    manualRefresh 
  } = useQueryWithRefresh({
    queryKey: ['dashboard', 'data', user?.id || 'anonymous'],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      console.log('📊 Fetching dashboard data...');
      
      // In a real app, these would be separate API calls or database queries
      // Fetch total dogs count
      const { count: dogsCount, error: dogsError } = await supabase
        .from('dogs')
        .select('*', { count: 'exact', head: true });
      
      if (dogsError) {
        console.error('Error fetching dogs count:', dogsError);
        throw dogsError;
      }
      
      // Fetch active litters
      const { count: littersCount, error: littersError } = await supabase
        .from('litters')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (littersError) {
        console.error('Error fetching litters count:', littersError);
        throw littersError;
      }
      
      // Fetch reservations count
      const { count: reservationsCount, error: reservationsError } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true });
      
      if (reservationsError) {
        console.error('Error fetching reservations count:', reservationsError);
        throw reservationsError;
      }
      
      // Calculate recent revenue (mock data for now)
      const recentRevenue = 5000; // Mock value, replace with actual calculation
      
      // Create stats object
      const stats: DashboardStats = {
        dogCount: dogsCount || 0,
        litterCount: littersCount || 0,
        reservationCount: reservationsCount || 0,
        recentRevenue: recentRevenue,
        // Include backward compatibility fields
        totalDogs: dogsCount || 0,
        activeLitters: littersCount || 0,
        upcomingEvents: 3, // Mock data
        pendingTasks: 5, // Mock data
      };
      
      // Fetch recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(5);
      
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        throw eventsError;
      }
      
      // Map events to the expected format
      const events: DashboardEvent[] = eventsData ? eventsData.map(event => ({
        id: event.id,
        title: event.title,
        date: event.event_date, // Map to the old field name for compatibility
        event_date: event.event_date,
        type: event.event_type, // Map to the old field name for compatibility
        event_type: event.event_type,
        description: event.description || '',
        status: event.status
      })) : [];
      
      // Fetch recent activities from daily_care_logs
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('daily_care_logs')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        throw activitiesError;
      }
      
      // Map activities to the expected format
      const activities: ActivityItem[] = activitiesData ? activitiesData.map(activity => ({
        id: activity.id,
        type: activity.category || 'care',
        title: activity.task_name || 'Care Task', // Add a title field for the new interface
        description: activity.notes || `${activity.task_name} logged`,
        timestamp: activity.created_at, // Keep old field for compatibility
        createdAt: activity.created_at,
        dogId: activity.dog_id,
        dogName: activity.dogs?.name
      })) : [];
      
      console.log('✅ Dashboard data loaded successfully');
      
      return {
        stats,
        events,
        activities
      };
    },
    area: 'dashboard',
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!user, // Only run the query if we have a user
  });
  
  return {
    isLoading,
    stats: data?.stats || null,
    events: data?.events || [],
    activities: data?.activities || [],
    refetch: manualRefresh,
    error
  };
};
