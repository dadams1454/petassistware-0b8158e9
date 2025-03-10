
import { supabase } from '@/integrations/supabase/client';

// Define types for dashboard data
export interface DashboardStats {
  dogCount: number;
  litterCount: number;
  reservationCount: number;
  recentRevenue: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  status: 'upcoming' | 'planned';
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

// Function to fetch dashboard statistics
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch dog count
    const { count: dogCount, error: dogError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true });
    
    if (dogError) throw dogError;

    // Fetch litter count
    const { count: litterCount, error: litterError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true });
    
    if (litterError) throw litterError;

    // Fetch reservation count
    const { count: reservationCount, error: reservationError } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });
    
    if (reservationError) throw reservationError;

    // Calculate revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentTransactions, error: transactionError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', thirtyDaysAgo.toISOString().split('T')[0]);
    
    if (transactionError) throw transactionError;
    
    const recentRevenue = recentTransactions?.reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0) || 0;

    return {
      dogCount: dogCount || 0,
      litterCount: litterCount || 0,
      reservationCount: reservationCount || 0,
      recentRevenue
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if there's an error
    return {
      dogCount: 0,
      litterCount: 0,
      reservationCount: 0,
      recentRevenue: 0
    };
  }
};

// Function to fetch upcoming events
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
    
    // Map the data to match the UpcomingEvent interface
    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.event_date,
      status: event.status === 'upcoming' ? 'upcoming' : 'planned'
    }));
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

// Function to fetch recent activities
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('id, activity_type, title, description, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    // Map the data to match the RecentActivity interface
    return (data || []).map(activity => ({
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
