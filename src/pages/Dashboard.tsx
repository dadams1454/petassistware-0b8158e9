
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatCard from '@/components/dashboard/StatCard';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { CustomButton } from '@/components/ui/custom-button';
import BlurBackground from '@/components/ui/blur-background';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dog, Users, Calendar, PawPrint, DollarSign, 
  PlusCircle, BarChart3, ChevronRight, File,
  UtensilsCrossed
} from 'lucide-react';
import { 
  fetchDashboardStats, 
  fetchUpcomingEvents, 
  fetchRecentActivities,
  DashboardStats,
  UpcomingEvent,
  RecentActivity
} from '@/services/dashboardService';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    dogCount: 0,
    litterCount: 0,
    reservationCount: 0,
    recentRevenue: 0
  });
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [dashboardStats, upcomingEvents, recentActivities] = await Promise.all([
          fetchDashboardStats(),
          fetchUpcomingEvents(),
          fetchRecentActivities()
        ]);

        setStats(dashboardStats);
        setEvents(upcomingEvents);
        setActivities(recentActivities);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  // Quick action handlers
  const handleNewLitter = () => {
    // Navigate to the litters page with a query param to open the add dialog
    navigate('/litters?action=add');
    toast({
      title: "New Litter",
      description: "Redirecting to create a new litter...",
    });
  };

  const handleAddDog = () => {
    // Navigate to dogs page with a query param to open the add dialog
    navigate('/dogs?action=add');
    toast({
      title: "Add Dog",
      description: "Redirecting to add a new dog...",
    });
  };

  const handleCreateContract = () => {
    // Navigate to documents page with a query param to open the contract creator
    navigate('/documents?action=create-contract');
    toast({
      title: "Create Contract",
      description: "Redirecting to contract creation...",
    });
  };

  const handleCreateEvent = () => {
    // Navigate to calendar page with a query param to create an event
    navigate('/calendar?action=create');
    toast({
      title: "Create Event",
      description: "Redirecting to create a new event...",
    });
  };

  // Mock activities if none are found in the database
  useEffect(() => {
    if (!isLoading && activities.length === 0) {
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
  }, [isLoading, activities]);

  // Mock events if none are found in the database
  useEffect(() => {
    if (!isLoading && events.length === 0) {
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
  }, [isLoading, events]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Welcome back! Here's an overview of your breeding program.
        </p>
      </div>

      {/* Quick Actions */}
      <BlurBackground
        className="p-4 sm:p-6 rounded-xl mb-8 overflow-hidden relative"
        intensity="md"
        opacity="light"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-[-1]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              Quick Actions
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Frequently used features for your daily operations
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <CustomButton 
              variant="primary" 
              size="sm" 
              icon={<PlusCircle size={16} />}
              onClick={handleNewLitter}
            >
              New Litter
            </CustomButton>
            <CustomButton 
              variant="outline" 
              size="sm" 
              icon={<PlusCircle size={16} />}
              onClick={handleAddDog}
            >
              Add Dog
            </CustomButton>
            <CustomButton 
              variant="outline" 
              size="sm" 
              icon={<File size={16} />}
              onClick={handleCreateContract}
            >
              Create Contract
            </CustomButton>
            <CustomButton 
              variant="outline" 
              size="sm" 
              icon={<Calendar size={16} />}
              onClick={handleCreateEvent}
            >
              Add Event
            </CustomButton>
          </div>
        </div>
      </BlurBackground>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-8">
        <StatCard
          title="Active Dogs"
          value={isLoading ? "Loading..." : stats.dogCount.toString()}
          icon={<Dog size={18} />}
          change={8.5}
          changeText="vs last month"
          trend="up"
        />
        <StatCard
          title="Current Litters"
          value={isLoading ? "Loading..." : stats.litterCount.toString()}
          icon={<PawPrint size={18} />}
          change={0}
          changeText="same as last month"
          trend="neutral"
        />
        <StatCard
          title="Reservations"
          value={isLoading ? "Loading..." : stats.reservationCount.toString()}
          icon={<Users size={18} />}
          change={33}
          changeText="vs last month"
          trend="up"
        />
        <StatCard
          title="Revenue (Last 30 Days)"
          value={isLoading ? "Loading..." : `$${stats.recentRevenue.toLocaleString()}`}
          icon={<DollarSign size={18} />}
          change={12.3}
          changeText="vs previous period"
          trend="up"
          textColor="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Events Card */}
        <DashboardCard
          title="Upcoming Events"
          icon={<Calendar size={18} />}
          className="xl:col-span-2"
        >
          <UpcomingEvents events={events} isLoading={isLoading} />
        </DashboardCard>

        {/* Recent Activities Card */}
        <DashboardCard className="h-full">
          <RecentActivities activities={activities} isLoading={isLoading} />
        </DashboardCard>
      </div>

      {/* Breeding Analytics Card */}
      <DashboardCard
        title="Breeding Analytics"
        subtitle="Overview of your breeding program performance"
        icon={<BarChart3 size={18} />}
      >
        <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Breeding statistics and charts will appear here
          </p>
        </div>
      </DashboardCard>
    </MainLayout>
  );
};

export default Dashboard;
