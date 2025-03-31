
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Tag, CheckSquare, RotateCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/pages/Calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface EventDetailsProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

const StatusColors = {
  planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  upcoming: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const EventDetails: React.FC<EventDetailsProps> = ({ event, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{event.title}</h2>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={StatusColors[event.status]}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
          
          <Badge variant="secondary">
            {event.event_type}
          </Badge>
          
          {event.is_recurring && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              Recurring
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Date</div>
                <div>{format(new Date(event.event_date), 'MMMM d, yyyy')}</div>
              </div>
            </div>
            
            {event.is_recurring && (
              <div className="flex items-start space-x-2">
                <RotateCw className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Recurrence</div>
                  <div className="capitalize">{event.recurrence_pattern}</div>
                  {event.recurrence_end_date && (
                    <div className="text-sm text-muted-foreground">
                      Until {format(new Date(event.recurrence_end_date), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-2">
              <Tag className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Type</div>
                <div>{event.event_type}</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <CheckSquare className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Status</div>
                <div className="capitalize">{event.status}</div>
              </div>
            </div>
          </div>
          
          {event.description && (
            <div className="mt-4 pt-4 border-t">
              <div className="font-medium mb-1">Description</div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onDelete} className="text-destructive bg-destructive/10 hover:bg-destructive/20 border-destructive/30">
          Delete
        </Button>
        <Button onClick={onEdit}>
          Edit Event
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
