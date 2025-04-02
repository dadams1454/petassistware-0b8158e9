
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import EventList from '@/components/calendar/EventList';
import { Event, NewEvent, EVENT_TYPES } from '@/types/events';

// Export the types for other components to use
export type { Event, NewEvent };
export { EVENT_TYPES };

const Calendar: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Calendar"
          subtitle="Manage your schedule and events"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Calendar will go here */}
            <div className="bg-card rounded-lg border p-4 h-[600px]">
              <EventList />
            </div>
          </div>
          
          <div>
            <CalendarSidebar />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Calendar;
