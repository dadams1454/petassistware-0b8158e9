
import React from 'react';
import DashboardOverview from './DashboardOverview';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import DashboardTabs from './DashboardTabs';
import GenerateTestDataButton from './GenerateTestDataButton';
import KennelAssignmentsWidget from './widgets/KennelAssignmentsWidget';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboard/types';

interface DashboardContentProps {
  isLoading?: boolean;
  stats?: DashboardData;
  events?: UpcomingEvent[];
  activities?: RecentActivity[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  isLoading = false,
  stats = {
    totalDogs: 0,
    activeDogs: 0,
    totalLitters: 0,
    activeLitters: 0,
    totalPuppies: 0,
    availablePuppies: 0,
    totalCustomers: 0
  },
  events = [],
  activities = []
}) => {
  return (
    <div className="space-y-6">
      <DashboardOverview 
        data={stats}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <UpcomingEvents events={events} isLoading={isLoading} />
        <RecentActivities activities={activities} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KennelAssignmentsWidget />
        <QuickActions onCareLogClick={() => {}} />
      </div>
      
      <DashboardTabs />
      
      {process.env.NODE_ENV === 'development' && (
        <GenerateTestDataButton />
      )}
    </div>
  );
};

export default DashboardContent;
