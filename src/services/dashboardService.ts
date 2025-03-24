
import { supabase } from '@/integrations/supabase/client';

// Define the types needed for dashboard data
export interface DashboardData {
  totalDogs: number;
  activeDogs: number;
  totalLitters: number;
  activeLitters: number;
  totalPuppies: number;
  availablePuppies: number;
  totalCustomers: number;
  // Add any other dashboard metrics here
}

// Alias DashboardStats to match the naming used in components
export type DashboardStats = DashboardData;

export interface UpcomingEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'upcoming' | 'planned' | 'completed' | 'cancelled';
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

// Main dashboard data fetching function
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Fetch count of all dogs
    const { count: totalDogs, error: dogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true });

    // Fetch count of active dogs
    const { count: activeDogs, error: activeDogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Fetch count of all litters
    const { count: totalLitters, error: littersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true });

    // Fetch count of active litters
    const { count: activeLitters, error: activeLittersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Fetch count of all puppies
    const { count: totalPuppies, error: puppiesError } = await supabase
      .from('puppies')
      .select('*', { count: 'exact', head: true });

    // Fetch count of available puppies
    const { count: availablePuppies, error: availablePuppiesError } = await supabase
      .from('puppies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Available');

    // Fetch count of all customers
    const { count: totalCustomers, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Handle any errors
    if (dogsError || activeDogsError || littersError || activeLittersError || 
        puppiesError || availablePuppiesError || customersError) {
      console.error("Error fetching dashboard data:", { 
        dogsError, activeDogsError, littersError, activeLittersError,
        puppiesError, availablePuppiesError, customersError 
      });
    }

    return {
      totalDogs: totalDogs || 0,
      activeDogs: activeDogs || 0,
      totalLitters: totalLitters || 0,
      activeLitters: activeLitters || 0,
      totalPuppies: totalPuppies || 0,
      availablePuppies: availablePuppies || 0,
      totalCustomers: totalCustomers || 0,
    };
  } catch (error) {
    console.error("Error in fetchDashboardData:", error);
    // Return default values in case of error
    return {
      totalDogs: 0,
      activeDogs: 0,
      totalLitters: 0,
      activeLitters: 0,
      totalPuppies: 0,
      availablePuppies: 0,
      totalCustomers: 0,
    };
  }
};

// Alias for fetchDashboardData to match the import in useDashboardData.tsx
export const fetchDashboardStats = fetchDashboardData;

// Fetch upcoming events for the dashboard
export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, event_date, status')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(5);
    
    if (error) {
      console.error("Error fetching upcoming events:", error);
      return [];
    }
    
    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.event_date,
      status: event.status === 'planned' ? 'planned' : 'upcoming'
    }));
  } catch (error) {
    console.error("Error in fetchUpcomingEvents:", error);
    return [];
  }
};

// Fetch recent activities for the dashboard
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('id, activity_type, title, description, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
    
    return (data || []).map(activity => ({
      id: activity.id,
      type: activity.activity_type,
      title: activity.title,
      description: activity.description,
      createdAt: activity.created_at
    }));
  } catch (error) {
    console.error("Error in fetchRecentActivities:", error);
    return [];
  }
};
