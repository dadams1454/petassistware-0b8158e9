
import { DashboardData, UpcomingEvent, RecentActivity } from './types';

// Helper function for mock dashboard stats
export function getMockDashboardStats(): DashboardData {
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
export function getMockActivities(): RecentActivity[] {
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
export function getMockEvents(): UpcomingEvent[] {
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
