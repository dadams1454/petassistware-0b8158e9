
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { CustomButton } from '@/components/ui/custom-button';
import BlurBackground from '@/components/ui/blur-background';
import { 
  Dog, Users, Calendar, PawPrint, DollarSign, 
  PlusCircle, BarChart3, ChevronRight, File
} from 'lucide-react';

const Dashboard: React.FC = () => {
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
            >
              New Litter
            </CustomButton>
            <CustomButton 
              variant="outline" 
              size="sm" 
              icon={<PlusCircle size={16} />}
            >
              Add Dog
            </CustomButton>
            <CustomButton 
              variant="outline" 
              size="sm" 
              icon={<File size={16} />}
            >
              Create Contract
            </CustomButton>
          </div>
        </div>
      </BlurBackground>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-8">
        <StatCard
          title="Active Dogs"
          value="12"
          icon={<Dog size={18} />}
          change={8.5}
          changeText="vs last month"
          trend="up"
        />
        <StatCard
          title="Current Litters"
          value="2"
          icon={<PawPrint size={18} />}
          change={0}
          changeText="same as last month"
          trend="neutral"
        />
        <StatCard
          title="Reservations"
          value="8"
          icon={<Users size={18} />}
          change={33}
          changeText="vs last month"
          trend="up"
        />
        <StatCard
          title="Revenue (Last 30 Days)"
          value="$4,500"
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
          <div className="space-y-4">
            {[
              { date: 'Today', title: 'Veterinary Appointment', description: 'Max - Annual checkup and vaccinations', status: 'upcoming' },
              { date: 'Tomorrow', title: 'Puppy Photoshoot', description: 'Golden Retriever litter (3 weeks old)', status: 'upcoming' },
              { date: 'Feb 15', title: 'Expected Heat Cycle', description: 'Bella - Monitor for breeding readiness', status: 'planned' },
              { date: 'Feb 18', title: 'Puppy Go-Home Day', description: 'Labrador litter - 3 puppies scheduled for pickup', status: 'planned' },
            ].map((event, index) => (
              <div 
                key={index} 
                className="flex items-start p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="min-w-[70px] text-sm font-medium text-primary">
                  {event.date}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {event.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {event.description}
                  </p>
                </div>
                <div className="ml-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    event.status === 'upcoming' 
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {event.status === 'upcoming' ? 'Soon' : 'Planned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <CustomButton 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              icon={<ChevronRight size={16} />}
              iconPosition="right"
            >
              View Calendar
            </CustomButton>
          </div>
        </DashboardCard>

        {/* Recent Activities Card */}
        <DashboardCard className="h-full">
          <RecentActivities />
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
