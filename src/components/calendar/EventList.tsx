
import React from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { Event } from '@/pages/Calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Tag } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
  selectedDate?: Date;
  showDateHeaders?: boolean;
}

const StatusColors = {
  planned: "bg-blue-100 text-blue-800 border-blue-200",
  upcoming: "bg-orange-100 text-orange-800 border-orange-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200"
};

const EventList: React.FC<EventListProps> = ({ 
  events, 
  onEventClick, 
  selectedDate,
  showDateHeaders = false 
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No events found</p>
        {selectedDate && (
          <p className="text-sm text-muted-foreground mt-1">
            Try selecting another date or clearing filters
          </p>
        )}
      </div>
    );
  }

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  // Group events by date if showing date headers
  const groupedEvents = showDateHeaders
    ? sortedEvents.reduce((groups, event) => {
        const date = event.event_date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(event);
        return groups;
      }, {} as Record<string, Event[]>)
    : { '': sortedEvents };

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date} className="space-y-2">
          {showDateHeaders && date && (
            <h3 className="text-sm font-medium text-muted-foreground pt-2 pb-1">
              {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
            </h3>
          )}
          
          {dateEvents.map(event => (
            <Card 
              key={event.id}
              className={`cursor-pointer hover:bg-accent/50 transition-colors border-l-4 ${StatusColors[event.status]}`}
              onClick={() => onEventClick(event.id)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(parseISO(event.event_date), 'MMM d, yyyy')}
                      </div>
                      
                      <div className="flex items-center">
                        <Tag className="mr-1 h-4 w-4" />
                        {event.event_type}
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={StatusColors[event.status].replace("border-", "")}>
                    {event.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EventList;
