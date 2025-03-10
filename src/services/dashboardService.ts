
import { supabase } from '@/integrations/supabase/client';

// Types to properly define the return structure
export interface DashboardStats {
  dogsCount: number;
  littersCount: number;
  reservationsCount: number;
  revenue: number;
}

export interface Event {
  id: string;
  breeder_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string;
  status: string;
  created_at: string;
}

export interface Activity {
  id: string;
  breeder_id: string;
  title: string;
  description: string | null;
  activity_type: string;
  created_at: string;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    // Use count option directly instead of selecting all records
    const { count: dogsCount, error: dogsError } = await supabase
      .from('dogs')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);
    
    if (dogsError) throw dogsError;
    
    const { count: littersCount, error: littersError } = await supabase
      .from('litters')
      .select('*', { count: 'exact', head: true })
      .eq('breeder_id', user.id);
    
    if (littersError) throw littersError;
    
    const { count: reservationsCount, error: reservationsError } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('breeder_id', user.id)
      .eq('status', 'Pending');
    
    if (reservationsError) throw reservationsError;
    
    // Get revenue for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('breeder_id', user.id)
      .eq('transaction_type', 'income')
      .gte('transaction_date', thirtyDaysAgo.toISOString().split('T')[0]);
    
    if (transactionsError) throw transactionsError;
    
    // Calculate revenue safely
    let revenue = 0;
    if (transactionsData && transactionsData.length > 0) {
      revenue = transactionsData.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    }

    return {
      dogsCount: dogsCount || 0,
      littersCount: littersCount || 0,
      reservationsCount: reservationsCount || 0,
      revenue
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get upcoming events
export const getUpcomingEvents = async (): Promise<Event[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('events')
      .select('id, breeder_id, title, description, event_date, event_type, status, created_at')
      .eq('breeder_id', user.id)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(4);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

// Get recent activities
export const getRecentActivities = async (): Promise<Activity[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('activities')
      .select('id, breeder_id, title, description, activity_type, created_at')
      .eq('breeder_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

// Log a new activity
export const logActivity = async (title: string, description: string, activityType: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('activities')
    .insert([
      {
        breeder_id: user.id,
        title,
        description,
        activity_type: activityType
      }
    ]);

  if (error) throw error;
  return data;
};

// Create a new event
export const createEvent = async (
  title: string,
  description: string,
  eventDate: string,
  eventType: string,
  status: string = 'planned'
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        breeder_id: user.id,
        title,
        description,
        event_date: eventDate,
        event_type: eventType,
        status
      }
    ]);

  if (error) throw error;
  return data;
};
