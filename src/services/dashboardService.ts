
import { supabase } from '@/integrations/supabase/client';

// Define types for dashboard data
export interface DashboardData {
  totalDogs: number;
  activeDogs: number;
  totalLitters: number;
  activeLitters: number;
  totalPuppies: number;
  availablePuppies: number;
  totalCustomers: number;
}

export interface DashboardStats extends DashboardData {}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

/**
 * Fetches dashboard statistics
 */
export const fetchDashboardStats = async (): Promise<DashboardData> => {
  try {
    // Fetch all statistics in parallel
    const [dogStats, litterStats, puppyStats, customerStats] = await Promise.all([
      fetchDogStats(),
      fetchLitterStats(),
      fetchPuppyStats(),
      fetchCustomerStats()
    ]);

    return {
      ...dogStats,
      ...litterStats,
      ...puppyStats,
      ...customerStats
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalDogs: 0,
      activeDogs: 0,
      totalLitters: 0,
      activeLitters: 0,
      totalPuppies: 0,
      availablePuppies: 0,
      totalCustomers: 0
    };
  }
};

/**
 * Fetches dog statistics
 */
const fetchDogStats = async (): Promise<{ totalDogs: number; activeDogs: number }> => {
  // Get total dogs count
  const { count: totalDogs, error: dogsError } = await supabase
    .from('dogs')
    .select('*', { count: 'exact', head: true });

  // Get active dogs count (no death_date)
  const { count: activeDogs, error: activeDogsError } = await supabase
    .from('dogs')
    .select('*', { count: 'exact', head: true })
    .is('death_date', null);

  if (dogsError || activeDogsError) {
    console.error('Error fetching dog stats:', dogsError || activeDogsError);
    return { totalDogs: 0, activeDogs: 0 };
  }

  return {
    totalDogs: totalDogs || 0,
    activeDogs: activeDogs || 0
  };
};

/**
 * Fetches litter statistics
 */
const fetchLitterStats = async (): Promise<{ totalLitters: number; activeLitters: number }> => {
  // Get total litters count
  const { count: totalLitters, error: littersError } = await supabase
    .from('litters')
    .select('*', { count: 'exact', head: true });

  // Get active litters count
  const { count: activeLitters, error: activeLittersError } = await supabase
    .from('litters')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  if (littersError || activeLittersError) {
    console.error('Error fetching litter stats:', littersError || activeLittersError);
    return { totalLitters: 0, activeLitters: 0 };
  }

  return {
    totalLitters: totalLitters || 0,
    activeLitters: activeLitters || 0
  };
};

/**
 * Fetches puppy statistics
 */
const fetchPuppyStats = async (): Promise<{ totalPuppies: number; availablePuppies: number }> => {
  // Get total puppies count
  const { count: totalPuppies, error: puppiesError } = await supabase
    .from('puppies')
    .select('*', { count: 'exact', head: true });

  // Get available puppies count
  const { count: availablePuppies, error: availablePuppiesError } = await supabase
    .from('puppies')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Available');

  if (puppiesError || availablePuppiesError) {
    console.error('Error fetching puppy stats:', puppiesError || availablePuppiesError);
    return { totalPuppies: 0, availablePuppies: 0 };
  }

  return {
    totalPuppies: totalPuppies || 0,
    availablePuppies: availablePuppies || 0
  };
};

/**
 * Fetches customer statistics
 */
const fetchCustomerStats = async (): Promise<{ totalCustomers: number }> => {
  // Get total customers count
  const { count: totalCustomers, error: customersError } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });

  if (customersError) {
    console.error('Error fetching customer stats:', customersError);
    return { totalCustomers: 0 };
  }

  return {
    totalCustomers: totalCustomers || 0
  };
};

/**
 * Fetches upcoming events for the dashboard
 */
export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, event_date, status')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(5);
      
    if (error) throw error;
    
    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: event.event_date,
      status: event.status
    }));
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

/**
 * Fetches recent activities for the dashboard
 */
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('id, activity_type, title, description, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    
    return data.map(activity => ({
      id: activity.id,
      type: activity.activity_type,
      title: activity.title,
      description: activity.description || '',
      createdAt: activity.created_at
    }));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};
