
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  getDashboardStats,
  getUpcomingEvents,
  getRecentActivities
} from '@/services/dashboardService';
import { useAuth } from '@/contexts/AuthProvider';

export const useDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  
  // Dashboard stats query
  const statsQuery = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: 'Error fetching dashboard statistics',
          description: 'Please try again later',
          variant: 'destructive'
        });
      }
    }
  });

  // Upcoming events query
  const eventsQuery = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getUpcomingEvents,
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching upcoming events:', error);
        toast({
          title: 'Error fetching upcoming events',
          description: 'Please try again later',
          variant: 'destructive'
        });
      }
    }
  });

  // Recent activities query
  const activitiesQuery = useQuery({
    queryKey: ['recentActivities'],
    queryFn: getRecentActivities,
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching recent activities:', error);
        toast({
          title: 'Error fetching recent activities',
          description: 'Please try again later',
          variant: 'destructive'
        });
      }
    }
  });

  return {
    loading: authLoading || statsQuery.isLoading || eventsQuery.isLoading || activitiesQuery.isLoading,
    stats: statsQuery.data,
    events: eventsQuery.data || [],
    activities: activitiesQuery.data || [],
    isStatsLoading: statsQuery.isLoading,
    isEventsLoading: eventsQuery.isLoading,
    isActivitiesLoading: activitiesQuery.isLoading,
    refetch: {
      stats: statsQuery.refetch,
      events: eventsQuery.refetch,
      activities: activitiesQuery.refetch
    }
  };
};
