
import React from 'react';
import { format, parseISO } from 'date-fns';
import { UpcomingEvent } from '@/services/dashboardService';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UpcomingEventsProps {
  events: UpcomingEvent[] | any[];
  isLoading?: boolean;
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ 
  events, 
  isLoading = false,
  className 
}) => {
  // Get event type color
  const getEventTypeColor = (eventType: string) => {
    switch (eventType?.toLowerCase()) {
      case 'health':
      case 'vet':
      case 'vaccination':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'breeding':
      case 'heat':
      case 'mating':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'whelping':
      case 'birth':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'customer':
      case 'pickup':
      case 'delivery':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'show':
      case 'event':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };
  
  // Format a date string safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error, dateString);
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="flex items-center space-x-4">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle case when no events are available
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-lg">
        <Calendar className="w-10 h-10 mx-auto text-slate-400 mb-2" />
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">No Upcoming Events</h3>
        <p className="text-xs text-slate-500 mt-1">
          Events you schedule will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {events.map((event) => {
        // Safely extract event properties with fallbacks
        const id = event.id || `event-${Math.random()}`;
        const title = event.title || 'Untitled Event';
        const description = event.description || 'No description available';
        const date = event.event_date || event.date;
        const eventType = event.event_type || event.type || 'default';
        const typeColor = getEventTypeColor(eventType);
        
        return (
          <div 
            key={id}
            className="p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white dark:bg-slate-950 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900 dark:text-slate-200">
                {title}
              </h3>
              <Badge variant="outline" className={typeColor}>
                {eventType}
              </Badge>
            </div>
            
            {description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {description}
              </p>
            )}
            
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>{formatDate(date)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingEvents;
