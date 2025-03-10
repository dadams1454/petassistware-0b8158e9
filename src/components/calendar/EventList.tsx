
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { CalendarIcon, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { Event, EVENT_COLORS } from '@/pages/Calendar';

interface EventListProps {
  selectedDate: Date | undefined;
  eventsOnSelectedDate: Event[];
  activeFilters: string[];
  isLoading: boolean;
  onEventClick: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({
  selectedDate,
  eventsOnSelectedDate,
  activeFilters,
  isLoading,
  onEventClick
}) => {
  // Function to get color styling for an event type
  const getEventTypeStyle = (eventType: string) => {
    return EVENT_COLORS[eventType] || EVENT_COLORS['Other'];
  };

  // Format recurrence pattern for display
  const formatRecurrencePattern = (pattern: string) => {
    const patterns: Record<string, string> = {
      'daily': 'Daily',
      'weekly': 'Weekly',
      'biweekly': 'Every two weeks',
      'monthly': 'Monthly',
      'quarterly': 'Every three months',
      'yearly': 'Yearly'
    };
    return patterns[pattern] || pattern;
  };

  return (
    <DashboardCard 
      className="md:col-span-2"
      title={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
      icon={<CalendarIcon size={18} />}
    >
      {activeFilters.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          No event types selected. Use the filter to display events.
        </div>
      ) : isLoading ? (
        <div className="py-4 text-center">Loading events...</div>
      ) : eventsOnSelectedDate.length > 0 ? (
        <div className="space-y-3">
          {eventsOnSelectedDate.map(event => {
            const { bg, text } = getEventTypeStyle(event.event_type);
            return (
              <div 
                key={event.id}
                className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{event.title}</h3>
                      {event.is_recurring && (
                        <Repeat size={16} className="text-slate-400" aria-label="Recurring Event" />
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                    )}
                    {event.is_recurring && (
                      <p className="text-xs text-slate-500 mt-1">
                        Recurs: {formatRecurrencePattern(event.recurrence_pattern || 'none')}
                      </p>
                    )}
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    event.status === 'upcoming' 
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                      : event.status === 'completed'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : event.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                    {event.event_type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500">
          No events scheduled for this day
        </div>
      )}
    </DashboardCard>
  );
};

export default EventList;
