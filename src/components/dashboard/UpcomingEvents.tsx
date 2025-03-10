
import React from 'react';
import { Calendar, ChevronRight, Loader2, PlusCircle } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { CustomButton } from '@/components/ui/custom-button';
import { Event } from '@/services/dashboardService';

interface UpcomingEventsProps {
  events: Event[];
  isLoading: boolean;
}

const formatEventDate = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, isLoading }) => {
  return (
    <DashboardCard
      title="Upcoming Events"
      icon={<Calendar size={18} />}
      className="xl:col-span-2"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-2">No upcoming events</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
            Schedule events to keep track of important dates
          </p>
          <CustomButton 
            variant="outline" 
            size="sm" 
            icon={<PlusCircle size={16} />}
          >
            Add Event
          </CustomButton>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="flex items-start p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="min-w-[70px] text-sm font-medium text-primary">
                {formatEventDate(event.event_date)}
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
      )}
      
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
  );
};

export default UpcomingEvents;
