
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventsTabProps {
  events: any[];
  isLoading: boolean;
}

const EventsTab: React.FC<EventsTabProps> = ({ events, isLoading }) => {
  const navigate = useNavigate();

  const handleAddEvent = () => {
    // Navigate to calendar page to add a new event
    navigate('/calendar');
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Events</h2>
        <Button onClick={handleAddEvent} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="mr-2 h-5 w-5 flex-shrink-0" />
            <span className="truncate">Upcoming Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-4 overflow-x-hidden">
              {events.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted transition-colors overflow-hidden">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{event.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{event.date}</p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      event.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      event.status === 'tentative' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No events</h3>
              <p className="text-muted-foreground">
                You don't have any upcoming events scheduled.
              </p>
              <Button onClick={handleAddEvent} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsTab;
