
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UpcomingEventsProps {
  events: any[];
  onViewEvent: (event: any) => void;
  onAddAppointment: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  onViewEvent,
  onAddAppointment
}) => {
  if (!events || events.length === 0) return null;
  
  return (
    <Card className="mt-4">
      <CardHeader className="py-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <div className="space-y-3">
          {events.map(event => (
            <div 
              key={event.id} 
              className="flex justify-between items-center pb-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 rounded p-2 transition-colors"
              onClick={() => onViewEvent(event)}
            >
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{format(new Date(event.event_date), 'PP')}</div>
                <Badge variant={event.status === 'upcoming' ? 'default' : 'outline'}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-2">
        <Button variant="outline" size="sm" onClick={onAddAppointment} className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Add New Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingEvents;
