
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchDashboardStats, 
  fetchUpcomingEvents, 
  fetchRecentActivities,
  DashboardData,
  UpcomingEvent,
  RecentActivity
} from '@/services/dashboardService';
import { useRefreshData } from '@/hooks/useRefreshData';

export const useDashboardData = () => {
  const { toast } = useToast();

  // Function to fetch dashboard data that can be called by the RefreshContext
  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch all data in parallel
      const [dashboardStats, upcomingEvents, recentActivities] = await Promise.all([
        fetchDashboardStats(),
        fetchUpcomingEvents(),
        fetchRecentActivities()
      ]);

      // Check for mock data needs
      const finalActivities = recentActivities.length === 0 
        ? getMockActivities() 
        : recentActivities;
        
      const finalEvents = upcomingEvents.length === 0
        ? getMockEvents()
        : upcomingEvents;

      return { 
        stats: dashboardStats, 
        events: finalEvents, 
        activities: finalActivities 
      };
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Use the useRefreshData hook to manage dashboard data
  const { 
    data, 
    isLoading, 
    error 
  } = useRefreshData({
    key: 'dashboardData',
    fetchData: fetchDashboardData,
    loadOnMount: true
  });

  // Extract and provide default values
  const stats = data?.stats || {
    totalDogs: 0,
    totalLitters: 0,
    activeDogs: 0,
    activeLitters: 0,
    totalPuppies: 0,
    availablePuppies: 0,
    totalCustomers: 0
  };
  
  const events = data?.events || [];
  const activities = data?.activities || [];

  return {
    isLoading,
    error,
    stats,
    events,
    activities
  };
};

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
  
  const feb15 = new Date(today.getFullYear(), 1, 15);
  const feb18 = new Date(today.getFullYear(), 1, 18);
  
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
      date: feb15.toISOString().split('T')[0],
      status: 'planned'
    },
    {
      id: '4',
      title: 'Puppy Go-Home Day',
      description: 'Newfoundland litter - 3 puppies scheduled for pickup',
      date: feb18.toISOString().split('T')[0],
      status: 'planned'
    }
  ];
}
