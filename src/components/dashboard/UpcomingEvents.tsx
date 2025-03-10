
import React from 'react';
import { UpcomingEvent } from '@/services/dashboardService';
import { CustomButton } from '@/components/ui/custom-button';
import { ChevronRight } from 'lucide-react';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  isLoading?: boolean;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-start p-3 animate-pulse">
            <div className="min-w-[70px] h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="flex-1 ml-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No upcoming events scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="flex items-start p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="min-w-[70px] text-sm font-medium text-primary">
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {event.title}
            </h4>
            {event.description && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {event.description}
              </p>
            )}
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
    </div>
  );
};

export default UpcomingEvents;
