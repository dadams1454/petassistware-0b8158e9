
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Event, EVENT_COLORS } from '@/pages/Calendar';
import { Calendar, Pencil, Trash2 } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onEdit, onDelete }) => {
  // Get the color styling for the event type
  const getEventTypeStyle = (eventType: string) => {
    return EVENT_COLORS[eventType] || EVENT_COLORS['Other'];
  };

  const { bg, text } = getEventTypeStyle(event.event_type);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500">Title</h3>
          <p className="text-base">{event.title}</p>
        </div>

        {event.description && (
          <div>
            <h3 className="text-sm font-medium text-slate-500">Description</h3>
            <p className="text-base">{event.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Date</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <p className="text-base">
                {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-500">Type</h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
              {event.event_type}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500">Status</h3>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            event.status === 'upcoming' 
              ? 'bg-amber-50 text-amber-700' 
              : event.status === 'completed'
                ? 'bg-green-50 text-green-700'
                : event.status === 'cancelled'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
