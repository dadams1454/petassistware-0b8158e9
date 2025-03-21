
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchDashboardStats, 
  fetchUpcomingEvents, 
  fetchRecentActivities,
  DashboardStats,
  UpcomingEvent,
  RecentActivity
} from '@/services/dashboardService';

export const useDashboardData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    dogCount: 0,
    litterCount: 0,
    reservationCount: 0,
    recentRevenue: 0
  });
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const initialLoadComplete = useRef(false);

  const loadDashboardData = useCallback(async () => {
    if (!initialLoadComplete.current) {
      setIsLoading(true);
    }
    
    try {
      // Fetch all data in parallel
      const [dashboardStats, upcomingEvents, recentActivities] = await Promise.all([
        fetchDashboardStats(),
        fetchUpcomingEvents(),
        fetchRecentActivities()
      ]);

      // Use functional updates to prevent unnecessary re-renders
      setStats(prev => ({...prev, ...dashboardStats}));
      setEvents(prev => upcomingEvents.length > 0 ? upcomingEvents : prev);
      setActivities(prev => recentActivities.length > 0 ? recentActivities : prev);
      initialLoadComplete.current = true;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (!initialLoadComplete.current) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Mock activities if none are found only on initial load
  useEffect(() => {
    if (!isLoading && activities.length === 0 && initialLoadComplete.current) {
      const mockActivities: RecentActivity[] = [
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
      setActivities(mockActivities);
    }
  }, [isLoading, activities.length]);

  // Mock events if none are found only on initial load
  useEffect(() => {
    if (!isLoading && events.length === 0 && initialLoadComplete.current) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const feb15 = new Date(today.getFullYear(), 1, 15);
      const feb18 = new Date(today.getFullYear(), 1, 18);
      
      const mockEvents: UpcomingEvent[] = [
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
      setEvents(mockEvents);
    }
  }, [isLoading, events.length]);

  return {
    isLoading,
    stats,
    events,
    activities,
    refreshData: loadDashboardData
  };
};
