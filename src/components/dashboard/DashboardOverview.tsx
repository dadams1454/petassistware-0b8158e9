
import React, { useEffect, useState } from 'react';
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
  stats: DashboardStats;
  events: UpcomingEvent[];
  activities: RecentActivity[];
  onCareLogClick: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  isLoading,
  stats,
  events,
  activities,
  onCareLogClick
}) => {
  return (
    <>
      {/* Quick Actions */}
      <QuickActions onCareLogClick={onCareLogClick} />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-8">
        <StatCard
          title="Active Dogs"
          value={isLoading ? "Loading..." : stats.dogCount.toString()}
          icon={<Dog size={18} />}
          change={0}
          changeText="from database"
          trend="neutral"
          linkTo="/dogs"
        />
        <StatCard
          title="Current Litters"
          value={isLoading ? "Loading..." : stats.litterCount.toString()}
          icon={<PawPrint size={18} />}
          change={0}
          changeText="from database"
          trend="neutral"
          linkTo="/litters"
        />
        <StatCard
          title="Reservations"
          value={isLoading ? "Loading..." : stats.reservationCount.toString()}
          icon={<Users size={18} />}
          change={0}
          changeText="from database"
          trend="neutral"
          linkTo="/customers"
        />
        <StatCard
          title="Revenue (Last 30 Days)"
          value={isLoading ? "Loading..." : `$${stats.recentRevenue.toLocaleString()}`}
          icon={<DollarSign size={18} />}
          change={0}
          changeText="from database"
          trend="neutral"
          textColor="text-emerald-600 dark:text-emerald-400"
          linkTo="/customers"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Events Card */}
        <DashboardCard
          title="Upcoming Events"
          icon={<Calendar size={18} />}
          className="xl:col-span-2"
          actions={
            <Link to="/calendar" className="text-sm text-primary flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          }
        >
          <UpcomingEvents events={events} isLoading={isLoading} />
        </DashboardCard>

        {/* Recent Activities Card */}
        <DashboardCard className="h-full">
          <RecentActivities activities={activities} isLoading={isLoading} />
        </DashboardCard>
      </div>

      {/* Breeding Analytics */}
      <BreedingAnalytics />
    </>
  );
};

export default DashboardOverview;
