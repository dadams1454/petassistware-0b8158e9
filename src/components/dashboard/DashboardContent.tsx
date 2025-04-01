
import React from 'react';
import DashboardOverview from './DashboardOverview';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import DashboardTabs from './DashboardTabs';
import GenerateTestDataButton from './GenerateTestDataButton';
import KennelAssignmentsWidget from './widgets/KennelAssignmentsWidget';

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <UpcomingEvents />
        <RecentActivities />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KennelAssignmentsWidget />
        <QuickActions />
      </div>
      
      <DashboardTabs />
      
      {process.env.NODE_ENV === 'development' && (
        <GenerateTestDataButton />
      )}
    </div>
  );
};

export default DashboardContent;
