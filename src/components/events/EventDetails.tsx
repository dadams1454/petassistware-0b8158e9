
import React from 'react';
import { Button } from '@/components/ui/button';
import { Event, EVENT_COLORS } from '@/pages/Calendar';
import { format, parseISO } from 'date-fns';
import { Edit, Trash2, Calendar, RotateCcw } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onEdit, onDelete }) => {
  // Function to get color styling for an event type
  const getEventTypeStyle = (eventType: string) => {
    return EVENT_COLORS[eventType] || EVENT_COLORS['Other'];
  };

  // Format recurrence pattern for display
  const formatRecurrencePattern = (pattern: string | null) => {
    if (!pattern) return 'None';
    
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

  const { bg, text } = getEventTypeStyle(event.event_type);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
        {event.description && (
          <p className="text-muted-foreground">{event.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(parseISO(event.event_date), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
              {event.event_type}
            </span>
          </div>
          
          <div>
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
        </div>

        {event.is_recurring && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Recurring Event</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Recurs: {formatRecurrencePattern(event.recurrence_pattern)}
            </p>
            {event.recurrence_end_date && (
              <p className="text-sm text-muted-foreground">
                Until: {format(parseISO(event.recurrence_end_date), 'MMMM d, yyyy')}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
