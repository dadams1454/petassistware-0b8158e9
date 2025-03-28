
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { format } from 'date-fns';

interface CalendarSidebarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  eventDates: Date[];
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ 
  selectedDate, 
  setSelectedDate, 
  eventDates 
}) => {
  return (
    <DashboardCard className="md:col-span-1" noPadding={false}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="w-full pointer-events-auto"
        modifiers={{
          hasEvent: (date) => 
            eventDates.some(eventDate => 
              eventDate.getDate() === date.getDate() && 
              eventDate.getMonth() === date.getMonth() && 
              eventDate.getFullYear() === date.getFullYear()
            )
        }}
        modifiersStyles={{
          hasEvent: {
            fontWeight: 'bold',
            backgroundColor: 'rgb(243 244 246)',
            color: 'rgb(79 70 229)'
          }
        }}
      />
    </DashboardCard>
  );
};

export default CalendarSidebar;
