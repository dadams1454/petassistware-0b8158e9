
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import StatCard from './StatCard';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import BreedingAnalytics from '@/components/analytics/BreedingAnalytics';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import { Dog, Users, PawPrint, DollarSign } from 'lucide-react';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';

interface DashboardOverviewProps {
  isLoading: boolean;
  stats: DashboardStats | null;
  events: UpcomingEvent[] | any[];
  activities: RecentActivity[] | any[];
  onCareLogClick: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  isLoading,
  stats,
  events,
  activities,
  onCareLogClick
}) => {
  // Set default values to avoid null reference errors
  const safeStats = stats || {
    dogCount: 0,
    litterCount: 0,
    reservationCount: 0,
    recentRevenue: 0
  };
  
  return (
    <>
      {/* Quick Actions */}
      <QuickActions onCareLogClick={onCareLogClick} />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-8">
        <StatCard
          title="Active Dogs"
          value={isLoading ? "Loading..." : safeStats.dogCount.toString()}
          icon={<Dog size={18} className="text-blue-600" />}
          change={0}
          changeText="from database"
          trend="neutral"
          linkTo="/dogs"
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Current Litters"
          value={isLoading ? "Loading..." : safeStats.litterCount.toString()}
          icon={<PawPrint size={18} className="text-purple-600" />}
          change={0}
          changeText="from database"
          trend="neutral"
          linkTo="/litters"
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Reservations"
          value={isLoading ? "Loading..." : safeStats.reservationCount.toString()}
          icon={<Users size={18} className="text-amber-600" />}
          change={0}
          changeText="from database"
          trend="neutral"
          linkTo="/customers"
          className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 shadow-sm hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Revenue (Last 30 Days)"
          value={isLoading ? "Loading..." : `$${safeStats.recentRevenue.toLocaleString()}`}
          icon={<DollarSign size={18} className="text-emerald-600" />}
          change={0}
          changeText="from database"
          trend="neutral"
          textColor="text-emerald-600 dark:text-emerald-400"
          linkTo="/customers"
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 shadow-sm hover:shadow-md transition-shadow"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Events Card */}
        <DashboardCard
          title="Upcoming Events"
          icon={<Calendar size={18} className="text-indigo-500" />}
          className="xl:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          actions={
            <Link to="/calendar" className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          }
        >
          <UpcomingEvents events={events} isLoading={isLoading} />
        </DashboardCard>

        {/* Recent Activities Card */}
        <DashboardCard className="h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <RecentActivities activities={activities} isLoading={isLoading} />
        </DashboardCard>
      </div>

      {/* Breeding Analytics */}
      <BreedingAnalytics />
    </>
  );
};

export default DashboardOverview;
