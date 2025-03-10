
import React from 'react';
import UpcomingEvents from './UpcomingEvents';
import RecentActivities from './RecentActivities';
import { Event, Activity } from '@/services/dashboardService';

interface MainContentProps {
  events: Event[];
  activities: Activity[];
  isEventsLoading: boolean;
  isActivitiesLoading: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  events,
  activities,
  isEventsLoading,
  isActivitiesLoading
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      {/* Upcoming Events Card */}
      <UpcomingEvents events={events} isLoading={isEventsLoading} />

      {/* Recent Activities Card */}
      <div className="h-full">
        <RecentActivities
          activities={activities}
          isLoading={isActivitiesLoading}
        />
      </div>
    </div>
  );
};

export default MainContent;
