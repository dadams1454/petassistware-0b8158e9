
import { supabase } from '@/integrations/supabase/client';

// Get dashboard statistics
export const getDashboardStats = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  // Get dogs count
  const { count: dogsCount, error: dogsError } = await supabase
    .from('dogs')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id);

  if (dogsError) throw dogsError;

  // Get active litters count
  const { count: littersCount, error: littersError } = await supabase
    .from('litters')
    .select('*', { count: 'exact', head: true });

  if (littersError) throw littersError;

  // Get reservations count
  const { count: reservationsCount, error: reservationsError } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pending');

  if (reservationsError) throw reservationsError;

  // Get revenue for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('transaction_type', 'income')
    .gte('transaction_date', thirtyDaysAgo.toISOString().split('T')[0]);

  if (transactionsError) throw transactionsError;

  const revenue = transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  return {
    dogsCount: dogsCount || 0,
    littersCount: littersCount || 0,
    reservationsCount: reservationsCount || 0,
    revenue
  };
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('breeder_id', user.id)
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(4);

  if (error) throw error;
  return data;
};

// Get recent activities
export const getRecentActivities = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('breeder_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};

// Log a new activity
export const logActivity = async (title: string, description: string, activityType: string) => {
  const user = (await supabase.auth.getUser()).data.user;
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
  const user = (await supabase.auth.getUser()).data.user;
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
