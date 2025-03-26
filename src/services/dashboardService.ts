
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
    console.log('Fetching dashboard stats...');
    // Fetch all statistics in parallel
    const [dogStats, litterStats, puppyStats, customerStats] = await Promise.all([
      fetchDogStats(),
      fetchLitterStats(),
      fetchPuppyStats(),
      fetchCustomerStats()
    ]);

    console.log('Stats fetched:', { dogStats, litterStats, puppyStats, customerStats });
    
    return {
      ...dogStats,
      ...litterStats,
      ...puppyStats,
      ...customerStats
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if there's an error
    return getMockDashboardStats();
  }
};

/**
 * Fetches dog statistics
 */
const fetchDogStats = async (): Promise<{ totalDogs: number; activeDogs: number }> => {
  try {
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
  } catch (error) {
    console.error('Error in fetchDogStats:', error);
    return { totalDogs: 0, activeDogs: 0 };
  }
};

/**
 * Fetches litter statistics
 */
const fetchLitterStats = async (): Promise<{ totalLitters: number; activeLitters: number }> => {
  try {
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
  } catch (error) {
    console.error('Error in fetchLitterStats:', error);
    return { totalLitters: 0, activeLitters: 0 };
  }
};

/**
 * Fetches puppy statistics
 */
const fetchPuppyStats = async (): Promise<{ totalPuppies: number; availablePuppies: number }> => {
  try {
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
  } catch (error) {
    console.error('Error in fetchPuppyStats:', error);
    return { totalPuppies: 0, availablePuppies: 0 };
  }
};

/**
 * Fetches customer statistics
 */
const fetchCustomerStats = async (): Promise<{ totalCustomers: number }> => {
  try {
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
  } catch (error) {
    console.error('Error in fetchCustomerStats:', error);
    return { totalCustomers: 0 };
  }
};

/**
 * Fetches upcoming events for the dashboard
 */
export const fetchUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
  try {
    console.log('Fetching upcoming events...');
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, event_date, status')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(5);
      
    if (error) {
      console.error('Error fetching upcoming events:', error);
      return getMockEvents();
    }
    
    if (data && data.length > 0) {
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.event_date,
        status: event.status
      }));
    } else {
      console.log('No events found, returning mock data');
      return getMockEvents();
    }
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return getMockEvents();
  }
};

/**
 * Fetches recent activities for the dashboard
 */
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    console.log('Fetching recent activities...');
    const { data, error } = await supabase
      .from('activities')
      .select('id, activity_type, title, description, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) {
      console.error('Error fetching recent activities:', error);
      return getMockActivities();
    }
    
    if (data && data.length > 0) {
      return data.map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        title: activity.title,
        description: activity.description || '',
        createdAt: activity.created_at
      }));
    } else {
      console.log('No activities found, returning mock data');
      return getMockActivities();
    }
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return getMockActivities();
  }
};

// Helper function for mock dashboard stats
function getMockDashboardStats(): DashboardData {
  return {
    totalDogs: 12,
    activeDogs: 10,
    totalLitters: 5,
    activeLitters: 2,
    totalPuppies: 24,
    availablePuppies: 8,
    totalCustomers: 18
  };
}

// Helper function for mock activities
function getMockActivities(): RecentActivity[] {
  return [
    {
      id: '1',
      type: 'litter',
      title: 'New litter registered',
      description: 'Newfoundland litter with 6 puppies',
      createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
      id: '2',
      type: 'sale',
      title: 'Puppy reservation confirmed',
      description: 'Male puppy #3 reserved by John Smith',
      createdAt: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
    },
    {
      id: '3',
      type: 'health',
      title: 'Vaccinations updated',
      description: 'Bella (dam) received annual vaccinations',
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment received',
      description: '$500 deposit for puppy reservation',
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: '5',
      type: 'document',
      title: 'Contract generated',
      description: 'Sale contract for Max (male, 10 weeks)',
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];
}

// Helper function for mock events
function getMockEvents(): UpcomingEvent[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);
  
  return [
    {
      id: '1',
      title: 'Veterinary Appointment',
      description: 'Max - Annual checkup and vaccinations',
      date: today.toISOString().split('T')[0],
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Puppy Photoshoot',
      description: 'Newfoundland litter (3 weeks old)',
      date: tomorrow.toISOString().split('T')[0],
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Expected Heat Cycle',
      description: 'Bella - Monitor for breeding readiness',
      date: nextWeek.toISOString().split('T')[0],
      status: 'planned'
    },
    {
      id: '4',
      title: 'Puppy Go-Home Day',
      description: 'Newfoundland litter - 3 puppies scheduled for pickup',
      date: nextMonth.toISOString().split('T')[0],
      status: 'planned'
    }
  ];
}
